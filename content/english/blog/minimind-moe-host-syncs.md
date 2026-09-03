---
title: '96 Times Per Word, the GPU Stops and Waits: Fixing the MoE Layer in a 58,000-Star Teaching Repo'
bg_image: 'images/blog/minmind.png'
date: 2026-09-03T12:11:00+02:00
author: 'Justin Guese'
description: "minimind's Mixture-of-Experts layer halts the GPU 96 times per forward pass to ask the CPU a bookkeeping question. I cut it to 8, bit-identically. Plus: the approach that lost, the benchmark table where none of the differences are real, and every claim I had to shrink."
image: 'images/blog/minmind.png'
categories:
  - Machine Learning

tags:
  [
    'mixture of experts',
    'pytorch',
    'gpu performance',
    'open source',
    'benchmarking',
  ]
type: post
---

**Everything in this post is public and checkable:**
[Issue #835](https://github.com/jingyaogong/minimind/issues/835) (the diagnosis) ·
[PR #836](https://github.com/jingyaogong/minimind/pull/836) (CLI flags) ·
[PR #837](https://github.com/jingyaogong/minimind/pull/837) (the fix) ·
[Discussion #838](https://github.com/jingyaogong/minimind/discussions/838) (expert utilisation) ·
[Discussion #839](https://github.com/jingyaogong/minimind/discussions/839) (benchmark error bars) ·
[PR #840](https://github.com/jingyaogong/minimind/pull/840) (docs)

## What is minimind?

[minimind](https://github.com/jingyaogong/minimind) is one of the most-starred educational AI projects on GitHub - **58,000 stars** - and it does something genuinely rare. It lets you train a language model from scratch, end to end, on a single GPU in a few hours: tokenizer, pretraining, supervised fine-tuning, LoRA, RLHF, the whole pipeline. Deliberately **no DeepSpeed, no Megatron, no custom CUDA**. Just PyTorch you can read line by line. That readability is the product.

It also ships a **Mixture-of-Experts** variant. In a normal network every word passes through every parameter. An MoE splits the feed-forward layer into several smaller "experts" and puts a **router** in front that sends each word to just one of them. Total capacity grows with the number of experts; the cost per word doesn't, because you still only run one. minimind's default is 4 experts, top-1.

And its README is refreshingly honest about a wart. At that default, the MoE model runs about **50% slower** than an equivalent dense model. It attributes this to kernel launch and scheduling overhead, and concludes that fixing it would need a fused-MoE operator library - Triton kernels, DeepSpeed-MoE, Megatron-LM - all of which the project declines, on principle, to depend on.

That conclusion is what drew me in. I think the diagnosis is incomplete in an interesting way: a large, removable part of that overhead isn't launch cost at all, and removing it needs none of those libraries.

## What I brought over from my own MoE work - and what didn't survive

[S2-MoE-llm](https://github.com/JustinGuese/S2-MoE-llm) ([DOI 10.5281/zenodo.20846758](https://doi.org/10.5281/zenodo.20846758)) is my sparse-MoE research repo. It has four main pieces: a top-1 routed expert pool, an always-on shared core, a **grouped-GEMM dispatch kernel**, and a dense-to-MoE upcycler. Earlier this year I ported them into a 5B brain-inspired model, [SpikingBrain 2.0](/blog/s2moe_spikingbrain_improvements/).

It would be easy - and wrong - to describe this post as "porting those improvements to a second repo." Here is what actually transferred:

- **The routed pool, the shared core, the upcycler: no slot.** minimind _already_ has top-1 routing with an auxiliary load-balancing loss. There was nothing to add.
- **The grouped-GEMM kernel: transferred directly, and failed.** It's the one component that ported cleanly. I gave it a pre-registered threshold - 1.5× on the training step at the default config - and it hit **0.97–1.32×**. Withdrawn. Details below, because the way it lost is the most useful part.
- **What actually worked** was the humbler idea underneath that kernel - _sort the tokens by expert first_ - which turned out to deliver nearly all of the benefit on its own, without the kernel.
- **And the method transferred:** pre-registered kill gates, bit-exactness as a pass/fail gate rather than a hope, and a refusal to quote a laptop benchmark as a general result.

So: second repo, different finding, same discipline. The finding here came from reading minimind's code closely, not from carrying code across.

## The results

|                                                   |                                                                                                   |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Host stalls per forward pass**                  | **96 → 8** (exactly `3 × experts` per layer → 1)                                                  |
| **MoE layer speed**, ≥4 experts, bare-metal Linux | **1.2–1.5× faster**                                                                               |
| **MoE layer speed**, 2 experts                    | **no gain** (0.89–1.07×)                                                                          |
| **Numerics**                                      | **bit-identical** forward and parameter gradients; input gradients differ by 1 ulp at top-k ≥ 3   |
| **Works on**                                      | every CUDA GPU - no capability gate, no bf16 requirement, no new dependency                       |
| **Expert utilisation** (released MoE checkpoint)  | routing **3.8× more imbalanced** than random init; **5 of 32** expert slots under 2.5% of traffic |
| **Their benchmark table**                         | **0 of 6** dense-vs-MoE differences are statistically significant                                 |
| **Claims I retracted or shrank**                  | **6**                                                                                             |

Six artefacts are open upstream - one issue, three PRs, two discussions - all linked above and again at the end.

## The simple version, in 60 seconds

Imagine a chef with four assistant cooks.

An order comes in. The chef needs to know which assistant should handle it. So he **puts down his knife, walks to the office, asks the manager, and walks back.** Then he does it again for the second assistant. And the third. And the fourth.

Three trips to the office per assistant. Twelve trips. Then the next order arrives and it starts over.

The cooking itself is fast. The **walking** is what's killing dinner service.

That is, almost exactly, what happens inside the Mixture-of-Experts layer of [minimind](https://github.com/jingyaogong/minimind) - a wonderful open-source project with 58,000 GitHub stars that teaches people how to train a language model from scratch. Every time the model processes text, its GPU stops dead and waits for the CPU **96 times**, purely to ask questions about _which expert gets which word_. No maths happens during those stops. It's all walking to the office.

I changed it so the chef asks **once**, gets the whole list, and never leaves the kitchen again.

96 stops → 8. Same food out of the kitchen - I mean that literally: the numbers the GPU produces are bit-for-bit identical.

The rest of this post is the measurement, the maths, the approach that **lost**, and the six claims I had to make smaller or delete outright.

## What a "host sync" actually costs

Your GPU runs asynchronously. Python queues up work and races ahead; the GPU chews through the queue behind it. That's the whole performance model - keep the queue full, never let the GPU go idle.

A **device→host synchronization** breaks it. It happens whenever your Python code needs to _know_ a value that lives on the GPU: an `if` on a GPU boolean, the length of a filtered array, anything where the next line of Python depends on a number the GPU is still computing.

At that moment the pipeline drains. The CPU waits for every queued kernel to finish, copies one number back over PCIe, and only then can it queue more work. The GPU sits idle for the round trip.

Here's minimind's expert loop:

```python
for i, expert in enumerate(self.experts):
    mask = (topk_idx == i)
    if mask.any():                                     # sync #1
        token_idx = mask.any(dim=-1).nonzero().flatten()    # sync #2
        weight = topk_weight[mask].view(-1, 1)              # sync #3
        y.index_add_(0, token_idx, (expert(x_flat[token_idx]) * weight).to(y.dtype))
```

Three syncs, per expert:

1. `if mask.any()` - Python needs a real `True`/`False` to branch on. Round trip.
2. `.nonzero()` - the output array's _length_ depends on the data, and the CPU must know it to allocate. Round trip.
3. `topk_weight[mask]` - boolean-mask indexing, same problem. Round trip.

That's `3 × num_experts` per layer. **Not once per batch - every layer, every forward pass.**

### Measuring it instead of asserting it

PyTorch ships an instrument for exactly this, and almost nobody uses it: `torch.cuda.set_sync_debug_mode('warn')` makes PyTorch emit a warning every time it performs a synchronization. Count the warnings and you have a hard number.

Run against **unmodified upstream minimind**:

| num_experts | syncs per layer, per forward | 3 × E |
| ----------- | ---------------------------- | ----- |
| 4 (default) | **12**                       | 12    |
| 8           | **24**                       | 24    |
| 16          | **48**                       | 48    |

Exactly `3E`. At minimind's default - 4 experts across 8 layers - that's **96 synchronizations per forward pass.** At 16 experts, 384.

This number is an integer. It doesn't depend on your GPU, your driver, your batch size, or your luck. That property matters later.

## The fix: ask once

The loop only needs one thing from the CPU's point of view: **how many tokens did each expert get?** That can be computed once instead of `3E` times.

Sort the tokens by which expert they were routed to. Now every expert's tokens are one contiguous block. Find the block boundaries with a binary search, copy _those_ to the CPU in a single call, and hand each expert a plain slice:

```python
flat = topk_idx.reshape(-1)
idx_sorted, order = torch.sort(flat, stable=True)
ends = torch.searchsorted(idx_sorted, torch.arange(e, device=x_flat.device, dtype=flat.dtype), right=True)
token_idx = order.div(k, rounding_mode='floor')
x_sorted = x_flat.index_select(0, token_idx)
weight = topk_weight.reshape(-1).index_select(0, order).unsqueeze(1)

bounds = [0] + ends.tolist()          # <- the only sync in the entire layer

y, outs = torch.zeros_like(x_flat), []
for i, expert in enumerate(self.experts):
    lo, hi = bounds[i], bounds[i + 1]
    if hi > lo:
        outs.append(expert(x_sorted[lo:hi]))   # plain Python ints. No sync.
    elif self.training:
        y[0, 0] += 0 * sum(p.sum() for p in expert.parameters())
if outs:
    y.index_add_(0, token_idx, (torch.cat(outs) * weight).to(y.dtype))
```

`3E → 1`, independent of expert count. No new dependency, no custom kernel, no hardware requirement. It's still a readable Python loop over experts, which for a teaching repo is the point.

The load-bearing detail is **`stable=True`**. A stable sort preserves the original order of tokens _within_ each expert's group. So every expert receives exactly the rows it received before, in exactly the same order - which is why the output isn't merely close, it's identical.

### "Identical" is a strong word, so I tested it as one

Not `allclose` with a hopeful tolerance. `torch.equal`.

|                          | top-k ≤ 2 | top-k ≥ 3                     |
| ------------------------ | --------- | ----------------------------- |
| forward output           | **exact** | **exact**                     |
| every parameter gradient | **exact** | **exact**                     |
| input gradient           | **exact** | ~1 ulp (3e-8 abs, 1.2e-7 rel) |

Across experts ∈ {1,2,4,8} × top-k ∈ {1,2,3,4,8} × train/eval on CPU, and fp32 + bf16 on CUDA. Plus a full 12-step training run - AdamW, gradient clipping, aux loss - where every loss value matched to the last digit and all 45 parameter tensors were `torch.equal` afterwards.

That one non-exact cell is worth explaining rather than hiding, because it's a nice bit of floating-point reality. At top-k ≥ 3, each token sums three or more expert contributions into its input gradient. Floating-point addition **is not associative**: `(a + b) + c` and `a + (b + c)` can differ by one unit in the last place. The two implementations sum in different orders, so they differ by exactly one rounding step - 1.2e-7 relative, against fp32's epsilon of 1.2e-7.

At top-k ≤ 2 - which covers minimind's default top-1 and every configuration it ships - a sum of two numbers is order-independent, so it's exact. The test asserts `torch.equal` below k=3 and a 1e-6 bound above it.

I only found this because I tested k=3 and k=4 _gradients_. My earlier tests had checked those values for the forward pass only. If I'd shipped the "bit-identical everywhere" claim I'd been carrying, a reviewer could have falsified it in one command.

## The speed - and the $0.09 that made my own number smaller

Here's where it gets interesting, and where I nearly published something misleading.

A sync costs a **round trip to the host**. So its price is set by your CPU and PCIe path, _not_ by your GPU. Measure your own:

```python
import time, torch
flag = torch.zeros(1, dtype=torch.bool, device='cuda')
for _ in range(20): flag.any().item()
torch.cuda.synchronize(); t0 = time.perf_counter()
for _ in range(100): flag.any().item()
torch.cuda.synchronize()
print(f'{(time.perf_counter() - t0) / 100 * 1e6:.1f} us per round trip')
```

My development machine is a laptop RTX 5070 under WSL2. It reports **116 µs** per round trip. On that machine the fix looked spectacular: up to **2.0× faster**.

That number is garbage as a general claim. WSL2's driver path is pathologically slow at exactly this operation - which means it's the environment that most flatters a fix like mine.

So I rented a bare-metal Linux box with two RTX 3090s on vast.ai. Nine cents. It reports **26 µs** per round trip - 4.4× cheaper.

| experts     | WSL2 (116 µs) | bare-metal Linux (26 µs), n=4 |
| ----------- | ------------- | ----------------------------- |
| 2           | 1.29×         | **0.89 – 1.07×** (no gain)    |
| 4 (default) | 1.56×         | **1.39 – 1.44×**              |
| 8           | 1.94×         | 1.19 – 1.47×                  |
| 16          | 2.01×         | 1.21 – 1.49×                  |

The honest headline is **~1.2–1.5× on the MoE layer at 4 or more experts, and nothing at all at 2 experts.** Not 2×.

Why nothing at 2 experts? With E=2 there are only 6 syncs per layer to remove - about 157 µs of stalling - and the sort, gather and scatter cost roughly what they save. The fix has a floor, and at two experts you're below it. I ran that configuration four times (0.89, 1.07, 0.97, 0.94) precisely because a single run would have let me report either "small regression" or "small win" depending on which I preferred.

Nine cents made my headline number 30% smaller. That is the best nine cents in this entire project.

## The approach that lost

I didn't start with the sorted loop. I started with something much more exciting.

PyTorch has a private operator, `torch._grouped_mm`, that multiplies many differently-sized matrices in a single kernel launch. It is _made_ for MoE dispatch. I built the whole thing: fused expert weights in a `(E, K, N)` layout, a custom `autograd.Function` for the backward pass, `state_dict` hooks so existing checkpoints still load.

Before benchmarking, I wrote down a threshold: **it has to reach 1.5× on the full training step at the default 4 experts, or it isn't worth proposing.**

It got **0.97–1.32×** across two machines. So it was withdrawn.

Then I built the boring sorted loop as a _control_ - to separate "removing the syncs" from "changing the kernel" - and it **beat the fancy version at 14 of 15 measured points**, while also:

- working on every GPU (the grouped op needs compute capability ≥ 9.0, so it's a deliberate no-op on the RTX 3090s and 4090s most readers own);
- requiring no bf16, no stride alignment, no capability check, no fallback branch;
- being bit-identical rather than "justifiable against an fp32 reference".

Nearly the entire benefit was the syncs. The exotic kernel was the wrong variable.

The dead branch is [kept and linked from the issue](https://github.com/JustinGuese/minimind/tree/moe-grouped-dispatch) as a documented negative result. Deleting it would have hidden the most useful part of the story.

## Two more measurements, since I had the model loaded

### Are those four experts actually being used?

minimind's released MoE checkpoint exports as a standard `Qwen3MoeForCausalLM`, so auditing it needs nothing but a forward hook. I ran 1,346 C-Eval questions across all 52 subjects through it, split into 5 disjoint shards to get a noise floor, and measured two things per layer:

- **`load_tv`** = ½·L1(token distribution, uniform). `0` = perfectly balanced, `0.75` = everything on one expert (at E=4).
- **Router entropy** over the full softmax. Max = `ln 4` = 1.386 nats.

The number alone would be uninterpretable, so I ran the **same architecture with random untrained weights** as a control:

|                                    | random init          | trained minimind-3-moe |
| ---------------------------------- | -------------------- | ---------------------- |
| `load_tv`                          | 0.068                | **0.255**              |
| router entropy                     | 1.280 (92.3% of max) | **0.863** (62.3%)      |
| expert slots under 2.5% of traffic | 0 / 32               | **5 / 32**             |

Training made routing **3.8× more imbalanced than random initialisation**, despite an auxiliary load-balancing loss. Five of 32 expert slots receive under 2.5% of tokens where uniform would be 25%. Layer 6's third expert gets **0.22%** - one expert in that layer takes 64.8% of everything.

That's 41× the shard-to-shard noise floor, so it isn't sampling variation.

I want to be careful about what this does and doesn't mean. Imbalance is **not automatically bad** - it can be genuine specialisation, and I measured no quality impact whatsoever. But with only four experts, five near-dead slots means the _effective_ expert count is meaningfully below four, and you're paying full parameter cost for all of them.

### How big does a benchmark difference have to be before it's real?

minimind publishes a benchmark table comparing its dense and MoE models against several third-party baselines. `lm_eval`, the harness it uses, reports a **standard error** for every metric. The table keeps only the point estimates.

For a proportion, the standard error is `√(p(1−p)/n)` - it's driven almost entirely by how many questions are in the test set:

| dataset   | openbookqa | ceval | piqa | siqa | arc  | hellaswag | cmmlu |
| --------- | ---------- | ----- | ---- | ---- | ---- | --------- | ----- |
| questions | 500        | ~1.3k | 1838 | 1954 | 2376 | 10042     | 11582 |
| ± stderr  | **1.9**    | 1.2   | 1.2  | 1.1  | 0.9  | 0.5       | 0.4   |

Comparing _two_ models widens that by about `√2`. Applying it to the published dense-vs-MoE rows:

| task        | dense | MoE   | Δ     | se(Δ) | Δ/se     |
| ----------- | ----- | ----- | ----- | ----- | -------- |
| ceval-valid | 24.89 | 25.48 | +0.59 | 1.65  | 0.36     |
| arc_easy    | 28.49 | 27.74 | −0.75 | 1.31  | 0.57     |
| piqa        | 50.65 | 50.71 | +0.06 | 1.65  | 0.04     |
| openbookqa  | 23.60 | 26.20 | +2.60 | 2.78  | 0.94     |
| hellaswag   | 28.28 | 27.43 | −0.85 | 0.63  | **1.34** |
| social_iqa  | 34.19 | 34.03 | −0.16 | 1.52  | 0.11     |

**Zero of six reach statistical significance.** The largest is 1.34σ, where 1.96σ is the usual bar. On this evidence the 64M dense model and the 198M MoE model are not separated by these benchmarks _in either direction_.

And C-Eval is four-choice, so its random baseline is 25.00. Both models score 24.89 and 25.48, with an error bar of ±1.17. That column is measuring nothing but coin flips - which, to be fair, minimind's README already says in prose. My contribution is putting a number on it.

## Everything I got wrong

This is the part I'd actually read first, in someone else's post.

**The aux-loss "bug" that wasn't.** I was fairly sure minimind's load-balancing loss was mis-scaled at top-k > 1. Before filing it, I diffed it numerically against `transformers`' own Qwen3-MoE implementation. Ratio: **exactly 1.000000**, at k = 1, 2, 3 and 4. The suspicious-looking axis is collapsed by a later `.sum()`. Withdrawn before it ever became an issue.

**The graph-break argument, refuted by measurement.** I predicted the masked loop would produce ~3E graph breaks under `torch.compile` versus 1 for mine - a hardware-independent argument needing no speed claim. The counter reported **0 for the masked loop and 3 for mine**, the opposite. And `fullgraph=True` shows both actually fail to compile. The argument is dead, and it's documented in the issue as a _limitation_ rather than quietly dropped.

**"Bit-identical" was too strong** - see the one-ulp table above.

**My first reproduction failure was my own fault.** I couldn't match the published benchmark numbers and briefly believed they weren't reproducible. They are, to within about one standard error, once you use `acc_norm` where available and _don't_ pass `--apply_chat_template`.

**The memory argument was backwards.** I was going to argue that minimind wastes parameters by keeping experts full-width, since Qwen3-MoE narrows them. I checked the actual configs first. Qwen3-30B-A3B is 128 experts at 1/8 width = **16× a dense model's FFN parameters**. minimind is 4 experts at full width = **4×**. minimind is _more_ frugal. The real difference is granularity, not waste. The argument died before it was published.

**And the headline shrank twice** - once from ~2× to ~1.4× when I paid for a proper host, and once more at E=2 where it's simply zero.

There's a pattern here, and it's the actual point of the post: **every number that got scrutinised got smaller.** The ones that survived - the integer `3E`, the bit-exactness at top-1, the 41× signal-to-noise on the routing imbalance - survived because they're the kind of thing that _can't_ shrink. That's what makes them worth reporting.

## Reproduce any of it

```bash
git clone https://github.com/JustinGuese/minimind
cd minimind && git checkout moe-sorted-dispatch

# Correctness: 6/6, including the sync-count assertion (3E -> 1)
python scripts/test_moe_sorted.py

# What does a host sync cost on YOUR machine?
python scripts/bench_moe.py --mode sync-probe

# Speedup vs the original masked loop
python scripts/bench_moe.py --mode layer --experts 2,4,8,16
```

Count the syncs in unmodified upstream yourself:

```python
import warnings, torch
from model.model_minimind import MiniMindConfig, MOEFeedForward

cfg = MiniMindConfig(hidden_size=512, intermediate_size=1408, moe_intermediate_size=1408,
                     num_experts=8, num_experts_per_tok=1, use_moe=True)
m = MOEFeedForward(cfg).cuda().train()
x = torch.randn(8, 512, 512, device='cuda')
m(x); torch.cuda.synchronize()                      # warm up

torch.cuda.set_sync_debug_mode('warn')
with warnings.catch_warnings(record=True) as w:
    warnings.simplefilter('always')
    m(x)
torch.cuda.set_sync_debug_mode('default')
print(sum('sync' in str(r.message).lower() for r in w))   # -> 24
```

## Links

- **The diagnosis:** [minimind#835](https://github.com/jingyaogong/minimind/issues/835)
- **The fix:** [minimind#837](https://github.com/jingyaogong/minimind/pull/837)
- **CLI flags for experts and seed:** [minimind#836](https://github.com/jingyaogong/minimind/pull/836)
- **Expert utilisation audit:** [minimind discussion #838](https://github.com/jingyaogong/minimind/discussions/838)
- **Benchmark error bars:** [minimind discussion #839](https://github.com/jingyaogong/minimind/discussions/839)
- **Docs patch:** [minimind#840](https://github.com/jingyaogong/minimind/pull/840)
- **The approach that lost:** [moe-grouped-dispatch branch](https://github.com/JustinGuese/minimind/tree/moe-grouped-dispatch)
- **Upstream:** [jingyaogong/minimind](https://github.com/jingyaogong/minimind)

- **My MoE research repo:** [S2-MoE-llm](https://github.com/JustinGuese/S2-MoE-llm) ([DOI 10.5281/zenodo.20846758](https://doi.org/10.5281/zenodo.20846758))

Related reading: [the SpikingBrain MoE port](/blog/s2moe_spikingbrain_improvements/), where a 2.1% quality win evaporated on the second random seed. That is the lesson that made me distrust my own 2× here, rent a proper machine, and find out it was 1.4×.

If a number in this post disagrees with the linked PRs, the PRs win - open an issue.
