---
title: 'My Efficiency Win Reversed When I Trained Longer: A Note on Budget-Dependent Benchmarking'
bg_image: 'images/blog/budget-reversal.png'
date: 2026-07-28T09:10:00+02:00
author: 'Justin Guese'
description: 'A sparse MoE beat a dense baseline by 2.4% across 3 seeds. Train 4x longer on harder data and the sign flips - what that says about benchmarking efficient architectures.'
image: 'images/blog/budget-reversal.png'
categories:
  - Machine Learning
tags:
  [
    'mixture of experts',
    'benchmarking',
    'reproducibility',
    'negative results',
    'language models',
  ]
type: post
---

# My Efficiency Win Reversed When I Trained Longer: A Note on Budget-Dependent Benchmarking

**TL;DR**

- A Top-1 sparse [Mixture-of-Experts](https://arxiv.org/abs/2101.03961) model beat a parameter-matched dense baseline by **−2.4% ± 1.1% validation perplexity, 3/3 seeds, paired _t_ ≈ 3.8 (p ≈ 0.03)**. Clean result. Publishable-looking.
- Three separate checks took it apart: a **learning-rate schedule** change, a **properly tuned baseline**, and a **4× longer training budget**.
- At 4× budget on hard web text, the sign **inverted**: dense won by **+2.4% ± 0.8%**, also 3/3 seeds.
- The general lesson: efficiency comparisons run far below [Chinchilla-optimal](https://arxiv.org/abs/2203.15556) budgets systematically flatter the model with less active compute. Most papers never run the longer budget.
- What survived was the axis that _couldn't_ reverse, because it isn't learned. More on that at the end, and in the [companion post on energy scaling](./sparse-moe-energy-scaling-per-token).

All numbers below come from a public experiment log: **[github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)** (`EXPERIMENTS.md`, 66 entries, newest first). Every claim in this post cites an experiment number you can go read.

---

## 1. The result that looked finished

The architecture is S²-MoE: a sparse spiking Mixture-of-Experts language model. The relevant detail for this post is just that it routes each token to **one** expert out of `n`, so it executes roughly `1/n` of the feed-forward compute per token compared to a dense model of the same parameter count.

At 25M parameters on [TinyStories](https://arxiv.org/abs/2305.07759), byte-pair tokenized, 6000 steps, three seeds run as isolated processes (**Exp 12**):

| Metric (25M, 6000 steps, 3 seeds)                       | S²-MoE                   | Dense         |
| ------------------------------------------------------- | ------------------------ | ------------- |
| Validation perplexity                                   | **5.63 ± 0.09**          | 5.77 ± 0.03   |
| Paired gap (MoE − dense)                                | **−2.4% ± 1.1%**         | —             |
| Per-seed gap                                            | −1.2% / −2.6% / −3.3%    | 3/3 favor MoE |
| Accuracy per active compute                             | **8.20× ± 0.10**         | 1×            |
| Active FFN compute fraction                             | 0.125 (exact)            | 1.000         |
| [BLiMP](https://arxiv.org/abs/1912.00582) grammar delta | +0.003 ± 0.015 (neutral) | —             |

This is not a weak result on its face. It is paired (same seed fixes data order and initialization for both arms), every seed agrees on the sign, the dense baseline has near-zero seed variance, and the grammar probe says the sparsity costs no syntax. Longer training made the effect _larger_, not smaller — usually a good sign.

The temptation at this point is to stop measuring.

## 2. Three ways it came apart

### 2.1 The schedule was doing the work (Exp 15)

Every result above used a **flat learning rate** — the project default, originally tuned for the [gated linear attention](https://arxiv.org/abs/2312.06635) mixer. That is a defensible choice for one architecture and an indefensible one for a comparison.

Re-running on [FineWeb-Edu](https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu) with an identical modern schedule for every arm — linear warmup then cosine decay to 10%, each model at its own tuned peak LR:

| Model (25M, FineWeb-Edu, 6000 steps) | Val ppl   | BLiMP | Active FFN compute |
| ------------------------------------ | --------- | ----- | ------------------ |
| GLA-dense                            | **51.37** | 0.713 | 1.000              |
| Transformer                          | **51.17** | 0.704 | 1.000              |
| S²-MoE                               | 56.90     | 0.694 | **0.125**          |

The MoE went from **8% better** under flat LR to **11% worse** under warmup+cosine. The mechanism is visible in the deltas: the dense model gained **25%** from proper scheduling (68.5 → 51.4); the MoE gained only **9.5%** (62.9 → 56.9). A dense model updates every parameter on every step, so it can exploit the fine-tuning tail of a cosine decay. A Top-1 MoE updates roughly `1/n` of its expert pool per token, so each expert sees a fraction of the data and cashes far less of that tail.

The flat-LR protocol was not neutral. It handicapped the arm that benefits most from good scheduling.

### 2.2 A baseline you haven't tuned is not a baseline (Exp 15, run #1)

The first attempt at adding a real softmax-attention Transformer control handed it the GLA-tuned settings: flat `lr=3e-3`, no warmup. It never trained — validation perplexity **380**, versus 68 for the dense GLA model.

That run produced a headline number of "S²-MoE is 48× better than a Transformer."

That number is discarded and logged as a lesson rather than deleted. It measured a broken control, not a good model. A short diagnostic confirmed that a properly configured Transformer (`lr=6e-4`, warmup, cosine) trains fine and lands at 51.17 — which is to say, it _beats_ the MoE.

This failure mode is cheap to fall into and expensive to catch after publication. Attention is far more LR-sensitive than a linear-recurrence mixer; reusing one architecture's hyperparameters across a comparison manufactures whatever result you were hoping for. **Report the tuning budget and final LR for every arm, including the ones you are trying to beat.**

### 2.3 The budget was hiding the gap (Exp 44 → Exp 47)

The most transferable of the three. Same locked configuration — 32 experts, always-on shared core, self-distillation, cosine schedule, grouped-GEMM dispatch — swept across training budget on FineWeb-Edu:

| Training steps | MoE vs dense                              | Verdict             |
| -------------- | ----------------------------------------- | ------------------- |
| 6,000          | **−5.15% ± 0.11%** (3/3 seeds, _t_ ≈ −81) | MoE wins decisively |
| 12,000         | ≈ parity                                  | —                   |
| 24,000         | **+2.4% ± 0.8%** (3/3 seeds)              | Dense wins          |

A clean monotone crossover, confirmed across three seeds at the endpoint, not a lucky draw. The 6k result had a _t_-statistic of −81. It was also, in retrospect, a statement about undertraining rather than about architecture.

![Budget crossover: the MoE quality edge reverses as training budget grows](paper/figures/fig3_budget_reversal.png)

## 3. The generalization

Here is the part worth carrying to other projects.

**Comparisons run far below compute-optimal budgets systematically flatter the model with less active compute per token.** Both arms are undertrained; the dense model has more capacity it hasn't cashed yet; the sparse model is closer to its own ceiling because each expert has already seen its narrow slice of the data. The gap that will eventually separate them has not opened. Measure there and you measure the crossing region, not the asymptote.

Two corollaries fell out of the same sweep.

**The crossover point is a property of the corpus, not the architecture.** Running the identical 24k-step configuration on both corpora (**Exp 47**):

| Corpus      | Unigram entropy  | MoE vs dense at 24k                | BLiMP delta |
| ----------- | ---------------- | ---------------------------------- | ----------- |
| TinyStories | 8.39 bits/token  | **−2.6% ± 0.3%** (3/3, MoE wins)   | +0.039      |
| FineWeb-Edu | 10.50 bits/token | **+2.4% ± 0.8%** (3/3, dense wins) | −0.007      |

The sign flips with the corpus alone. On structured text the MoE win narrows with budget (−4.4% at 6k → −2.6% at 24k) but never crosses zero. On diverse web text it crosses and keeps going. So "does sparsity cost quality?" has no budget-free, corpus-free answer — which means any paper reporting a single point on this surface has reported a coordinate, not a conclusion.

**And the honest limit on that (Exp 53):** the _directional_ law holds, but a _quantitative_ one is not fittable from these runs. There are only two corpus-entropy points, and schedule, distillation, and budget are collinear confounds of comparable magnitude — per-expert token count doesn't even order the sign correctly. Fitting a predictive curve to that would produce a non-identifiable surface with a respectable-looking R². The log says so, and the follow-up is specified (freeze one protocol, add ≥2 corpora, run an `n × corpus` grid) rather than approximated.

### A four-item checklist

1. **Run at least two budgets**, ideally 4× apart. If your claim only exists at one, it is a claim about that budget.
2. **Run at least two corpora of different difficulty.** Toy corpora are not small versions of hard corpora; they change the sign here.
3. **Tune every baseline separately and report its LR.** One schedule across architectures is a thumb on the scale.
4. **Report the paired per-seed sign, not just the mean ± std.** "3/3 seeds agree" and "mean is negative" are different claims, and the second one is weaker than it reads.

## 4. The process that caught it

None of this was luck. The practice is to **pre-register a numeric kill-gate before an expensive run**, then honor it when it fails. Nine ideas have died at theirs. A representative sample:

| Idea                                                            | Why it died                                                    | Exp |
| --------------------------------------------------------------- | -------------------------------------------------------------- | --- |
| Mixer write-gate                                                | Skipping writes to the recurrent state blew up perplexity ~7×  | 32  |
| [Mixture-of-Depths](https://arxiv.org/abs/2404.02258) halt gate | −1.9% quality; realized ~16% sparsity vs a 50% target          | 42  |
| Neuromodulatory routing                                         | No quality gain; routing-level fixes keep failing              | 34  |
| Dendritic experts                                               | Gate settled 38% open — became a sparsifier, +1.05% worse      | 46  |
| Criticality setpoint                                            | 73.03 vs a paired 72.86 baseline — gate not met                | 62  |
| Event-driven FFN                                                | Consecutive-token cosine 0.561 vs a 0.7 bar                    | 64  |
| Rank-1 residual correction                                      | Inert: active compute unchanged, threshold sweep moved nothing | 66  |

The four gating ideas share one shape, and it is the most useful pattern in the whole log: **any learnable gate the optimizer is allowed to close, it closes.** Each was designed to add conditional capacity; each was recruited as a second sparsifier on top of the existing one and cost 1–2% quality.

Two ideas were not small — they were the project's pitched differentiators, and they died to _clean controls_ rather than to bad numbers:

- **Continual adaptation (Exp 60, 61).** The claim: sparse models forget less, because growth isolates new domains into fresh experts. Exp 60 added a sleep-OFF control, which landed identical to sleep-ON — so the mechanism wasn't doing the work. Exp 61 then _forced_ the isolation with a route-lock: new-domain tokens hit fresh experts exclusively (measured provenance fraction **1.00**, zero bleed). Retention still didn't move — **116.7 vs 117.3**. The forgetting lives in the always-on dense component, which sparsity cannot protect. Falsified, not un-tuned.
- **"Gradual growth is special" (Exp 59).** A one-shot bulk [upcycle](https://arxiv.org/abs/2212.05055) scored **73.37**, sitting inside the gradual-growth arm's own two-seed spread of 72.94–73.44. The earlier "gradual wins" result came from a leaked control that had been silently growing all along.

The cost argument for this discipline is **Exp 64**. The event-driven idea was appealing and would have taken weeks to build. The gate was one measurement: are consecutive-token activations correlated enough to skip recomputation? Mean cosine similarity **0.561** against a pre-agreed bar of 0.7 — and it _dropped_ with depth. Total cost: one benchmark script and zero training runs.

The same logic runs the cheap screens: one seed at half steps to answer "does this move quality at all?", and only survivors earn three seeds at full length. A $0.30 screen that says no is worth more than a week spent building on an unvalidated lever.

## 5. What actually survived

One paragraph, no argument.

The claim that held through every schedule change, every corpus, and a 4× budget sweep was the one that was never learned in the first place: **accuracy per unit of active feed-forward compute stayed at ~21× across 6k, 12k, and 24k steps on both corpora.** It is shape-determined — a consequence of Top-1 routing executing one expert regardless of pool size — so there is no mechanism by which more training could reverse it. That is precisely why it survived when the quality claim didn't. A number that can't move under budget is a number that never depended on undertraining.

That axis is the subject of the next post: [how energy per token scales with expert count, where the measured curve stops agreeing with the FLOP count, and what the spiking actually buys](./sparse-moe-energy-scaling-per-token).

---

## FAQ

**Q: Why did the MoE beat dense at small scale but lose at large scale?**
Both models were undertrained. The dense model updates every parameter every step and keeps improving; the Top-1 MoE updates ~1/n of its expert pool per token, so it approaches its ceiling earlier. At low budget the dense model hasn't cashed its capacity yet, so the comparison flatters the sparse model. See Exp 44 and 47.

**Q: Does that mean sparse models are worse?**
No — it means the quality comparison is budget- and corpus-dependent, and the _efficiency_ comparison isn't. On structured text the sparse win survived a 4× budget increase; on diverse web text it reversed. The active-compute advantage held everywhere.

**Q: How many training budgets should I test before claiming an efficiency win?**
At minimum two, ideally 4× apart, on at least two corpora of different difficulty. In this project the sign flipped between 6k and 24k steps on one corpus and not the other.

**Q: What is a kill-gate?**
A numeric threshold written down _before_ the expensive run, defining what result would kill the idea. Exp 64 killed a multi-week direction with a single benchmark script because the gate was set in advance.

**Q: Where can I see the raw experiment log?**
`EXPERIMENTS.md` in the [GitHub repository](https://github.com/JustinGuese/SpikingBrain2.0-s2moe) — 66 entries, each with Hypothesis → Method → Observation → Result, including everything that failed.

---

## Reproduce it

The project is managed with [uv](https://docs.astral.sh/uv/) on [PyTorch](https://pytorch.org/):

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
uv sync
uv run python phase0.py    # regression gate, expects: PHASE 0: PASS

# The head-to-head: MoE + a parameter-matched dense control, same budget
uv run python train_lm.py --tokenizer bpe --scale 25m \
    --d-model 512 --d-hidden 512 --n-layers 4 --n-experts 32 \
    --d-shared 256 --distill --dispatch grouped --blimp --n-seeds 3
```

- **Code and full log:** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **Interactive demo:** [huggingface.co/spaces/guestros/s2-moe-demo](https://huggingface.co/spaces/guestros/s2-moe-demo)
- **Trained checkpoints:** [huggingface.co/guestros/s2-moe-checkpoints](https://huggingface.co/guestros/s2-moe-checkpoints)
- **Archived (CC BY 4.0):** [doi.org/10.5281/zenodo.20846758](https://doi.org/10.5281/zenodo.20846758)

Corrections are welcome as issues. If a number here doesn't match the log, the log wins.
