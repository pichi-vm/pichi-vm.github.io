# Immutable Images: VMs vs Containers vs Micro-VMs

Research for sharpening "immutable images" marketing copy.
(Generated 2026-09-25 to satisfy the "have AI search for the difference of
VM/container lifecycles" ask in the review comments.)

---

## 1. How the lifecycle differs

### (a) Traditional VMs — mutable disk images, "pets"

A VM starts from a golden image but the disk is **read-write for the life of the
instance**. Operators SSH in and patch in place; state accumulates:

- In-place patching mutates the running disk instead of replacing it.
- Snapshots are recovery points, not build artifacts, and drift from what's running.
- Configuration drift → snowflakes: ad-hoc changes accumulate into a unique, delicate
  instance nobody can reproduce.
- Pets: each server is named and nursed back to health. Rollback is an error-prone
  unwind of incremental changes.

Identity is the _history of mutations_ — you can never be fully certain staging equals
production.

### (b) Containers — immutable images, "cattle"

An OCI image is **built once, tagged by content, never modified**. Layers are
content-addressed: change any byte and the digest changes and every digest referencing
it changes.

- Ephemeral writable layer discarded on restart; the base image is untouched.
- Rebuild, don't patch: fix a CVE by building a new tag with the patch baked in, roll
  out by replacement. Never shell in to upgrade.
- Cattle: disposable, numbered; a sick one is terminated and replaced.
- State externalized to volumes / object store / DB.

Identity is the _content digest_ — reproducible, signable, verifiable. But the boundary
is a **shared host kernel**: a kernel escape crosses it.

### (c) Micro-VMs / image-based VMs — the convergence (pichi's position)

Micro-VMs take the container image lifecycle and put it behind a real hardware VM
boundary.

- Boot directly from an immutable kernel + read-only rootfs — no legacy BIOS, no PCI, no
  persistent disk to mutate. Firecracker boots to userspace in ~50–125 ms.
- Immutable rootfs enforced by kernel/hardware: Bottlerocket's root is a dm-verity
  Merkle tree that **fails closed** on any block change. Talos mounts a read-only
  SquashFS root; a reboot returns the node to its declared state.
- No patching surface by construction: Talos/Bottlerocket ship no shell, no SSH, no
  package manager. "The difference between 'I shouldn't' and 'I can't.'"
- Atomic A/B image updates with auto-rollback to the known-good partition.
- Mutable state quarantined to explicit ephemeral locations (tmpfs), never the base image.

Lifecycle: **content-addressed image in → hardware-isolated boot → run → destroy/replace.**
Container disposability + digest reproducibility, with a VM-grade boundary and verified boot.

## 2. Concrete benefits

**Developers / platform teams:** reproducibility (identity = digest, provably the same
everywhere), drift elimination (no SSH → no snowflakes), trivial safe rollback (re-point
to a known-good digest and reboot), GitOps-native (desired state is a declarative image
ref in Git), no half-applied upgrades (atomic swap).

**Security / compliance teams:** supply-chain integrity (digests are the substrate for
Sigstore/Cosign, SLSA, SBOM; a tag can be repointed, a digest cannot), reduced attack
surface + no persistence (no shell to pivot through, nothing survives a reboot),
measured/verifiable boot (attest exactly which image booted; a minimal deterministic
image is far easier to attest), compliance simplification ("no SSH" removes audit
categories).

_Honest caveat:_ immutability trades instant hotfixes for a rebuild-and-redeploy cycle,
and stateful data must be externalized. The strong projects don't hide this.

## 3. How the strongest projects message it

- **Flatcar/CoreOS:** "Your immutable infrastructure deserves an immutable Linux OS…
  manage your infrastructure, not your configuration." "Atomic, hands-free updates,"
  "100% reversible."
- **Talos:** "No SSH, no shell, no package manager." "Built on removing unnecessary
  components rather than trying to secure them."
- **Bottlerocket:** "Downloads a full filesystem image and reboots into it." Read-only
  dm-verity root that fails closed.
- **Silverblue / rpm-ostree:** "A Git-like way of working with your OS." Atomic image
  replacements, instant rollback.
- **NixOS:** transactional/declarative; content-addressed store; every change is a new
  reversible generation; flakes give "bit-for-bit identical" builds.
- **Firecracker/Kata:** minimalism as the message; per-invocation micro-VM destroyed on
  completion — "no data leakage, no persistent compromise."

Recurring patterns that land: contrast a verb you _can't_ do ("no SSH"); "rebuild, don't
patch"; "fails closed"; "known-good state, one reboot away"; "manage infrastructure, not
configuration"; reproducibility as _proof_ not _hope_.

## 4. Copy candidates for an "Immutable Images" card

1. **Rebuild, don't patch.** No SSH and no package manager inside a pichi image — ship a
   new signed image and roll it out by replacement, the way you already deploy containers.
2. **Every image is a content-addressed fact.** The digest _is_ its identity. What you
   signed in CI is bit-for-bit what boots in production — provable, not probable.
3. **Drift can't accumulate where nothing is writable.** Read-only, hardware-verified
   root. Every VM from an image is identical by construction.
4. **Rollback is a reboot, not a rescue.** Revert by re-pointing to a known-good digest,
   not unwinding weeks of in-place changes.
5. **A tamper to the image is a tamper to the hash.** Merkle-bound read-only layers;
   change one byte and boot fails closed.
6. **Container workflow, VM boundary.** _(sharpest — leads on the intersection)_ Build and
   push to an OCI registry like a Docker image — then each pull boots inside a real VM
   with hardware isolation, not a shared kernel.
7. **The attacker's playbook needs a shell you didn't ship.** No interactive userland to
   pivot through, nothing persists across a reboot.
8. **Verifiable from boot, not just from trust.** Cryptographically-bound layers let you
   attest exactly which image is running.

**Positioning note:** pichi's distinctive claim isn't "immutable" alone (everyone claims
it) — it's the _conjunction_: an OCI-registry container workflow producing
cryptographically-bound immutable layers that boot as real hardware-isolated VMs.
Bottlerocket/Talos give immutable _nodes_; containers give the immutable _image workflow_
but a shared kernel. Lead with that intersection (#6).

## Sources

Network to Code, Scalr, Talos/Sidero, Bottlerocket (GitHub SECURITY_FEATURES.md, AWS
blog), Flatcar docs, Fedora Magazine (Silverblue), NixOS wiki, Firecracker, Kata/gVisor
(Northflank), OCI image spec deep-dives, Reproducible Builds (DevGuard), SEV-Unikernel
(Zenodo). Full URLs captured in the review thread.
