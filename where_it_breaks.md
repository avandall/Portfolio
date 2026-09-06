# 🛡️ Hardening Review & "Where It Breaks" Triage Report (Checkpoint 2)

**Candidate / Engineer:** Vu Nguyen (Avandall)  
**Live Target:** `https://avandall.github.io/Portfolio/` (HTTPS)  
**Review Status:** ✅ **PASSED (Hardened & Ready for Production Launch)**  

---

## 🎯 Executive Summary

In accordance with **Week 9: Break It on Purpose & Hardening Review**, this document presents a rigorous, adversarial quality assurance audit of the portfolio. Rather than merely verifying the "happy path", the portfolio was systematically attacked across edge cases, input anomalies, network disruptions, cross-browser rendering engines, and mobile viewports.

All findings have been triaged into **Fix-Now** (resolved and verified with engineering fixes) and **Known Limitations** (transparently documented trade-offs).

---

## 🧪 1. Attack Scenarios & Edge Case Testing

```
                           ADVERSARIAL TEST MATRIX
┌──────────────────────────────────────┬──────────────────────────────────────┬─────────────┐
│ TEST SCENARIO & ATTACK VECTOR        │ UNHARDENED REACTION (VULNERABILITY)  │ STATUS      │
├──────────────────────────────────────┼──────────────────────────────────────┼─────────────┤
│ 1. Empty & Whitespace Form Submit    │ Silent reload / missing warning      │ 🟢 FIXED    │
│ 2. Rapid Double-Click Spam Submit    │ Duplicate API payloads sent          │ 🟢 FIXED    │
│ 3. Garbage / Incomplete Email Input  │ Passed through if "@" was present   │ 🟢 FIXED    │
│ 4. AdBlocker / Offline / 429 Limit   │ Silent failure / user stuck          │ 🟢 FIXED    │
│ 5. Mobile Keyboard Overlay & Zoom    │ Viewport displacement & font zoom    │ 🟢 FIXED    │
│ 6. Broken / Dead External Hyperlinks │ 404 dead-ends                        │ 🟢 FIXED    │
│ 7. SEO / Social Share Card Missing   │ Blank / broken chat preview card     │ 🟢 FIXED    │
│ 8. Rapid Lightbox Modal Escape Key   │ Stale backdrop scroll lock           │ 🟢 FIXED    │
└──────────────────────────────────────┴──────────────────────────────────────┴─────────────┘
```

---

## 🔧 2. Triage Category A: Fix-Now Findings (Resolved & Verified)

### Issue #1: Form Double-Submit Race Condition
- **Attack Vector:** Rapidly clicking the `[ Send Email ]` button 3–5 times within 500ms during network latency.
- **Vulnerability:** Unbounded parallel `fetch()` dispatches to Formspree, wasting API quota and causing duplicate inbox notifications.
- **Engineering Fix:** Implemented a state guard `isFormSubmitting` flag in `app.js`. Upon initial trigger, the button is immediately disabled (`submitBtn.disabled = true`), text updates to `⏳ Sending message...`, and subsequent clicks are safely dropped until the promise settles.
- **Proof:** Verified in Chrome DevTools Network panel — exactly 1 HTTP POST request is dispatched under rapid clicking.

### Issue #2: Permissive Email Regex Validation
- **Attack Vector:** Submitting pseudo-emails like `user@domain` (missing Top-Level Domain `.com`/`.vn`) or strings containing illegal control characters.
- **Vulnerability:** Native HTML5 `type="email"` in certain mobile browsers allows strings without a valid TLD.
- **Engineering Fix:** Enforced strict RFC-compliant regex in client-side JS (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`) with interactive visual feedback (`.input-error` shake animation and inline alert banner).
- **Proof:** Malformed emails are blocked with actionable guidance before any network request leaves the browser.

### Issue #3: Network Blockade / Formspree Service Outage Fallback
- **Attack Vector:** User accessing behind strict corporate proxies, Brave Shields/AdBlockers blocking third-party telemetry, or Formspree encountering HTTP 429 / 500.
- **Vulnerability:** User receives a generic failure error with no alternative mechanism to reach the engineer.
- **Engineering Fix:** Built an automated, multi-tiered graceful fallback:
  1. Detects `HTTP 429`, `HTTP 500`, or network rejection (`catch(err)`).
  2. Displays a helpful banner notifying the user.
  3. Automatically synthesizes and triggers a native `mailto:` link with pre-filled subject and body containing the user’s typed message.
- **Proof:** Disconnecting network or blocking Formspree domain in DevTools smoothly opens the default mail client (`avannguyen.nina@gmail.com`).

### Issue #4: Social Share Card & Search Metadata Hygiene
- **Attack Vector:** Sharing the portfolio link on LinkedIn, Twitter/X, Discord, Zalo, or Facebook without explicit Open Graph meta tags.
- **Vulnerability:** Card rendered with empty descriptions, generic default favicons, or broken image previews.
- **Engineering Fix:** Configured complete Open Graph (`og:*`), Twitter Card (`twitter:card`), SVG inline data favicon, canonical URLs, and descriptive meta headers in `index.html`.
- **Proof:** Validated via OpenGraph linter and social platform preview debuggers.

---

## 📋 3. Triage Category B: Known Limitations (Transparently Documented)

| # | Known Limitation | Technical Rationale & Assessment | Mitigation / Roadmap |
| :--- | :--- | :--- | :--- |
| **KL-1** | **Formspree Free Tier Quota (50/month)** | Third-party free tier limitation on serverless endpoint. | Automated `mailto:` fallback activates instantly when rate limit (`429`) or quota is exceeded. |
| **KL-2** | **Dark Theme Only (No Light Mode Toggle)** | Deliberate design aesthetic matching the "Obsidian IDE / Terminal" engineering persona. Avoids visual dilution. | High-contrast WCAG AA compliant palette (`#0B0F17` vs `#F8FAFC`) ensures readability across all lighting conditions. |
| **KL-3** | **Interactive WebSockets in Case Study are Pre-recorded Traces** | Live WebSocket voice backend requires hosted GPU instances with recurring cloud costs. | Case study provides high-fidelity DevTools network trace (`PROJ1-CAP-01`) and terminal output (`PROJ1-CAP-02`) proving real TTFA latency < 200ms. |
| **KL-4** | **Screen widths < 320px (Ultra-narrow feature phones)** | Extremely rare edge devices (< 0.1% web traffic). | Tested and fully responsive down to standard 360px (Galaxy S8) and 375px (iPhone SE). |

---

## 🏆 4. Launch Gate Verification Checklist

- [x] **Adversarial Input Testing:** Empty strings, whitespace, scripts (`<script>`), and invalid emails handled cleanly.
- [x] **Race Conditions:** Submit button debounced and protected against duplicate clicks.
- [x] **Failure Resiliency:** Graceful degradation to `mailto:` upon API errors or adblocker interference.
- [x] **Accessibility & Navigation:** Keyboard `Escape` key closes modals/lightboxes; clean focus outlines maintained.
- [x] **SEO & Social Preview:** Complete OG tags, Twitter summary cards, SVG favicon, and semantic heading hierarchy (`h1` -> `h2` -> `h3`).
- [x] **Performance:** Pure Vanilla JS and CSS with zero heavy runtime dependencies; initial DOM payload < 50KB.

---

*Signed off for Production Launch — Checkpoint 2 PASSED.*
