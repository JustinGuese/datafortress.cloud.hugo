# DataFortress.cloud - Enrichment, Backlinks & Conversion Plan

## Context

datafortress.cloud currently reads as a competent freelance Hugo site but **dramatically under-sells the owner's credentials**. The TODO.md surfaces facts the live site doesn't yet show: active contributions to Google Research (TimesFM), Pandas, Bitnami Helm Charts, Hetzner CSI Driver; a BaFin-regulated "120-minute HashiCorp Vault save" at Atruvia; AWS Solutions Architect cert; Computational Neuroscience background; Anthropic OpenSource Program funding; Kaggle champion.

Simultaneously, the site has measurable technical debt that blocks both conversion and backlinks: the GA4 ID has a quote-escape bug (analytics broken), the homepage testimonial block is wired up but disabled with lorem ipsum, there is zero JSON-LD structured data, and the author page is three social links and a name.

**Scope (confirmed):** English only. Run content enrichment and technical SEO in parallel.

**Outcome:** Position Justin as an unambiguous industry leader, unlock backlink-worthy author/company pages, and give visitors 3–4 clear conversion paths instead of one generic "Contact" button.

---

## Phase 1 - Technical SEO Foundations (blocks backlinks if skipped)

### 1.1 Fix the GA4 tracking bug

- [hugo.toml:28](hugo.toml#L28) - change `ID = 'G-TQJWDVKV9N"'` to `ID = "G-TQJWDVKV9N"`. The trailing quote-in-quote has probably been breaking analytics since it was added.

### 1.2 Add JSON-LD structured data

Create **one new partial** [layouts/partials/json-ld.html](layouts/partials/json-ld.html) that conditionally emits the right schema per page type, then include it from [themes/bigspring-hugo/layouts/partials/head.html](themes/bigspring-hugo/layouts/partials/head.html) (one line near the bottom of `<head>`).

Emit:

- `Organization` on every page - name, logo, URL, sameAs (LinkedIn, GitHub, Facebook), contact, address (Straßlach-Dingharting, DE).
- `Person` on [content/english/author/justin-guese.md](content/english/author/justin-guese.md) via author/single.html override - include `knowsAbout`, `alumniOf`, `award`, `sameAs`.
- `Article` on blog posts (`type: post`) - headline, datePublished, author, image, publisher.
- `BreadcrumbList` on portfolio, blog, products single pages.
- `FAQPage` on [content/english/about/faq.md](content/english/about/faq.md) - parse the 15 Q&As from the page's `faq_section` frontmatter.
- `Service` on each new service page (1.6 below).

### 1.3 Canonicals + per-page OG images

- Add `<link rel="canonical" href="{{ .Permalink }}">` to [themes/bigspring-hugo/layouts/partials/head.html](themes/bigspring-hugo/layouts/partials/head.html).
- Extend [themes/bigspring-hugo/layouts/partials/basic-seo.html](themes/bigspring-hugo/layouts/partials/basic-seo.html) so `og:image` falls back to a branded default when a page has no `image` param (several pages currently have no OG image at all).

### 1.4 Fix contact page meta

- [content/english/contact.md](content/english/contact.md) currently has `description: "This is meta description"` - replace with real copy.

---

## Phase 2 - Author Authority (the single biggest backlink asset)

### 2.1 Rewrite the author page

[content/english/author/justin-guese.md](content/english/author/justin-guese.md) is currently **name + 3 social icons**. Replace with the full "Technical Outlier & AI Architect" bio from TODO.md:

- Hero line: "Data Engineer | DevOps Specialist | Agentic AI & Quant Developer - bridging BaFin-regulated banking and autonomous agentic workflows."
- **Core Ecosystem Contributions** section - Hetzner CSI, Google TimesFM, Bitnami Charts, Pandas, Microsoft winget-pkgs. Each link is a dofollow outbound to the canonical GitHub repo (these are the backlink seeds that make _them_ link back to us via committer profiles).
- **Professional Work History** - Atruvia, Automotive (HPE/VW/Porsche/BMW), Health & Bio, Quant, Porsche Holding (Formula E VR Motion Seat). Use the war-story framing.
- **The Product Foundry** - DocumentChat, PsychDiary, NavicareNow, AI Investing Bots, Tiledom, Aigentic Vibes.
- **Featured Project Index** - OpenShrimp, AgenticSeek, KuberneteslocalGPT, Python Tradingbot Framework, AI Hedge Fund, Python-OpenObserve, Rspamd-Iscan.
- **The Stack** - languages, orchestration, cloud certifications.
- **Recognition** - Anthropic OpenSource Program funded, Kaggle Champion, 3rd place SICK Robot Day 2014, AWS Certified Solutions Architect.

This page becomes the canonical "who is this guy" URL that every blog post author-byline and every external backlink can point to.

### 2.2 Dedicated About page

New file [content/english/about/\_index.md](content/english/about/_index.md) - company-level positioning with the **"120-minute BaFin Vault rescue"** as the centerpiece war story. Heading: _"When the biggest bank in Germany has 120 minutes to save its data, I'm the one on the call."_ This is the single most conversion-moving sentence the site has and currently it is nowhere.

Also include: the Computational Neuroscience angle, the hybrid "on-prem + agentic AI" thesis, EU/DSGVO positioning, and a credentials row (AWS Certified, Anthropic OSS Funded, Google Research Contributor).

---

## Phase 3 - Service Pillar Pages (topical authority for SEO)

The site lists 3 services in bullets on the homepage but has **no dedicated pages**. This is the single biggest topical-authority gap. Create three pillar pages:

1. [content/english/services/data-engineering.md](content/english/services/data-engineering.md) - data lakes, Trino/Starburst, Hive/Hadoop, MinIO, ETL, Pandas contributions as proof. Link to VW/HPE + Atruvia case studies.
2. [content/english/services/kubernetes-devops.md](content/english/services/kubernetes-devops.md) - OpenShift, Helm, ArgoCD, Tekton, Hetzner CSI contribution as proof, BaFin compliance. Link to Atruvia + BMW case studies.
3. [content/english/services/agentic-ai-llms.md](content/english/services/agentic-ai-llms.md) - multi-agent frameworks, local RAG, OpenShrimp, AgenticSeek, Google TimesFM contribution, Anthropic OSS funding. Link to DocumentChat product.

Each page uses the existing `_default/single.html` layout (no template work needed), gets a `Service` JSON-LD block via phase 1.2, and includes bottom-page CTAs to cal.com.

Add a "Services" parent entry to [config/\_default/menus.en.toml](config/_default/menus.en.toml) with these three as children.

---

## Phase 4 - Conversion Rate Optimization

### 4.1 Turn on testimonials

[content/english/\_index.md](content/english/_index.md) has a `testimonials:` block with `enable: false` and lorem ipsum. Flip to `enable: true` and replace with **real attributable quotes**. Source either from: (a) LinkedIn recommendations Justin already has, (b) short extract quotes from case-study clients with permission, or (c) rewrite as first-person outcome statements clearly attributed to Justin himself to start ("In this engagement we cut report generation time by 64%…"). The template at [themes/bigspring-hugo/layouts/index.html:168](themes/bigspring-hugo/layouts/index.html#L168) is ready.

### 4.2 Tiered CTAs

The site currently offers one CTA: a 15-minute cal.com call. Add two more on the About page and service pages:

- "Book a 1-hour architecture strategy call" (higher-intent lead)
- "Request a free infrastructure audit" (lead-magnet flavored, still routes to Formspree)

Use the existing Formspree endpoint `formspree.io/mknvkdpr` - no new integration needed.

### 4.3 Homepage "war story" hero strip

Above the existing case study grid on [content/english/\_index.md](content/english/_index.md), insert a one-line proof strip: _"Contributor to Google Research · Pandas · Bitnami · Hetzner CSI · Funded by Anthropic OpenSource Program"_ with the five repo icons linked out. This is 30 seconds of work that transforms the hero from "freelancer" to "ecosystem-level contributor."

### 4.4 Internal linking pass

Three targeted edits:

- Portfolio items → link to relevant deep-dive blog posts (Atruvia → the Kubernetes/BaFin posts; VW/HPE → data-warehouse posts).
- Blog posts → link to the new Services pillar pages where topic-relevant.
- FAQ → link each answer to the matching Service or Portfolio page.

No template work - this is edits inside existing `.md` files.

---

## Phase 5 - Backlink Surface Area

### 5.1 Recognition / Press page

New file [content/english/recognition.md](content/english/recognition.md) listing: Anthropic OpenSource Program funding, Kaggle Champion placement, SICK Robot Day 2014 3rd place, open-source merged-PR highlights. This gives journalists and reviewers a clean URL to cite.

### 5.2 Updated footer socials

[config/\_default/params.toml](config/_default/params.toml) currently has Facebook, GitHub, LinkedIn. Add: Twitter/X (if Justin has one), the Aigentic Vibes collection URL, and a GitHub profile link (separate from the company one) pointing to github.com/JustinGuese.

### 5.3 GitHub profile README alignment

The top of TODO.md is a README draft for Justin's GitHub profile. Shipping that (outside this repo, at github.com/JustinGuese/JustinGuese) closes the loop: the datafortress.cloud about page and the GitHub profile README cross-link, which is a well-known backlink-authority move.

---

## Files that will change

New files:

- [layouts/partials/json-ld.html](layouts/partials/json-ld.html)
- [content/english/about/\_index.md](content/english/about/_index.md)
- [content/english/services/data-engineering.md](content/english/services/data-engineering.md)
- [content/english/services/kubernetes-devops.md](content/english/services/kubernetes-devops.md)
- [content/english/services/agentic-ai-llms.md](content/english/services/agentic-ai-llms.md)
- [content/english/recognition.md](content/english/recognition.md)

Modified files:

- [hugo.toml](hugo.toml) - GA4 quote fix
- [content/english/author/justin-guese.md](content/english/author/justin-guese.md) - full bio rewrite
- [content/english/\_index.md](content/english/_index.md) - enable testimonials, add proof strip
- [content/english/contact.md](content/english/contact.md) - real meta description
- [content/english/about/faq.md](content/english/about/faq.md) - internal links into services/portfolio
- [config/\_default/menus.en.toml](config/_default/menus.en.toml) - Services menu parent + children
- [config/\_default/params.toml](config/_default/params.toml) - expand socials
- [themes/bigspring-hugo/layouts/partials/head.html](themes/bigspring-hugo/layouts/partials/head.html) - include json-ld partial + canonical tag
- [themes/bigspring-hugo/layouts/partials/basic-seo.html](themes/bigspring-hugo/layouts/partials/basic-seo.html) - OG image fallback

Existing templates we **reuse** (no changes):

- [themes/bigspring-hugo/layouts/index.html](themes/bigspring-hugo/layouts/index.html) - testimonial carousel block ready at line 168
- [themes/bigspring-hugo/layouts/\_default/single.html](themes/bigspring-hugo/layouts/_default/single.html) - renders all new service/about pages
- [themes/bigspring-hugo/layouts/author/single.html](themes/bigspring-hugo/layouts/author/single.html) - renders enriched author page
- Existing `image` shortcode, `button` shortcode, `accordion` shortcode

---

## Verification

1. **Build locally**: `hugo server -D` and walk through: home, /about/, /author/justin-guese/, /services/data-engineering/, /services/kubernetes-devops/, /services/agentic-ai-llms/, /recognition/, /portfolio/, a blog post, /about/faq/, /contact/. Confirm no broken links, no template errors in the console.
2. **JSON-LD validation**: paste the rendered HTML of home + a blog post + the author page into the [Google Rich Results Test](https://search.google.com/test/rich-results) and confirm Organization, Article, Person, BreadcrumbList, FAQPage all parse without errors.
3. **Analytics**: load the site with browser devtools → Network → filter `google-analytics` or `g/collect` and confirm the GA4 request fires cleanly after the quote fix.
4. **Meta tags**: view-source on /, /about/, a blog post, a portfolio item - confirm each has unique `<title>`, unique `description`, canonical URL, OG image.
5. **Conversion flow**: click each new CTA (15-min, 1-hour, audit) and confirm the right target opens (cal.com vs Formspree form).
6. **Accessibility sanity check**: run Lighthouse on the home, about, and a service page - aim for SEO ≥ 95 and Best Practices ≥ 90.
7. **Testimonials rendering**: load home page, confirm testimonials carousel appears and auto-scrolls with real content (not lorem ipsum).
