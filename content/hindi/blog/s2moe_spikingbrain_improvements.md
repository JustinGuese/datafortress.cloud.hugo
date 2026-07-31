---
title: 'एक ही उत्तर, 1/32 काम: SpikingBrain (एक 5B ब्रेन-इंस्पायर्ड मॉडल) में एक Sparse Mixture-of-Experts FFN जोड़ना'
bg_image: 'images/blog/s2moe-vs-dense.png'
date: 2026-07-30T09:10:00+02:00
author: 'Justin Guese'
description: 'मैंने SpikingBrain 2.0 की feed-forward layer को एक Top-1 sparse Mixture-of-Experts के रूप में फिर से बनाया। 1/32 FFN compute पर समान गुणवत्ता, उनके 5B shape पर 2.71x कम block FLOPs - और एक परिणाम जो दूसरे random seed ने हटा दिया।'
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

## 60 सेकंड में सरल संस्करण

एक मरम्मत की दुकान कल्पना करें जिसमें 32 विशेषज्ञ हैं।

आज के AI मॉडल **हर एक काम को एक साथ सभी 32 लोगों को सौंपने वाली** दुकान की तरह काम करते हैं। हर कोई सब कुछ छूता है। यह काम करता है। यह भी बेहद बर्बादी है।

मैंने एक 5-बिलियन-पैरामीटर AI मॉडल ([SpikingBrain 2.0](https://github.com/BICLab/SpikingBrain2.0)) के एक हिस्से को फिर से बनाया ताकि एक रिसेप्शनिस्ट **प्रत्येक काम को पहले पढ़े और इसे उस एक विशेषज्ञ को सौंपे जो इसे संभालना चाहिए।**

वही दुकान। पेरोल पर वही 32 विशेषज्ञ। बाहर निकलने वाले काम की समान गुणवत्ता।

**बत्तीस में से एक का श्रम।**

यही पूरा विचार है। बाकी यह पोस्ट है कि जब मैंने इसे सही तरीके से मापा तो क्या हुआ — यह भी सहित कि एक परिणाम जिसे मुझे कचरे में डालना पड़ा।

## Mixture-of-Experts मॉडल क्या है?

एक सामान्य neural network में, हर input सभी parameters से गुजरता है। यह एक विशाल function है, और यह हर बार पूरी तरह से execute होता है।

एक **Mixture-of-Experts (MoE)** मॉडल उस बड़े function को कई छोटे में विभाजित करता है — "experts" — और एक **router** सामने रखता है। Router प्रत्येक शब्द को देखता है और चुनता है कि कौन सा expert इसे संभालेगा।

**Top-1 routing** के साथ, प्रति शब्द बिल्कुल एक expert चलता है। दो नहीं, एक blend नहीं। एक।

यह हिस्सा जो महत्वपूर्ण है: **जब आप अधिक experts जोड़ते हैं तो प्रति शब्द लागत नहीं बदलती।** चौंसठ experts की लागत आठ जितनी ही है, क्योंकि आप अभी भी उनमें से सिर्फ एक चलाते हैं। लेकिन मॉडल की कुल क्षमता हर बार जब आप एक जोड़ते हैं बढ़ जाती है।

यह कोई ऐसा चतुर तरीका नहीं है जो किसी को मिला। यह अंकगणित है। जो ठीक वही कारण है कि यह विश्वसनीय है।

## SpikingBrain 2.0 क्या है?

[SpikingBrain 2.0](https://github.com/BICLab/SpikingBrain2.0) चीनी विज्ञान अकादमी की स्वचालन संस्थान से एक open-source brain-inspired मॉडल परिवार है। दो 5B मॉडल, कोड और weights के साथ जारी किए गए।

यह वास्तव में दिलचस्प काम है। यह standard attention को sparse softmax attention और sparse linear attention के एक hybrid से बदल देता है, एक activation-coding scheme जोड़ता है जो event-driven hardware को support करता है, और एक conversion pipeline ships करता है जो मौजूदा Transformers को इस architecture में बदल देता है।

मैंने उनके release किए गए कोड को read किया, न कि सिर्फ paper को, और मुझे जो opening मिली: **हर block `attention → dense feed-forward` है।** release में कहीं भी feed-forward layer में कोई expert routing नहीं है।

तो एक sparse MoE feed-forward उनके विचार के लिए एक competing idea नहीं है। यह एक **खाली स्लॉट** है।

## मैंने क्या जोड़ा

चार mechanisms, [अपने research repo](https://github.com/JustinGuese/S2-MoE-llm) से लिए गए और उनके block में port किए गए:

- **एक Top-1 routed pool of experts** dense feed-forward layer की जगह।
- **एक always-on shared core** — एक छोटा expert जो हर शब्द से गुजरता है, routed one के साथ।
- **एक grouped-GEMM CUDA kernel**, क्योंकि इसके बिना पूरी चीज धीमी है (नीचे इस पर अधिक)।
- **एक dense-to-MoE upcycler**, ताकि expert pool को उनके _मौजूदा trained weights_ से बनाया जा सकता है, न कि scratch से retrain की आवश्यकता के बजाय।

सब कुछ एक config key के पीछे बैठा है जो उनके सभी छह shipped configs में अनुपस्थित है। **उनके released checkpoints byte-for-byte पहले जैसे ही load और run होते हैं** जब तक आप deliberately इसे switch न करें। एक test है जो इसे assert करता है।

## परिणाम: 1/32 feed-forward compute पर समान गुणवत्ता

यह मुख्य measurement है।

**matched parameter count** पर — sparse model के लिए 77.8M बनाम dense control के लिए 77.7M, 0.2% अलग — sparse model **same validation perplexity** तक पहुंचता है **1/32 feed-forward compute** चलाते हुए।

यह **32× accuracy per unit of active compute** है।

समान size। समान गुणवत्ता। उस layer में एक बत्तीस का काम।

यह sparse-MoE proposition ठीक वैसे ही काम कर रहा है जैसे advertised किया गया: capacity pool के साथ बढ़ता है, active compute flat रहता है।

## उनके 5B scale पर यह क्या लायक है

Compute claims tensor shapes द्वारा निर्धारित किए जाते हैं, training द्वारा नहीं — तो उन्हें SpikingBrain के real 5B block dimensions पर directly measure किया जा सकता है random weights के साथ, लगभग बीस मिनट में एक single RTX 4090 पर।

`hidden_size 2560`, `intermediate_size 9728`, bf16, parameter-matched, batch 8 × sequence 512 पर:

| Feed-forward              | MFLOP/token | mJ/token | Active watts | Tokens/sec  |
| ------------------------- | ----------- | -------- | ------------ | ----------- |
| Dense SwiGLU (their code) | 229.1       | 0.669    | 298.5        | **446,070** |
| Sparse MoE, 16 experts    | 89.1        | 0.419    | 138.9        | 331,697     |
| Sparse MoE, 32 experts    | 84.5        | 0.412    | 133.7        | 324,344     |
| Sparse MoE, 64 experts    | 82.3        | 0.414    | 123.7        | 299,053     |

**2.71× कम FLOPs per block। 1.62× कम energy per token**। आधी से भी कम power draw — 299 W के विरुद्ध 134 W।

## 1/32 32× overall में क्यों नहीं बदलता है

फिर से उस table को देखें। feed-forward compute 32× गिरा, लेकिन पूरे block में सिर्फ 2.71× गिरा। बाकी कहां गया?

**हमेशा-on parts shrink नहीं होते।** Attention अभी भी हर शब्द पर चलता है। Router हर शब्द पर चलता है। Shared core हर शब्द पर चलता है।

एक component को optimize करना केवल उस component के share को save कर सकता है। एक बार जब feed-forward layer लगभग free हो जाता है, तो हर चीज और floor बन जाती है — और आप feed-forward sparsity क्या कर सकती है की ceiling को मार चुके हैं।

अगर आप इस post से एक number अपने काम के लिए लेते हैं, तो वह एक लें। यह आपको बताता है कि इस layer को optimize करना कब बंद करें और किसी अन्य को देखने जाएं।

## ईमानदार बिट: dense model तेज़ है

tokens-per-second column को सही तरीके से पढ़ें। **dense के लिए 446,000 बनाम sparse के लिए 324,000।** Dense एक comfortable margin से जीता है।

जीत यहाँ **FLOPs और power है, wall-clock throughput नहीं।**

कारण unglamorous है: एक wide dense matrix multiply एक GPU को एक grouped matrix multiply plus एक router plus एक shared core से बेहतर use करता है। GPUs arithmetic के बड़े regular blocks के लिए built होते हैं।

power-limited या event-driven hardware पर, यह trade invert होता है और sparse model जीता है। throughput-bound datacentre GPU पर, यह नहीं होता है। कोई भी इसे benchmark करता है 10 मिनट में वह पाएगा, तो इसे pretend करने का कोई point नहीं है।

## Sparse models सही CUDA kernel के बिना धीमे होते हैं

यह हिस्सा है जो मैं किसी अन्य engineer को सबसे अधिक लेना चाहता हूं।

obvious implementation Python में experts पर loops करता है — एक iteration, एक kernel launch प्रत्येक। यह overhead fixed per expert है, तो यह आपकी saving जितनी तेजी से बढ़ता है।

**Measured on its own, naive sparse layer हर expert count पर dense से धीमा था।** FLOP saving paper पर existed और बिल्कुल कहीं और नहीं।

Fix: tokens को उनके assigned expert द्वारा contiguous blocks में sort करें और सभी के over एक grouped matrix multiply issue करें। मैंने `torch._grouped_mm` को autograd function में wrap किया explicit backward pass के साथ ताकि यह training में भी काम करे।

| Experts                | 8     | 16    | 32    | 64         |
| ---------------------- | ----- | ----- | ----- | ---------- |
| Forward vs Python loop | 2.27× | 4.60× | 8.29× | **12.75×** |
| Training step vs loop  | 1.85× | 3.99× | 6.34× | **9.95×**  |

और यह **bit-exact** है — outputs पर zero के विरुद्ध maximum absolute difference, और दोनों weight gradients पर। यह pure overhead removal है, एक approximation नहीं।

**एक efficient architecture इसके kernel के बिना सिर्फ एक slower architecture है।** FLOP count एक promise है; kernel है यह पaidजा जाता है या नहीं।

## एक CUDA bug जो आपके GPU को silently hang करता है

पता होना चाहिए अगर आप कभी इस op को touch करते हैं: **`torch._grouped_mm` degenerate group splits पर deadlock करता है।**

जब expert occupancy uneven है, आप zero-width segments मिलते हैं। इन्हें kernel को feed करें और यह hang होता है — GPU idle, एक CPU core spinning, कोई error नहीं, कोई timeout नहीं। यह बिल्कुल एक slow training step जैसा दिखता है जब तक आप notice नहीं करते यह छह घंटे से slow है।

Empty groups को call से पहले compact करना mathematically identical है और trigger को पूरी तरह remove करता है।

## क्या sparsity batched serving में survive करता है?

दो अलग-अलग claims यहां हैं जो constantly muddled होते हैं, तो आइए उन्हें separate करें।

**FLOPs per token किसी भी batch size पर 1/32 पर रहता है।** प्रत्येक शब्द कितने भी शब्द flight में हों, बिल्कुल एक expert से गुजरता है। ऊपर table batch 8 पर measure किया गया था — ये पहले से ही batched numbers हैं।

**Batch size के साथ क्या collapse होता है वह expert _residency_ है** — केवल active experts को memory में loaded रखने की ability। Batch 1 पर आप 32 में से एक expert को touch करते हैं और बाकी को skip कर सकते हैं। Batch 64 पर, experts touched का _union_ pool के अधिकांश को cover करता है:

| Batch size     | 1     | 32    | 64    |
| -------------- | ----- | ----- | ----- |
| Union sparsity | 96.9% | 39.7% | 14.1% |

तो expert offloading और event-driven weight gating **single-stream propositions** हैं। compute और energy reductions नहीं हैं — ये batching के तहत hold करते हैं।

यह distinction ही क्यों है "contextual sparsity" methods production serving stacks तक पहुंचने में fail रहे हैं, और क्यों यह आपके द्वारा claim करने वाले दो में से कौन सा precise होने के लिए भुगतान करता है।

## परिणाम मैंने delete किया: एक random seed ने 2.1% win को erase किया

अब uncomfortable part।

मेरे पास भी एक **quality** win था। sparse model ने अपने dense control को 2.1% perplexity से beat किया — 58.99 बनाम 60.27। अच्छा number। यह write-up में गया।

फिर मैंने error bars के लिए एक और seed run किया।

Win vanished। दूसरा seed: **58.52 बनाम 58.54।** एक dead tie।

यहाँ actually क्या हुआ। **Dense baseline** seeds के बीच 2.9% moved (60.27 → 58.54)। मेरा model 0.8% moved (58.99 → 58.52)। पहला seed मेरे model को अच्छा करते नहीं दिखा रहा था। यह **baseline को badly करते दिखा** रहा था।

दोनों seeds के across gap −1.1% है ±1.05 percentage-point spread के साथ। Parity से indistinguishable।

**Lesson generalizes: आपके baseline में भी variance है।** एक single-seed comparison आपके method को measure नहीं करता — यह दोनों models' luck को measure करता है। मैंने पहले से ही rule लिख दिया था ("one seed, anything under a couple of percent conclusion नहीं है") और 2.1% बिल्कुल line पर बैठा, जो precisely है जहां ऐसे rules decorative होना बंद करते हैं।

Core result — parity 1/32 compute पर — कभी affected नहीं हुआ था। एक bonus lose करना main course को remove नहीं करता। लेकिन 2.1% चला गया और यह वापस नहीं आ रहा है।

## और क्या काम नहीं किया

mechanisms में से दो ने अपने keep को earn नहीं किया, और इसे report करना किसी और को discover करने के लिए cheaper है।

**Spiking activations identical compute पर 2.8% perplexity cost करते हैं।** Binary 0/1 activations genuine activation sparsity produce करते हैं — लेकिन एक dense GPU kernel इसे cash नहीं कर सकता। तो इस hardware पर यह एक pure quality cost है। इसका value event-driven neuromorphic chips के साथ compatibility है, जो एक real argument है, सिर्फ accuracy या GPU-efficiency एक नहीं।

**Sleep phase एक shared core के आगे inert है।** यह training के दौरान expert pool को restructure करता है — duplicates को merge करना, pruning, regrowing। Result: −0.28% perplexity 5.2% extra training time के लिए। Logs explain क्यों: सभी दस cycles के across इसने nothing merge किया। **Always-on shared core ठीक वही redundancy absorb करता है जो merging exist करना चाहता है।** दो mechanisms same job करना, तो दूसरा कुछ नहीं left करता है।

**यहां तक कि shared core एक trade है, free win नहीं** — यह 52% अधिक active feed-forward compute के लिए 2.5% perplexity को buy करता है। Worth यह है अगर आप quality optimize कर रहे हैं, compute optimize नहीं कर रहे।

## उनके released setup में दो bugs

उनके अपने installation notes को एक clean machine पर follow करते हुए, दो चीजें break होती हैं। दोनों trivial एक बार जब आप जानते हैं, दोनों cost एक घंटा अगर आप नहीं करते:

**उनका bundled MoBA अभी भी `flash-attn==2.6.3` को pin करता है।** इसे install करना silently `flash-attn==2.7.3` को uninstall करता है जो उनके instructions एक line पहले पूछते हैं, फिर 2.6.3 को source से build करने में fail होता है। `--no-deps` के साथ install करना इसे fix करता है, और उनके अपने note को match करता है कि bundled copy को नए interface के लिए adapt किया गया था। Pin stale metadata है।

**`import fla` को C compiler और Python headers की जरूरत है present होना।** Triton import time पर एक launcher stub compile करता है। एक minimal CUDA image पर `build-essential` और `python3-dev` के बिना, यह just dies।

## उनके mechanism को audit करना अपने के बजाय

सबसे interesting चीज़ मैंने build की वह MoE नहीं है। यह एक diagnostic है **उनके** architecture के लिए।

उनका sparse linear attention 4 state partitions में से 2 pick करता है प्रति शब्द, balanced usage की तरफ एक auxiliary loss द्वारा trained। यह loss केवल training के दौरान run होता है। **कुछ भी guarantee नहीं करता है कि balance released weights में survived** — और न ही किसी भी तरीके से यह fail कर सकता है perplexity या benchmark scores में show होता है:

- **Usage collapse** — कुछ partitions picks का अधिकांश लेते हैं, तो expanded state effectively smaller है configured से और इसके memory cost advertised से कम buy करते हैं।
- **Input-independence** — usage overall balanced दिखता है, लेकिन हर शब्द same pair pick करता है। Histogram perfect दिखता है जब routing कोई information carry नहीं करता।

इसे measure करने में एक trap है। Model को `trust_remote_code=True` के साथ load करना **checkpoint directory में bundled** modelling code को import करता है, repository में copy नहीं। Repository के module को patch करें और आप कुछ measure करेंगे जो model कभी call नहीं करता, और एक confident-looking table of nothing मिलेगा।

Result, checkpoint के full trained context range के across:

| Context length   | 1,024  | 4,096  | 8,192  |
| ---------------- | ------ | ------ | ------ |
| Usage entropy    | 0.9868 | 0.9868 | 0.9863 |
| Most-common pair | 25.7%  | 26.2%  | 26.5%  |
| All 6 pairs used | yes    | yes    | yes    |

Entropy of 1.0 का मतलब perfectly balanced। 16.7% share का मतलब perfectly uniform होगा pairs के across।

**दोनों failure modes absent हैं, हर length पर।** एक 8× context increase पर entropy 0.0005 से moves होता है। उनके auxiliary loss ने अपना काम किया और property held।

यह एक null result है, और मैं इसे एक के रूप में report कर रहा हूं। यह अब [उनके repo पर एक open discussion](https://github.com/BICLab/SpikingBrain2.0/issues/4) है।

## ईमानदार scope

ऊपर सब कुछ, bounded:

- **कुछ भी 5B पर trained नहीं किया गया है या उनके checkpoints पर।** Quality work ≤146M parameters पर है, scratch से। 5B numbers block-level और shape-determined हैं।
- **Quality results एक से दो seeds हैं।** एक पहले से ही collapse किया। Directions findings हैं; magnitudes provisional हैं।
- **Quality edge long training budgets पर reverses होता है** — एक fixed budget में −5.15% advantage 4× budget पर +2.4% बन गया। [मैंने separately वह लिख दिया।](/blog/s2moe_budget_dependent_benchmarking/) SpikingBrain उस point के far past train करता है।
- **GPU पर Energy really FLOPs over latency है।** Power architectures के across बहुत कम vary होता है, तो defendable framing serving cost per token है, raw joules नहीं। Real event-driven energy accounting neuromorphic silicon की जरूरत है जिसे मैंने measure नहीं किया है।

## क्या hold करता है

- **Matched-parameter parity 1/32 active feed-forward compute पर।** 32× accuracy per unit of active compute।
- **2.71× कम block FLOPs और 1.62× कम energy per token** उनके real 5B block shape पर, random weights से।
- **Grouped-GEMM kernel वह है जो इसे real बनाता है** — bit-exact, naive loop के 12.75× तक faster। इसके बिना sparse model dense से धीमा है।
- **एक ceiling जानने लायक है:** feed-forward sparsity केवल कभी आपको feed-forward share save कर सकती है। इसके बाद always-on parts floor हैं।
- **एक validated diagnostic** SpikingBrain के अपने partition routing के लिए, जो healthy वापस आया।

## FAQ

**क्या Mixture-of-Experts actually compute reduce करता है?**
हां, और एक predictable amount से। Top-1 routing pool size जो भी हो, प्रति token एक expert run करता है, तो feed-forward compute `1/n_experts` एक parameter-matched dense layer का है। 32 experts पर यह 1/32 पर measure किया गया, जो once always-on parts count होने के बाद 2.71× कम FLOPs block के लिए बन जाता है।

**क्या sparse MoE model एक dense एक से तेजी है?**
जरूरी नहीं है, और यहां यह नहीं था — 324k tokens/sec बनाम dense के लिए 446k। कम FLOPs same नहीं है lower latency के रूप में। Win FLOPs और power draw (134 W vs 299 W) में था, throughput नहीं।

**क्या MoE sparsity batched serving में survive करता है?**
Compute saving करता है — हर token अभी भी batch size कुछ भी हो एक expert traverse करता है। जो survive नहीं करता है वह expert _residency_ है: batch के across experts touched का union 96.9% sparse batch 1 पर 14.1% batch 64 पर जाता है, तो expert offloading एक single-stream technique है।

**क्या spiking activations accuracy improve करते हैं?**
इस measurement में नहीं। वे 2.8% perplexity cost करते हैं identical compute पर। Benefit event-driven neuromorphic hardware के साथ compatibility है, accuracy या GPU efficiency नहीं।

**Quality improvement claim करने के लिए कितने seeds की जरूरत है?**
एक से अधिक, और यह post cautionary tale है। एक 2.1% advantage दूसरे seed पर disappear किया क्योंकि _dense baseline_ एक bad seed draw किया था। Single-seed comparisons luck measure करते हैं, method नहीं।

**क्या आप एक existing dense model को एक Mixture-of-Experts में convert कर सकते हैं?**
हां — यही है upcycler करता है। यह प्रत्येक expert को trained dense feed-forward weights के slices से initialize करता है, न कि scratch से। यह एक weight-initialisation bridge है और quality recover करने के लिए अभी भी continued training की जरूरत है; यह एक free conversion नहीं है।

## इसे Reproduce करें

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
cd SpikingBrain2.0-s2moe

# Energy और FLOPs SpikingBrain के real 5B block shape पर - random weights, कोई training नहीं
python spb2/s2moe/bench/bench_energy.py --n-experts 32 --param-match
python spb2/s2moe/bench/bench_active_flops.py --n-experts 32

# Kernel equivalence और speedup, forward और training
python spb2/s2moe/bench/bench_dispatch.py

# Released checkpoint के partition routing को audit करें
python run_model_forward/probe_sse_selection.py --model-path /path/to/SpikingBrain-2.0-base-8k
```

- **Fork, सब कुछ ऊपर के साथ:** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **Original research repo:** [github.com/JustinGuese/S2-MoE-llm](https://github.com/JustinGuese/S2-MoE-llm)
- **Upstream:** [BICLab/SpikingBrain2.0](https://github.com/BICLab/SpikingBrain2.0)
- **Open discussion:** [BICLab/SpikingBrain2.0#4](https://github.com/BICLab/SpikingBrain2.0/issues/4)

Related reading यहाँ: [why the energy win grows with expert count](/blog/s2moe_energy_scaling_sparse_moe/) और [how the quality claim reversed under a longer training budget](/blog/s2moe_budget_dependent_benchmarking/).

Background: [Switch Transformer](https://arxiv.org/abs/2101.03961) Top-1 routing पर, [DeepSeekMoE](https://arxiv.org/abs/2401.06066) shared experts पर, [Drop-Upcycling](https://arxiv.org/abs/2502.19261) dense-to-MoE conversion पर।

अगर एक number यहाँ experiment log में repo में disagree करता है, log जीता है — एक issue open करें।
