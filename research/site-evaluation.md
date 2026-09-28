# pichi-vm landing page — evaluation & improvement plan

Benchmarks the current site (`src/pages/index.astro` + `landing.yaml` / `prose.yaml`)
against 10+ top-tier developer-infrastructure landing pages, scores it on the
rubric in [`oss-website-rubric.md`](./oss-website-rubric.md), and lists concrete
visual + informational fixes ranked by leverage.

Evaluated 2026-09-25. Companion to [`oss-website-rubric.md`](./oss-website-rubric.md)
(rubric + exemplar notes) and [`immutability-messaging.md`](./immutability-messaging.md).

---

## 1. Benchmark sources

Each was fetched and analyzed for hero structure, how it conveys technical
information, trust signals, and visual design. Closeness = how directly it
models pichi's category (microVM / isolation / OCI workflow).

| #   | Site            | URL                                      | Closeness | The one thing to steal                                                                    |
| --- | --------------- | ---------------------------------------- | --------- | ----------------------------------------------------------------------------------------- |
| 1   | Firecracker     | https://firecracker-microvm.github.io    | ★★★★★     | Hard numbers as the whole pitch (<125 ms boot, <5 MiB overhead, 150 VMs/s) + adopter list |
| 2   | Kata Containers | https://katacontainers.io                | ★★★★★     | One-line antithesis headline: "speed of containers, security of VMs"                      |
| 3   | Warp            | https://www.warp.dev                     | ★★★★☆     | Animated config artifact above the fold; benchmarks as first-class content                |
| 4   | Depot           | https://depot.dev                        | ★★★★☆     | "old model vs our model" framing; testimonials that quantify (8m → 20s)                   |
| 5   | Fly.io          | https://fly.io                           | ★★★★☆     | Tension hero + candid engineer voice; specs inline                                        |
| 6   | gVisor          | https://gvisor.dev                       | ★★★★☆     | Pitch organized by jobs/outcomes, not features                                            |
| 7   | Tailscale       | https://tailscale.com                    | ★★★☆☆     | Best-in-class social proof: "40,000 businesses," quantified case studies                  |
| 8   | HashiCorp Nomad | https://www.hashicorp.com/products/nomad | ★★★☆☆     | Named-customer testimonial carousel with concrete wins                                    |
| 9   | Docker          | https://www.docker.com                   | ★★★☆☆     | build/ship/run verb triad + scale proof (20M+ devs, 20B+ pulls)                           |
| 10  | Bun             | https://bun.sh                           | ★★★☆☆     | Copy-paste install up top + sequential terminal demos                                     |
| 11  | Astro           | https://astro.build                      | ★★☆☆☆     | Third-party-sourced comparative benchmark chart (most credible number type)               |

**Landing-page research studies referenced:**
[Evil Martians — 100 devtool landing pages (2025)](https://evilmartians.com/chronicles/we-studied-100-devtool-landing-pages-here-is-what-actually-works-in-2025),
[daily.dev — developer-first landing pages](https://business.daily.dev/resources/create-developer-first-landing-pages-convert/),
[daily.dev — open source marketing guide 2026](https://business.daily.dev/resources/open-source-marketing-complete-guide-growing-your-project-2026/).

---

## 2. Scorecard (rubric from `oss-website-rubric.md`, 1–5)

**Overall: 3.3 / 5** — a well-structured, genuinely professional page whose ceiling
is capped by _asserted-not-shown proof_ (no hard numbers, no adoption) and a
_placeholder primary path_ (`docs.html`, live demo). Fix those two and it jumps to
best-in-class quickly, because the bones are strong.

### Group 1 — Messaging & Clarity — **4.2 / 5** (weight 25%)

| #   | Criterion                              | Score | Notes                                                                                                                                                                                                                    |
| --- | -------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.1 | Hero names category + resolves tension | 4     | "The container workflow, for real virtual machines" is sharp and memorable. Slightly softer than Kata's balanced antithesis — it names the workflow win but not the isolation win in the same breath.                    |
| 1.2 | Status-quo tension explicit            | 5     | The comparison table nails it (shared kernel vs heavy UEFI). Strong.                                                                                                                                                     |
| 1.3 | Above-the-fold answers what/who        | 3     | Headline is clear; the sub-line ("image management platform for building, sharing, distributing, staging and running micro-VMs…") is a five-verb run-on that dilutes the punch. _Who it's for_ is implied, never stated. |
| 1.4 | Outcome-framed                         | 4     | "Why Pichi" bands are mostly outcomes; a few slip into mechanism (PMI).                                                                                                                                                  |
| 1.5 | Credible engineer voice                | 5     | Copy is technical and un-salesy throughout. A real strength.                                                                                                                                                             |

### Group 2 — Proof & Credibility — **2.0 / 5** (weight 25%) ← biggest gap

| #   | Criterion                         | Score | Notes                                                                                                                                                                                                          |
| --- | --------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | Hard performance numbers          | 2     | "tens of milliseconds," "a few megabytes," "industry-leading" — all asserted, no figure. `notes.txt` already targets **15 ms boot / <5 MiB** — put those on the page. This is the single highest-leverage fix. |
| 2.2 | Comparative & third-party-sourced | 2     | The comparison table is qualitative ("Milliseconds" vs "Seconds"); no sourced measurement.                                                                                                                     |
| 2.3 | Adoption / "built on / used by"   | 1     | None. No "built on KVM/HVF/WHP," no AMD parentage, no pilot users. Strongest missing lever for an infra primitive.                                                                                             |
| 2.4 | Trust claims substantiated        | 4     | The `/security` page carries the mechanism — good progressive disclosure.                                                                                                                                      |
| 2.5 | Honest about maturity             | 4     | "early / experimental" badge + under-construction banner are honest and well-judged.                                                                                                                           |

### Group 3 — Demonstration — **3.5 / 5** (weight 20%)

| #   | Criterion                        | Score | Notes                                                                                                                                                       |
| --- | -------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | Copy-paste install near top      | 3     | The terminal shows `apt install pichi` but it's a static mock, not copyable, and `(provisional — 0.x)` signals it doesn't work yet.                         |
| 3.2 | Demo traces real workflow        | 5     | install → pull → run is exactly right, and the reused-layers output line is a great touch.                                                                  |
| 3.3 | Concrete artifact above the fold | 2     | The terminal sits _below_ the fold under "How it works." Above the fold is logo + headline + prose only — the abstract-art trap the research warns against. |
| 3.4 | Demo doubles as the argument     | 4     | The 3-of-5-layers-reused line makes the incremental-distribution case visually.                                                                             |

### Group 4 — Structure & Progressive Disclosure — **4.3 / 5** (weight 15%)

| #   | Criterion                 | Score | Notes                                                                                                                  |
| --- | ------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------- |
| 4.1 | Clear top-level spine     | 4     | Hero → how-it-works → why → compare → footer reads cleanly.                                                            |
| 4.2 | Depth optional            | 5     | Security/trust split into its own page keeps the landing tight. Well done.                                             |
| 4.3 | Comparison wins scannable | 5     | Green-tinted winning cells + colored dots are exactly the scannable pattern the exemplars use. Best asset on the page. |
| 4.4 | Workflow triad legible    | 3     | The sub-line lists five verbs but the page only demos three (install/pull/run). Pick one framing.                      |

### Group 5 — Visual Design & Conversion — **3.4 / 5** (weight 15%)

| #   | Criterion                             | Score | Notes                                                                                        |
| --- | ------------------------------------- | ----- | -------------------------------------------------------------------------------------------- |
| 5.1 | Visual hierarchy                      | 4     | Clean dark theme, good type scale, consistent tokens. Reads professional.                    |
| 5.2 | CTAs: one primary + one secondary AtF | 4     | "View the source" + "Try It" is the right two-CTA shape.                                     |
| 5.3 | No dead ends in primary path          | 2     | "Docs & demos" → `docs.html` is a stub; the live demo is a placeholder. Caps this criterion. |
| 5.4 | Responsive & fast                     | 5     | Static Astro, no JS runtime, single-column collapse — fast by construction.                  |
| 5.5 | Distinct identity                     | 4     | The armadillo mascot + GitHub-dark palette is memorable and consistent.                      |

---

## 3. What the site already does well (keep these)

- **Sharp, memorable hero line** — "The container workflow, for real virtual machines" passes the 5-second test.
- **The comparison table** — the single best-executed element; scannable wins, honest three-way framing, the caveat line ("heavier than a container, far lighter than a traditional VM") is a credibility signal.
- **Progressive disclosure** — pushing trust/security depth to `/security` keeps the landing a tight pitch. Matches Firecracker/Kata.
- **Engineer voice** — no "seamless," no "revolutionary." This is rare and valuable; protect it.
- **Honest maturity framing** — the experimental badge builds _more_ trust than hiding it would.
- **Fast, accessible foundation** — reduced-motion handling, semantic HTML, no client runtime.

---

## 4. Improvement plan — ranked by leverage

### Tier 1 — highest leverage (do these first)

1. **Put real numbers on the page (fixes 2.1, 2.2).**
   `notes.txt` already commits to **~15 ms boot** and **<5 MiB overhead**. Replace
   "tens of milliseconds" / "a few megabytes" / "industry-leading startup times"
   with the figures + units. Consider a 3-up stat strip under the hero:
   `~15 ms boot · <5 MiB overhead · 3 hosts, 1 image`. This is the biggest single
   credibility jump available and the copy is already written in `landing.yaml`
   waiting for the number. _Files: `landing.yaml` (why.groups, howItWorks.steps), a new stat strip component or reuse of a grid._

2. **Raise a concrete artifact above the fold (fixes 3.3).**
   The install→pull→run terminal is the best demo asset but it's below the fold.
   Either move a compact version into the hero (Bun/Warp pattern) or add a copy
   button and make the commands real once `0.x` ships. Above-the-fold should show
   _the product_, not logo + prose.

3. **Fix or hide the placeholder primary path (fixes 5.3).**
   "Docs & demos → `docs.html`" and the live demo are stubs. Until they exist,
   either point them at the GitHub README/quickstart or remove them from the
   primary path so no CTA dead-ends. A broken primary link costs more trust than
   a missing one.

### Tier 2 — strong wins

4. **Add an adoption / "built on" strip (fixes 2.3).**
   No pilot users yet is fine — but "Built on KVM, HVF, and WHP" and AMD
   parentage are legitimate, available trust signals. A quiet logo/label row
   ("Runs on Linux · macOS · Windows — KVM / HVF / WHP") right after the hero
   borrows Firecracker's adopter-strip credibility without needing customers.

5. **Tighten the hero sub-line (fixes 1.3, 4.4).**
   "building, sharing, distributing, staging and running" is a five-verb run-on.
   Cut to the triad the page actually demos, e.g. _"Build, share, and run
   micro-VMs over any OCI registry — with real isolation and a measured boot."_
   Pick one verb set and use it in the sub-line, the "Why" bands, and the demo.

6. **State who it's for (fixes 1.3).**
   One clause naming the audience (platform teams, serverless/sandbox builders,
   confidential-computing users). The research is consistent: name the ICP.

### Tier 3 — polish

7. **Make the comparison table's boot-time row sourced (fixes 2.2).**
   Once measured, "Milliseconds — tiny boot chain" → "~15 ms — measured boot
   chain" turns the strongest section quantitative.

8. **Consider a benchmark visual later (2.2).**
   Astro's third-party-sourced chart is the most credible number type. A single
   honest boot-time bar (pichi vs traditional VM firmware) would be high-impact
   once numbers are real. Don't fake it before then.

9. **Curated proof when available.**
   Reserve a slot for one or two tweet-style developer quotes or a short case
   study — the highest-trust pattern for technical audiences — for when early
   users exist. Placeholder-free until then.

---

## 5. Cross-cutting principles this page should hold to

From the exemplars + the two research studies, the durable rules:

- **Pass the 5-second test** — what it is + who it's for + a way to try it, above the fold. _(hero sub-line + audience clause)_
- **Show real code/product above the fold, not abstract art** — the terminal, not just the mascot.
- **Quantify everything** — numbers with units beat "tiny"/"fast"/"industry-leading" every time.
- **Two CTAs, no dead ends** — one self-serve + one go-deeper, both landing on something real.
- **Comparison tables where you win on execution** — already the page's strongest move; keep it quantitative.
- **Engineer voice** — already nailed; don't let marketing polish erode it.
- **Adoption / "built on" proof is the strongest social signal for an infra primitive** — even before customers, name the platforms you build on.
- **Expose the quickstart** — for OSS, the copy-paste first-run _is_ the landing page; make it real and copyable.
