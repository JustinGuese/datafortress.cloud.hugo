---
title: 'The Efficiency Win That Gets Bigger As The Model Does: Energy per Token in a Top-1 Spiking MoE'
bg_image: 'images/blog/energy-scaling.png'
date: 2026-07-26T09:10:00+02:00
author: 'Justin Guese'
description: 'Top-1 routing makes FFN cost constant in expert count, so energy per token falls as you add experts. Measured on H100 - 5.1x less at 1B params, plus where FLOPs stop predicting joules.'
image: 'images/blog/energy-scaling.png'
categories:
  - Machine Learning
tags:
  [
    'mixture of experts',
    'energy efficiency',
    'inference optimization',
    'neuromorphic computing',
    'cuda kernels',
  ]
type: post
---

# The Efficiency Win That Gets Bigger As The Model Does: Energy per Token in a Top-1 Spiking MoE

**TL;DR**

- Top-1 routing runs **one** expert per token regardless of pool size, so feed-forward cost is **constant in expert count** while a parameter-matched dense model's cost grows linearly. Adding experts _lowers_ energy per token.
- Measured on an H100 across three model scales: **1.46× → 3.07× → 5.08×** less energy per token at 8 / 32 / 64 experts at 1B parameters, versus both a dense baseline and a parameter-matched Transformer.
- At 8 experts there is **no energy win at all**. The regime matters, and this post leads with that.
- The saving is not free — it requires a grouped-GEMM kernel. Without it the sparse model is _slower_ than dense at every expert count.
- Above ~128 experts, the FLOP proxy and measured joules **diverge**. FLOPs stop being a proxy and start being a story.

Code, kernels and the full experiment log: **[github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)**.

This is the follow-up to [a post on how the _quality_ claim in this same project reversed under a longer training budget](./budget-dependent-benchmarking-sparse-moe). The short version of that one: the learned claims moved, and the shape-determined ones didn't. This post is about the shape-determined ones.

---

## 1. Why the win grows with expert count

The arithmetic is simple enough to state in one paragraph, which is the main reason to trust it.

A [Mixture-of-Experts](https://arxiv.org/abs/2101.03961) layer with Top-1 routing sends each token to exactly one expert of hidden width `d_hidden`. Its feed-forward cost per token is therefore **independent of `n_experts`** — 64 experts cost the same per token as 8. A parameter-matched dense model has to spend those parameters somewhere, so its feed-forward width is `d_ff = n_experts · d_hidden`, and its cost per token grows **linearly** in the same variable.

So the ratio between them grows linearly in expert count. Every expert you add makes the baseline more expensive and leaves the sparse model where it was.

That is not a learned property. It is a consequence of the tensor shapes, which is why it holds under random weights, survives budget sweeps, and doesn't care which corpus you train on.

![The broken tradeoff: quality against active compute](paper/figures/fig2_broken_tradeoff.png)

## 2. The regime where it doesn't work (Exp 17)

Worth stating before the good numbers, because it bounds them.

At **8 experts and 25M parameters, there is no energy win.** The measurement (Exp 17) found:

- The always-on sequence mixer dominates the forward pass. Feed-forward is only ~16% of the sparse model's compute, so cutting it by 8× only ~halves total FLOPs.
- **GPU power is architecture-flat** — ~52–57 W across every variant tested. On this hardware, "energy per token" reduces to latency per token. There is no power drop to harvest.
- With a naive per-expert Python dispatch loop, the sparse model was _slower_ than dense. The FLOP saving was consumed by kernel launch overhead.

The conclusion at that point was that the energy axis was dead. It named its own escape route, though: an energy win is only conceivable at much larger expert counts, where feed-forward re-dominates the _dense_ pass, and only with a real sparse kernel.

Both conditions turned out to be satisfiable.

## 3. Where it turns (Exp 22)

Holding `d_model`, `d_hidden` and depth fixed and sweeping expert count, with idle-subtracted power integration over a sustained inference loop:

| Experts | Params | Grouped MoE ktok/s | Dense ktok/s | **Energy× vs dense** | vs Transformer |
| ------- | ------ | ------------------ | ------------ | -------------------- | -------------- |
| 8       | 27.3M  | 101.5              | 82.3         | **1.31×**            | 1.16× (≈ tie)  |
| 32      | 77.8M  | 78.4               | 33.8         | **2.50×**            | 1.03×          |
| 64      | 144.9M | 71.9               | 18.1         | **3.99×**            | 0.97×          |

The dense model's feed-forward share climbs 61% → 86% → 92% of its pass while the sparse model's stays flat at ~0.022 GFLOP/token. The parameter-matched Transformer gains **nothing** from the sweep (≈1.0× dense throughout) because it has no sparsity to exploit — so the gap against the dominant architecture opens from a tie at 8 experts to ~4× at 64.

Power stayed flat throughout (~54–57 W grouped vs ~57–60 W dense), confirming that this is a throughput win rather than a power-draw win. That distinction matters and I'll return to it in the scope section.

## 4. The kernel is load-bearing (Exp 13, Exp 24)

Fewer FLOPs do not automatically mean less energy. Something has to convert one into the other.

The naive implementation dispatches experts in a Python loop — one iteration and one kernel launch per expert. That overhead is fixed per expert, so it grows exactly as fast as the saving does. **The loop dispatch is slower than dense at every expert count tested** (0.72–0.78× relative latency). Measured in isolation, the "efficient" architecture was a regression.

The fix is a sorted, dropless grouped GEMM: sort tokens by their assigned expert into contiguous segments, build cumulative offsets, and issue two grouped matmuls over all segments in one launch each. A zero-token expert becomes a zero-width segment — 0 FLOPs, no padding, so conditional execution is preserved rather than faked.

**Inference (Exp 13):**

| Experts | Loop tok/s | Grouped tok/s | Speedup   | max abs Δ logits |
| ------- | ---------- | ------------- | --------- | ---------------- |
| 8       | 60,061     | 88,963        | **1.48×** | 0.00e+00         |
| 16      | 41,049     | 86,245        | **2.10×** | 0.00e+00         |
| 32      | 24,774     | 81,594        | **3.29×** | 0.00e+00         |

Grouped throughput stays roughly flat (89k → 86k → 82k) as expert count quadruples, while the loop collapses (60k → 41k → 25k). Outputs are **bit-identical** — zero logit difference, zero argmax flips. The speedup is pure overhead removal, not an approximation.

**Training (Exp 24):** the same kernel was made autograd-capable with an explicit backward, giving **1.26× / 1.61× / 2.59× / 4.51×** faster training steps at 8 / 16 / 32 / 64 experts, with `w_in` and `w_out` gradients **bit-identical** to the loop and Δloss = 0. That removed the "inference-only" asterisk from the whole story.

If you take one engineering point from this post: **an efficient architecture without its kernel is a slower architecture.** The FLOP count is a promissory note; the kernel is whether it clears.

## 5. It scales (Exp 27)

Nine points on an H100 — three model scales × three expert counts — benchmarking four shape-matched variants each. Random weights, inference only, so the measurement is shape-determined and needs no training. Net mJ/token, sparse / dense / Transformer, with the MoE-vs-dense ratio in bold:

| Scale | 8 experts                        | 32 experts                       | 64 experts                        |
| ----- | -------------------------------- | -------------------------------- | --------------------------------- |
| 25M   | 0.46 / 0.77 / 0.75 (**1.67×**)   | 0.49 / 1.98 / 1.99 (**4.08×**)   | 0.51 / 3.65 / 3.56 (**7.13×**)    |
| 350M  | 2.73 / 4.26 / 3.84 (**1.56×**)   | 2.92 / 10.31 / 9.40 (**3.53×**)  | 3.11 / 17.80 / 16.64 (**5.72×**)  |
| 1B    | 9.12 / 13.35 / 11.65 (**1.46×**) | 9.52 / 29.25 / 28.17 (**3.07×**) | 10.32 / 52.38 / 50.56 (**5.08×**) |

Read the 1B row across: sparse energy goes 9.1 → 9.5 → 10.3 as experts scale 8× — essentially flat, as the arithmetic in §1 predicts. Dense goes 13 → 29 → 52.

![Energy per token across model scale and expert count](paper/figures/fig1_energy_scaling.png)

Two honest observations that travel with the number. First, the grouped kernel **ported to Hopper (sm_90)** cleanly, having been developed on Blackwell (sm_120) — it isn't an artifact of one architecture. Second, **the ratio softens with model scale** at fixed expert count (7.1× → 5.7× → 5.1× at 64 experts) because the always-on sequence mixer takes a larger absolute share as `d_model` grows. The lever is expert count, not model size. Saying "5× at 1B" without that caveat would be overselling by omission.

## 6. Where FLOPs stop predicting joules (Exp 48, Exp 50)

This is the section that should make a systems reader trust the rest.

There are two different ways to "add experts," and they behave in opposite directions.

**Fixed `d_hidden` (capacity scaling)** is §3 and §5: more experts means a bigger dense baseline, so the energy win grows.

**Fixed total budget (granularity)** holds `n_experts · d_hidden` constant and makes each expert smaller. The FLOP proxy loves this — accuracy per unit of active compute climbs monotonically **23.4× → 35.0× → 46.3× → 53.0×** at 32 / 64 / 128 / 256 experts (Exp 50, with a purge-churn confound fixed).

The measured energy disagrees. Here are the FLOP proxy and the wattmeter side by side, both from the same screen (Exp 48 — its proxy figures run a little higher than the churn-fixed Exp 50 numbers above, but the trend is what matters):

| Experts | Accuracy/active-compute (FLOP proxy) | Measured mJ/token | vs dense energy |
| ------- | ------------------------------------ | ----------------- | --------------- |
| 64      | 34.8×                                | 0.803             | **2.21×** less  |
| 128     | 50.9×                                | 0.807             | **2.19×** less  |
| 256     | 60.2×                                | 0.954             | **1.83×** less  |

**mJ/token rises while the FLOP proxy climbs.** Per-group launch overhead on many tiny experts (width 256 → 64) eats the saving. Under an energy-aware decision rule — a change is only accepted if quality improves _and_ the energy edge holds — 64 and 128 pass, and **256 is rejected**: it spends real joules to buy a proxy number.

So **~128 experts is the realized sweet spot**, and "FLOPs are not joules" gets an actual coordinate rather than a caveat. The gap is grouped-kernel overhead rather than anything fundamental — a tile-aware kernel could push the knee out — but until that is written, the honest claim is kernel-conditional.

![Granularity: FLOP proxy and measured energy diverge above ~128 experts](paper/figures/fig6_granularity_law.png)

## 7. What the spiking actually buys (Exp 51, Exp 60)

The model uses binary [spiking](https://open-neuromorphic.org/) activations — leaky integrate-and-fire neurons that emit 0 or 1 rather than a float. The obvious reviewer question is whether that costs accuracy. Two controls answer it end to end.

Replacing the binary hidden spike with a graded SiLU at equal FLOPs (Exp 51): 57.10 vs 57.44 perplexity — the **spike is 0.6% better**, grammar tied. Then removing the _entire_ spiking apparatus including the entry gate (Exp 60): **56.5 vs 57.10** perplexity, BLiMP **0.691 vs 0.691** — exactly even.

So the full accounting is: **spiking costs about 1% quality in total and is grammar-neutral.** Its value is that binary activations make the expert multiplication-free and give genuinely zero-FLOP conditional execution — an unreached or unfired expert runs nothing. That is a hardware-compatibility argument for event-driven silicon, not an accuracy argument, and stating it that way before a reviewer does costs nothing.

## 8. Honest scope

Read this before quoting any number above.

**The energy bench is inference-only and random-weight.** It measures the shape of the computation, not a trained deployment. That makes it conservative and reproducible, but it is not a serving benchmark on a real workload.

**On power-flat GPUs, "energy per token" is really active-FLOPs over throughput.** Measured power varied ~52–60 W across every architecture tested, so the win is latency-driven. The defensible framing is **serving cost and tokens-per-dollar**, not raw joules. True event-driven energy accounting needs neuromorphic hardware — [SpiNNaker2](https://spinncloud.com/) or [Loihi 2](https://www.intel.com/content/www/us/en/research/neuromorphic-computing.html) — which this project has not measured on. That is the single largest open item.

**Batched serving erodes per-token sparsity (Exp 65).** The union of experts touched across a batch is what a server actually pays for, and it collapses fast: **96.9% union sparsity at batch 1, 39.7% at batch 32, 14.1% at batch 64.** At 64 concurrent decode steps, 86% of the pool is touched. This is the same limitation that has kept contextual-sparsity tricks out of production serving stacks (cf. [Dejavu](https://arxiv.org/abs/2310.17157)), and it is why the per-token win is best read as an edge and single-stream decode property.

An attempt to fix it failed its own kill-gate (Exp 66): a group-agreement routing objective meant to concentrate a batch's routing into fewer expert groups produced batch-32 union sparsity of **0.371** against an unmodified baseline of **0.397** — the entire curve overlaid. The auxiliary term was simply overpowered by the load-balancing loss. Reported rather than buried, for [the reasons in the companion post](./budget-dependent-benchmarking-sparse-moe).

**Everything here is 2.5M–145M parameters** for the trained results, with the energy curve instantiated up to 1B dimensions. It is not a frontier-scale claim.

## 9. What holds

Stripped to what survives every caveat above:

- Top-1 routing makes feed-forward cost **constant in expert count**; the dense baseline's grows linearly. This is arithmetic, not a finding.
- Measured on an H100, that yields **3.07× at 32 experts and 5.08× at 64 experts** less energy per token at 1B parameters, against both a dense model and a parameter-matched Transformer.
- **The grouped-GEMM kernel is what makes it real** — bit-exact, and worth 3.29× inference and 4.51× training at high expert counts. Without it, none of this exists.
- **Above ~128 experts at fixed budget, measured energy and the FLOP proxy diverge.** Trust the joules.
- **Spiking costs ~1% quality** and buys neuromorphic compatibility, not accuracy.

---

## FAQ

**Q: Does Mixture-of-Experts actually save energy at inference?**
It depends entirely on expert count and kernel. At 8 experts, measured here, there was no win — the always-on mixer dominated and the dispatch overhead ate the saving. At 32–64 experts with a grouped-GEMM kernel, it was 3–5× less energy per token at 1B parameters.

**Q: Why does the win grow as you add experts?**
Top-1 routing runs one expert per token no matter how large the pool is, so sparse cost is flat in expert count. A parameter-matched dense model's feed-forward width grows linearly with the same parameter budget. The ratio therefore grows linearly.

**Q: Is fewer FLOPs the same as less energy?**
Not above ~128 experts at fixed budget. Measured mJ/token rose from 0.807 to 0.954 going from 128 to 256 experts while the FLOP-based metric kept improving — per-group kernel launch overhead on many tiny experts. Measure joules.

**Q: Does this hold under batched serving?**
Partially. Per-token union sparsity falls from 96.9% at batch 1 to 39.7% at batch 32. The per-token energy win is strongest for single-stream and edge decode; batched serving recovers only part of it.

**Q: What do spiking activations contribute?**
Roughly 1% quality cost, grammar-neutral. The benefit is multiplication-free experts and true zero-FLOP conditional execution, which matters for event-driven neuromorphic hardware rather than for accuracy on a GPU.

---

## Reproduce it

Managed with [uv](https://docs.astral.sh/uv/) on [PyTorch](https://pytorch.org/):

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
uv sync

# Live CUDA power + latency, random weights (shape-determined)
uv run python bench_energy.py --n-experts 64 --d-model 512 --d-hidden 512 \
    --n-layers 4 --batch 16 --seq 256

# Kernel equivalence + speedup, inference and training
uv run python bench_dispatch.py
uv run python bench_train_dispatch.py
```

- **Code, kernels, full log:** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **Interactive energy demo:** [huggingface.co/spaces/guestros/s2-moe-demo](https://huggingface.co/spaces/guestros/s2-moe-demo)
- **Trained checkpoints:** [huggingface.co/guestros/s2-moe-checkpoints](https://huggingface.co/guestros/s2-moe-checkpoints)
- **Archived (CC BY 4.0):** [doi.org/10.5281/zenodo.20846758](https://doi.org/10.5281/zenodo.20846758)

Related reading: [Switch Transformer](https://arxiv.org/abs/2101.03961) on Top-1 routing at scale, [DeepSeekMoE](https://arxiv.org/abs/2401.06066) on shared-expert topology, [Gated Linear Attention](https://arxiv.org/abs/2312.06635) on the linear-recurrence mixer, and [Open Neuromorphic](https://open-neuromorphic.org/) for the event-driven hardware side.

If a number here disagrees with `EXPERIMENTS.md`, the log wins — file an issue.
