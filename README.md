# LUMEN — Pricing & Go-to-Market Case — ATELIA × ESCP Starter Kit

> This repo is your starting point. Codex should read this README first.

## How to Get Started

This repo is a **template**: click **Fork** (top right), not "Use this template." Fork keeps your copy linked back to the original — that's what lets ATELIA automatically find every team's work, without anyone needing to send a link.

Once you've forked it, add your teammates as collaborators (Settings → Collaborators on your fork), and leave the visibility as **Public** — don't switch it to Private, or we lose access to your work.

## The Brief

The full brief is in `LUMEN_Case_Brief.md` (and a formatted version in `LUMEN_Case_Brief.pdf`). The data is in the `data/` folder, documented in `data/README_data.md`.

One-sentence summary: LUMEN, a functional beverage brand, has to decide **price, positioning, and launch channel(s)** to enter the German market — with no real German sales data (LUMEN isn't there yet), and a real trade-off between the CMO (premium positioning) and the CFO (fast return on investment).

## Rule #1 — Prompt Logging Is Automatic

This repo includes an `AGENTS.md` file, which Codex reads automatically at the start of every task — you don't need to open or edit it. The first time you talk to Codex in a new conversation, it will ask for your **student ID**. Answer it, and from then on Codex logs every prompt you send it — automatically, verbatim — into `prompts/<your-id>/session-*.md`, without you doing anything else.

**You don't fill this in by hand.** Your only job is to make sure that log file gets committed along with your code changes — Codex writes it, but you still need to include it when your pull request is created and merged. If a pull request only has code changes and no updated log file, that's a sign something didn't get logged.

Why we're doing this: it's not to monitor you. It's what lets us understand, at the end, how you reasoned — not just what you produced. A good result reached with a clear prompt from the start isn't scored the same as a good result reached after fifteen random attempts.

## Rule #2 — Before You Code, Ask Yourself These Questions

Check each box in this README as you go — not at the end, while you're working:

- [x] **Data**: this analysis uses aggregate survey, market, competitor, sales, funnel, cost, channel, price-test, and seasonality data. The name/email columns in `data/customer_survey.csv` were deliberately not used or exposed.
- [x] **API keys**: no external API was used for this analysis, so no API key is required or stored.
- [x] **Deployment**: the browser-accessible survey export removes respondent IDs, names, and email fields; the deployed frontend only receives analysis fields.
- [x] **Files generated along the way**: the business findings were saved as `docs/data-analysis-findings.md` because they are a useful, reviewable project deliverable.
- [x] **Storage**: no additional data store was introduced; the supplied CSVs remain the source data and the findings are stored as a version-controlled Markdown document.
- [x] **Robustness**: Strategy Builder accepts empty, partial, or unexpected selections, applies documented defaults, clamps score inputs, and keeps the recommendation page usable when a CSV contains missing numeric values.
- [x] **Explainability**: the findings document explains the data limitations, trade-offs, and recommendation in business language.
- [x] **Business relevance**: the analysis directly addresses Germany launch price, channel, city, timing, and the trade-offs LUMEN is choosing.

These questions aren't here to slow you down — they're part of what's being evaluated. A thoughtful answer to one of them is worth more than an extra feature nobody asked for.

## What We Expect at the End

- A prototype that works, even partially, on the LUMEN case
- Your prompt log (`prompts/<your-id>/session-*.md`) committed and up to date
- A short paragraph below, written in business language (not technical), explaining what you did and why
- A live URL (Vercel or similar) if you deployed it — not required to still get credit, but expected if you did

## Our Approach

We built a decision cockpit that turns the supplied market, customer, competitor, pricing, channel, seasonality, and marketing evidence into a transparent Germany launch scenario. The current recommendation balances a €2.19 price, a Retail/Grocery and DTC test mix, Hamburg as the highest directional city score, and a May launch ahead of the July demand peak. The tool makes the trade-off explicit: it prioritises learning, contribution, and cash efficiency over maximum short-term volume, maximum unit margin, or immediate national coverage.
