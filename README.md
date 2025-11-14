# ToyDB Project Page

This static microsite documents our ToyDB assignment: PF-layer buffering upgrades, a Slotted-Page storage layer, and AM indexing experiments.

## Files

- `index.html` — tabbed project page, PF comparison chart, embedded experiment captures.
- `styles.css` — warm light-brown theme, figure cards, responsive layout.
- `script.js` — tab logic, Chart.js rendering for PF comparison, optional CSV overrides.

## Preview locally

1. Open the repo root (e.g., `d:\DBMS_ProjectPage`).
2. Double-click `index.html` or use your editor’s Live Server extension.

## PF Layer chart

- The PF tab now ships with **built-in LRU vs MRU datasets** (0–100% read workloads) and a dropdown to choose the Y-axis metric (total physical I/O, reads, writes, hits, misses, etc.).
- Upload new CSVs at any time using the LRU/MRU file inputs (schema: `mix,logicalRead,logicalWrite,physicalRead,physicalWrite,pageHit,pageMiss`). The chart updates instantly.

## Slotted-page & AM evidence

- The SP tab shows the measured storage-utilization chart plus the captured console table (`part2 output.jpg`).
- The AM tab embeds the comparison chart from the experiment screenshot (`part3 output.jpg`) so the raw evidence is always on the page.

Let me know if you want extra automation (e.g., downloadable PDFs, batch CSVs, or a mini static server config) and I can add it.
