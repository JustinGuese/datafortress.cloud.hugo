---
title: 'Same Answer, 1/32 of the Work: Adding a Sparse Mixture-of-Experts FFN to SpikingBrain (a 5B Brain-Inspired Model)'
bg_image: 'images/blog/s2moe-vs-dense.png'
date: 2026-07-30T09:10:00+02:00
author: 'Justin Guese'
description: 'I rebuilt the feed-forward layer of SpikingBrain 2.0 as a Top-1 sparse Mixture-of-Experts. Same quality at 1/32 the FFN compute, 2.71x fewer block FLOPs at their 5B shape - and the one result a second random seed deleted.'
image: 'images/blog/s2moe-vs-dense.png'
categories:
  - Machine Learning

tags:
  [
    'mixture of experts',
    'model efficiency',
    'spikingbrain',
    'cuda kernels',
    'open source',
  ]
type: post
---

## The simple version, in 60 seconds

Picture a repair shop with 32 specialists.

Today's AI models work like a shop where **every single job gets handed to all 32 people at once.** Everybody touches everything. It works. It's also enormously wasteful.

I rebuilt part of a 5-billion-parameter AI model ([SpikingBrain 2.0](https://github.com/BICLab/SpikingBrain2.0)) so that a receptionist reads each job first and passes it to **the one specialist who should handle it.**

Same shop. Same 32 specialists on the payroll. Same quality of work coming out.

**One thirty-second of the labour.**

That's the whole idea. The rest of this post is what happened when I measured it properly — including the one result I had to throw in the bin.

## What is a Mixture-of-Experts model?

In a normal neural network, every input runs through every parameter. It's a single enormous function, and all of it executes every time.

A **Mixture-of-Experts (MoE)** model splits that big function into many smaller ones — the "experts" — and puts a **router** in front. The router looks at each word and picks which expert handles it.

With **Top-1 routing**, exactly one expert runs per word. Not two, not a blend. One.

Here's the part that matters: **the cost per word doesn't change when you add more experts.** Sixty-four experts cost the same per word as eight, because you still only run one of them. But the model's total capacity grows every time you add one.

That isn't a clever trick anyone discovered. It's arithmetic. Which is exactly why it's trustworthy.

## What is SpikingBrain 2.0?

[SpikingBrain 2.0](https://github.com/BICLab/SpikingBrain2.0) is an open-source brain-inspired model family from the Institute of Automation, Chinese Academy of Sciences. Two 5B models, released with code and weights.

It's genuinely interesting work. It replaces standard attention with a hybrid of sparse softmax attention and sparse linear attention, adds an activation-coding scheme that supports event-driven hardware, and ships a conversion pipeline that turns existing Transformers into this architecture.

I read their released code rather than just the paper, and found the opening I needed: **every block is `attention → dense feed-forward`.** There is no expert routing in the feed-forward layer anywhere in the release.

So a sparse MoE feed-forward isn't a competing idea to theirs. It's an **empty slot.**

## What I added

Four mechanisms, taken from [my own research repo](https://github.com/JustinGuese/S2-MoE-llm) and ported into their block:

- **A Top-1 routed pool of experts** replacing the dense feed-forward layer.
- **An always-on shared core** — one small expert every word passes through, alongside the routed one.
- **A grouped-GEMM CUDA kernel**, because without it the whole thing is slower (more on this below).
- **A dense-to-MoE upcycler**, so the expert pool can be built from their _existing trained weights_ rather than requiring a retrain from scratch.

Everything sits behind a config key that's absent from all six of their shipped configs. **Their released checkpoints load and run byte-for-byte as before** unless you deliberately switch it on. There's a test that asserts it.

## Result: the same quality at 1/32 the feed-forward compute

Here's the core measurement.

At **matched parameter count** — 77.8M for the sparse model versus 77.7M for a dense control, 0.2% apart — the sparse model reaches **the same validation perplexity** while running **1/32 of the feed-forward compute.**

That's **32× the accuracy per unit of active compute.**

Same size. Same quality. One thirty-second of the work in that layer.

This is the sparse-MoE proposition working exactly as advertised: capacity scales with the pool, active compute stays flat.

## What that's worth at their 5B scale

Compute claims are determined by tensor shapes, not by training — so they can be measured directly at SpikingBrain's real 5B block dimensions with random weights, in about twenty minutes on a single RTX 4090.

At `hidden_size 2560`, `intermediate_size 9728`, bf16, parameter-matched, batch 8 × sequence 512:

| Feed-forward              | MFLOP/token | mJ/token | Active watts | Tokens/sec  |
| ------------------------- | ----------- | -------- | ------------ | ----------- |
| Dense SwiGLU (their code) | 229.1       | 0.669    | 298.5        | **446,070** |
| Sparse MoE, 16 experts    | 89.1        | 0.419    | 138.9        | 331,697     |
| Sparse MoE, 32 experts    | 84.5        | 0.412    | 133.7        | 324,344     |
| Sparse MoE, 64 experts    | 82.3        | 0.414    | 123.7        | 299,053     |

**2.71× fewer FLOPs per block. 1.62× less energy per token. Less than half the power draw** — 134 W against 299 W.

## Why 1/32 doesn't turn into 32× overall

Look at that table again. The feed-forward compute dropped 32×, but the whole block only dropped 2.71×. Where did the rest go?

**The always-on parts don't shrink.** Attention still runs on every word. The router runs on every word. The shared core runs on every word.

Optimising one component can only ever save you that component's share of the total. Once the feed-forward layer is nearly free, everything else becomes the floor — and you've hit the ceiling of what feed-forward sparsity can do.

If you take one number from this post for your own work, take that one. It tells you when to stop optimising this layer and go look at another.

## The honest bit: the dense model is faster

Read the tokens-per-second column properly. **446,000 for dense against 324,000 for sparse.** Dense wins by a comfortable margin.

The win here is **FLOPs and power, not wall-clock throughput.**

The reason is unglamorous: one wide dense matrix multiply uses a GPU better than a grouped matrix multiply plus a router plus a shared core. GPUs are built for big regular blocks of arithmetic.

On power-limited or event-driven hardware, that trade inverts and the sparse model wins. On a throughput-bound datacentre GPU, it doesn't. Anyone benchmarking this would find that in ten minutes, so there's no point pretending otherwise.

## Sparse models are slower without the right CUDA kernel

This is the part I'd most want another engineer to take away.

The obvious implementation loops over experts in Python — one iteration, one kernel launch each. That overhead is fixed per expert, so it grows exactly as fast as your saving does.

**Measured on its own, the naive sparse layer was slower than dense at every expert count.** The FLOP saving existed on paper and absolutely nowhere else.

The fix: sort tokens by their assigned expert into contiguous blocks and issue one grouped matrix multiply over all of them. I wrapped `torch._grouped_mm` in an autograd function with an explicit backward pass so it works in training too.

| Experts                | 8     | 16    | 32    | 64         |
| ---------------------- | ----- | ----- | ----- | ---------- |
| Forward vs Python loop | 2.27× | 4.60× | 8.29× | **12.75×** |
| Training step vs loop  | 1.85× | 3.99× | 6.34× | **9.95×**  |

And it's **bit-exact** — maximum absolute difference of zero against the loop, on the outputs and on both weight gradients. This is pure overhead removal, not an approximation.

**An efficient architecture without its kernel is just a slower architecture.** The FLOP count is a promise; the kernel is whether it gets paid.

## A CUDA bug that hangs your GPU silently

Worth knowing if you ever touch this op: **`torch._grouped_mm` deadlocks on degenerate group splits.**

When expert occupancy is uneven, you get zero-width segments. Feed those to the kernel and it hangs — GPU idle, one CPU core spinning, no error, no timeout. It looks exactly like a slow training step until you notice it's been slow for six hours.

Compacting the empty groups out before the call is mathematically identical and removes the trigger entirely.

## Does the sparsity survive batched serving?

Two different claims here that get muddled constantly, so let's separate them.

**FLOPs per token stay at 1/32 at any batch size.** Each word goes through exactly one expert no matter how many words are in flight. The table above was measured at batch 8 — those are already batched numbers.

**What collapses with batch size is expert _residency_** — the ability to keep only the active experts loaded in memory. At batch 1 you touch one expert of 32 and can skip the rest. At batch 64, the _union_ of experts touched covers most of the pool:

| Batch size     | 1     | 32    | 64    |
| -------------- | ----- | ----- | ----- |
| Union sparsity | 96.9% | 39.7% | 14.1% |

So expert offloading and event-driven weight gating are **single-stream propositions.** The compute and energy reductions are not — those hold under batching.

This distinction is why "contextual sparsity" methods keep failing to reach production serving stacks, and why it pays to be precise about which of the two you're claiming.

## The result I deleted: one random seed erased a 2.1% win

Now the uncomfortable part.

I also had a **quality** win. The sparse model beat its dense control by 2.1% perplexity — 58.99 against 60.27. Nice number. It went into the write-up.

Then I ran one more seed to get error bars.

The win vanished. Second seed: **58.52 against 58.54.** A dead tie.

Here's what actually happened. The **dense baseline** moved 2.9% between seeds (60.27 → 58.54). My model moved 0.8% (58.99 → 58.52). The first seed hadn't shown my model doing well. It had shown **the baseline doing badly.**

Across both seeds the gap is −1.1% with a ±1.05 percentage-point spread. Indistinguishable from parity.

**The lesson generalises: your baseline has variance too.** A single-seed comparison doesn't measure your method — it measures both models' luck. I had even written the rule down beforehand ("one seed, anything under a couple of percent is not a conclusion") and 2.1% sat right on the line, which is precisely where such rules stop being decorative.

The core result — parity at 1/32 the compute — was never affected. Losing a bonus doesn't remove the main course. But the 2.1% is gone and it isn't coming back.

## What else didn't work

Two of the four mechanisms did not earn their keep, and reporting that is cheaper than having someone else discover it.

**Spiking activations cost 2.8% perplexity at identical compute.** Binary 0/1 activations produce genuine activation sparsity — but a dense GPU kernel cannot cash it. So on this hardware it's a pure quality cost. Its value is compatibility with event-driven neuromorphic chips, which is a real argument, just not an accuracy or GPU-efficiency one.

**The sleep phase is inert next to a shared core.** It restructures the expert pool during training — merging duplicates, pruning, regrowing. Result: −0.28% perplexity for 5.2% extra training time. The logs explain why: across all ten cycles it merged nothing. **The always-on shared core absorbs exactly the redundancy that merging exists to remove.** Two mechanisms doing the same job, so the second one has nothing left to do.

**Even the shared core is a trade, not a free win** — it buys 2.5% perplexity for 52% more active feed-forward compute. Worth it if you're optimising quality, not if you're optimising compute.

## Two bugs in their released setup

Following their own installation notes on a clean machine, two things break. Both are trivial once you know, both cost an hour if you don't:

**Their bundled MoBA still pins `flash-attn==2.6.3`.** Installing it silently uninstalls the `flash-attn==2.7.3` their instructions ask for one line earlier, then fails to build 2.6.3 from source. Installing with `--no-deps` fixes it, and matches their own note that the bundled copy was adapted to the newer interface. The pin is stale metadata.

**`import fla` needs a C compiler and Python headers present.** Triton compiles a launcher stub at import time. On a minimal CUDA image without `build-essential` and `python3-dev`, it just dies.

## Auditing their mechanism instead of mine

The most interesting thing I built isn't the MoE. It's a diagnostic for **their** architecture.

Their sparse linear attention picks 2 of 4 state partitions per word, trained toward balanced usage by an auxiliary loss. That loss only runs during training. **Nothing guarantees the balance survived into the released weights** — and neither way it can fail shows up in perplexity or benchmark scores:

- **Usage collapse** — a few partitions take most of the picks, so the expanded state is effectively smaller than configured and its memory cost buys less than advertised.
- **Input-independence** — usage looks balanced overall, but every word picks the _same_ pair. The histogram looks perfect while the routing carries no information at all.

There's a trap in measuring this. Loading the model with `trust_remote_code=True` imports the modelling code **bundled in the checkpoint directory**, not the copy in the repository. Patch the repository's module and you'll measure something the model never calls, and get a confident-looking table of nothing.

The result, across the checkpoint's full trained context range:

| Context length   | 1,024  | 4,096  | 8,192  |
| ---------------- | ------ | ------ | ------ |
| Usage entropy    | 0.9868 | 0.9868 | 0.9863 |
| Most-common pair | 25.7%  | 26.2%  | 26.5%  |
| All 6 pairs used | yes    | yes    | yes    |

Entropy of 1.0 means perfectly balanced. A 16.7% share would mean perfectly uniform across pairs.

**Both failure modes are absent, at every length.** Over an 8× context increase the entropy moves by 0.0005. Their auxiliary loss did its job and the property held.

That's a null result, and I'm reporting it as one. It's now [an open discussion on their repo](https://github.com/BICLab/SpikingBrain2.0/issues/4).

## Honest scope

Everything above, bounded:

- **Nothing has been trained at 5B or on their checkpoints.** The quality work is at ≤146M parameters, from scratch. The 5B numbers are block-level and shape-determined.
- **Quality results are one to two seeds.** One already collapsed. Directions are findings; magnitudes are provisional.
- **The quality edge reverses at long training budgets** — a −5.15% advantage at a fixed budget became +2.4% at 4× the budget. [I wrote that up separately](/blog/s2moe_budget_dependent_benchmarking/). SpikingBrain trains far past that point.
- **Energy on a GPU is really FLOPs over latency.** Power varies little across architectures, so the defensible framing is serving cost per token, not raw joules. Real event-driven energy accounting needs neuromorphic silicon I haven't measured on.

## What holds

- **Matched-parameter parity at 1/32 the active feed-forward compute.** 32× accuracy per unit of active compute.
- **2.71× fewer block FLOPs and 1.62× less energy per token** at their real 5B block shape, from random weights.
- **The grouped-GEMM kernel is what makes it real** — bit-exact, up to 12.75× faster than the naive loop. Without it the sparse model is slower than dense.
- **A ceiling worth knowing:** feed-forward sparsity can only ever save you the feed-forward share. After that the always-on parts are the floor.
- **A validated diagnostic** for SpikingBrain's own partition routing, which came back healthy.

## FAQ

**Does Mixture-of-Experts actually reduce compute?**
Yes, and by a predictable amount. Top-1 routing runs one expert per token whatever the pool size, so feed-forward compute is `1/n_experts` of a parameter-matched dense layer. At 32 experts that's measured at 1/32, which becomes 2.71× fewer FLOPs for the whole block once the always-on parts are counted.

**Is a sparse MoE model faster than a dense one?**
Not necessarily, and here it wasn't — 324k tokens/sec against 446k for dense. Fewer FLOPs is not the same as lower latency. The win was in FLOPs and power draw (134 W vs 299 W), not throughput.

**Does MoE sparsity survive batched serving?**
The compute saving does — every token still traverses one expert regardless of batch size. What doesn't survive is expert _residency_: the union of experts touched across a batch goes from 96.9% sparse at batch 1 to 14.1% at batch 64, so expert offloading is a single-stream technique.

**Do spiking activations improve accuracy?**
Not in this measurement. They cost 2.8% perplexity at identical compute. The benefit is compatibility with event-driven neuromorphic hardware, not accuracy or GPU efficiency.

**How many seeds do you need to claim a quality improvement?**
More than one, and this post is the cautionary tale. A 2.1% advantage disappeared on the second seed because the _dense baseline_ had drawn a bad seed. Single-seed comparisons measure luck, not method.

**Can you convert an existing dense model into a Mixture-of-Experts?**
Yes — that's what the upcycler does. It initialises each expert from slices of the trained dense feed-forward weights rather than from scratch. It's a weight-initialisation bridge and still needs continued training to recover quality; it is not a free conversion.

## Reproduce it

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
cd SpikingBrain2.0-s2moe

# Energy and FLOPs at SpikingBrain's real 5B block shape - random weights, no training
python spb2/s2moe/bench/bench_energy.py --n-experts 32 --param-match
python spb2/s2moe/bench/bench_active_flops.py --n-experts 32

# Kernel equivalence and speedup, forward and training
python spb2/s2moe/bench/bench_dispatch.py

# Audit the released checkpoint's partition routing
python run_model_forward/probe_sse_selection.py --model-path /path/to/SpikingBrain-2.0-base-8k
```

- **The fork, with everything above:** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **The original research repo:** [github.com/JustinGuese/S2-MoE-llm](https://github.com/JustinGuese/S2-MoE-llm)
- **Upstream:** [BICLab/SpikingBrain2.0](https://github.com/BICLab/SpikingBrain2.0)
- **Open discussion:** [BICLab/SpikingBrain2.0#4](https://github.com/BICLab/SpikingBrain2.0/issues/4)

Related reading here: [why the energy win grows with expert count](/blog/s2moe_energy_scaling_sparse_moe/) and [how the quality claim reversed under a longer training budget](/blog/s2moe_budget_dependent_benchmarking/).

Background: [Switch Transformer](https://arxiv.org/abs/2101.03961) on Top-1 routing, [DeepSeekMoE](https://arxiv.org/abs/2401.06066) on shared experts, [Drop-Upcycling](https://arxiv.org/abs/2502.19261) on dense-to-MoE conversion.

If a number here disagrees with the experiment log in the repo, the log wins — open an issue.
