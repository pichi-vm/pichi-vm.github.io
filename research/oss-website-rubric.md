# Landing-page evaluation research for pichi-vm

A study of 11 top-tier OSS / infra dev-tools landing pages, the tactics that make
each effective, and a scoring rubric tailored to grade the pichi-vm site.
(Generated 2026-09-25 to satisfy the "research strong OSS websites → evaluation
criteria" ask in the review comments.)

---

## (a) Exemplar sites, annotated

Ordered roughly by closeness to pichi-vm (microVM / isolation / infra first).

### 1. Firecracker — https://firecracker-microvm.github.io

The closest comparable. Hero: **"Secure and fast microVMs for serverless computing."**

- The value prop is a single sentence that names the category (microVMs), the two
  competing virtues it reconciles (secure + fast), and the use case (serverless).
- Numbers are the whole pitch: boot <125 ms, up to 150 microVMs/sec/host,
  <5 MiB memory overhead per VM, "15 trillion+ monthly Lambda invocations."
- Social proof via adoption list: names 12 orgs building on it (Fly.io, Kata, E2B…).
- Minimalism as a security argument: "only 5 emulated devices."

### 2. Kata Containers — https://katacontainers.io

Hero: **"The speed of containers, the security of VMs."** The canonical formulation
of pichi's exact category — one balanced antithesis. Architecture diagram above the
fold. Names a production user (Baidu) with specific workloads.

### 3. gVisor — https://gvisor.dev

Organizes the pitch by jobs/outcomes ("Run Untrusted Code," "Protect Workloads")
rather than features. Weakness to learn from: no benchmarks on the landing page.

### 4. Tailscale — https://tailscale.com

Best-in-class social proof: "40,000 businesses," rotating customer logos, and
_quantified_ outcomes ("90% reduction in support requests"). Persona-based
progressive disclosure (IT / Security / DevOps / Engineering). Two clear CTAs.

### 5. Fly.io — https://fly.io

Tension-driven hero ("Sandboxes aren't enough"). Candid engineer voice signals the
page was written by people who build infra. Concrete specs inline (18+ regions, <1s boot).

### 6. Bun — https://bun.sh

Gold standard for copy-paste install + live demo: install command up top, then 5
sequential terminal demos tracing the real workflow. Benchmarks pair throughput with
memory, against named competitors at named versions.

### 7. Astro — https://astro.build

Single most persuasive chart: Core Web Vitals pass-rate vs named competitors, sourced
to HTTP Archive + CrUX. A third-party-sourced comparative benchmark is the most
credible number type.

### 8. Supabase — https://supabase.com

Hero: **"Build in a weekend. Scale to millions."** Outcome-framed benefits couplet,
not a feature list.

### 9. Caddy — https://caddyserver.com

Config-as-proof: short Caddyfile snippets demonstrate "automatic HTTPS" in ~5 lines —
the demo _is_ the argument. "50 million certificates under management" + peer-review
citations.

### 10. Ollama — https://ollama.com

Extreme simplicity + big download CTA. Proof that a spartan page works when the core
action is dead obvious.

### 11. Docker — https://www.docker.com

Durable lesson: the build / ship / run workflow triad and scale proof ("20M+
developers," "20B+ pulls/month"). pichi borrows Docker's build/share/distribute/run
verbs — mirror that triad structure.

---

## (b) Extracted qualities — the patterns that recur

**Messaging**

- One-sentence hero naming the category + the core tension it resolves.
- Name an inadequate status quo and position against it.
- Outcome framing over feature lists.
- Engineer voice, not marketing voice.

**Proof / credibility**

- Hard, specific, verifiable numbers beat adjectives.
- Third-party-sourced comparative benchmarks are the most credible.
- Adoption / "built on this" lists are the strongest social proof for an infra primitive.

**Demonstration**

- Copy-paste install command near the top.
- Live/sequential terminal or config demos that trace the real workflow.

**Structure / progressive disclosure**

- Hero → what-is → proof → how-it-works → depth → community, each layer optional.
- The workflow triad as a scannable spine.

**Visual & conversion**

- Two CTAs max above the fold (one self-serve + one "go deeper").
- Comparison tables where wins are scannable at a glance.
- A concrete artifact above the fold, not just prose.

---

## (c) Scoring rubric for the pichi-vm site

Apply each criterion 1–5. **1** = absent/misleading, **3** = adequate/generic,
**5** = best-in-class (matches the exemplar named). Overall = weighted mean.

### Group 1 — Messaging & Clarity (25%)

- **1.1 Hero names the category + resolves the tension.** 5 = Firecracker/Kata-tier
  antithesis a stranger repeats back correctly.
- **1.2 Status-quo tension is explicit.** Names why containers (shared kernel) and
  traditional VMs (heavy/slow) each fall short.
- **1.3 Above-the-fold answers "what is this and who is it for."**
- **1.4 Outcome-framed, not feature-listed.**
- **1.5 Voice is credible engineer, not marketing.**

### Group 2 — Proof & Credibility (25%)

- **2.1 Hard performance numbers present** (boot time, image size, memory overhead,
  with units). "tiny" / "milliseconds" without a figure caps this at ~2.
- **2.2 Comparative & ideally third-party-sourced.**
- **2.3 Adoption / "built on / used by" proof** (pilot users, "built on KVM/HVF/WHP,"
  AMD as parent).
- **2.4 Trust/security claims substantiated, not asserted** (link to /security mechanism).
- **2.5 Honest about maturity** (framed as invitation, not risk).

### Group 3 — Demonstration (20%)

- **3.1 Copy-paste install/first-run command near the top.**
- **3.2 Demo traces the actual end-to-end workflow.**
- **3.3 A concrete artifact above the fold.**
- **3.4 The demo doubles as the argument.**

### Group 4 — Structure & Progressive Disclosure (15%)

- **4.1 Clear top-level spine.**
- **4.2 Depth optional, not forced** (deep material behind the /security link).
- **4.3 Comparison-table wins are scannable.**
- **4.4 Workflow triad (build/share/distribute/stage/run) legible as structure.**

### Group 5 — Visual Design & Conversion (15%)

- **5.1 Visual hierarchy guides the eye.**
- **5.2 CTAs: one primary + one secondary, above the fold.**
- **5.3 No dead ends / placeholder links in the primary path.** If the primary CTA
  lands on a stub (`docs.html`), cap at 2.
- **5.4 Responsive & fast.**
- **5.5 Distinct, memorable identity** (the armadillo mascot, consistent palette).

### Priority read for pichi-vm

Biggest likely point-losers: **2.1** (no hard numbers — "milliseconds"/"tiny" are
asserted), **2.3** (no adoption / "built on" proof), **5.3** (primary CTA `docs.html`
is a placeholder). Strongest existing assets: the **comparison table (4.3)**, the
**install→pull→run terminal (3.1–3.2)**, and the **tight hero (1.1)**.

### Sources

Firecracker, Kata, gVisor, Tailscale, Fly.io, Bun, Astro, Supabase, Caddy, Ollama,
Docker (URLs inline above).
