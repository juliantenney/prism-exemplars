# Design notes — Understanding Lagrange Multipliers

These notes are **retrospective design commentary**. They are not the original commissioning brief.

## Extracted from the project

- **Title:** Understanding Lagrange Multipliers (from published package `<title>`).
- **Constituent products (6):**
  - c1 Interactive — Why the constraint matters
  - c2 Interactive — Seeing gradients and tangency
  - c3 Expository — From geometry to the multiplier equations
  - c4 Expository — What does the calculation prove?
  - c5 Assessment Pack — Diagnosing mathematical claims
  - c6 Assessment Pack — Independent constrained optimisation
- **Learning sequence:** Overview → c1 → c2 → c3 → c4 → c5 → c6.
- **Learning Journal:** none in the published package (deliberate; not a missing feature).
- **Published package:** unified Learning Journey shell (`published/index.html` + `runtime/` + `media/` for c1–c6 + local `lib/` for MathJax/MathLive).
- **Integrated-document IDs:** resource-local IDs are namespaced (`lj-cN--…`), including all-sections panel IDs and matching navigation fragment references, in the supplied fixed package used for this corpus entry.

## Supplied by the user

- **Teaching need / intended capability / primary pattern / audience / duration:** provided in the corpus-publication request (educational framing).
- **Original Requirements-stage prompt:** not attached in the conversation that commissioned this corpus entry; `original_brief` is therefore `null` (a reconstructed brief is never presented as original).
- **Status:** `candidate` (no new post-fix certification asserted; prior static QA is not restated as a fresh score).

## Retrospective commentary

- **Why this design addresses the teaching need:** procedural algebra alone leaves first-year learners without geometric meaning or justified conclusions; the sequence builds from a concrete constrained choice, through visual gradients/tangency, to formal equations, then forces evaluation of what calculations prove before independent transfer.
- **Distinctive feature:** the culminating assessment requires establishing and justifying a global optimum, not merely producing a stationary candidate.
- **Transferable principle:** Concrete → Visual → Formal → Transfer with an explicit claims-evaluation step before independent application.
- **Adaptation cautions:** preserve the judgement-before-transfer gate; do not drop the “what does this prove?” stage; do not add a Learning Journal solely because other exemplars have one; keep prior-knowledge assumptions (partial differentiation / two-variable functions) explicit for the new context.
