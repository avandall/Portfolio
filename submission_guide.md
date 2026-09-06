# 📋 Hướng Dẫn Chi Tiết Nộp Bài Week 9 Trên Portal

Cổng nộp bài: **[https://internship.flyrank.ai](https://internship.flyrank.ai)** (Chọn assignment card: **Week 9 · Launch & Keep Building**)

---

## 🔗 1. Deliverable Links (Dán vào ô Deliverable links - mỗi link 1 dòng)

```text
https://avandall.github.io/Portfolio/
https://github.com/avandall/Portfolio
```

---

## 📁 2. Files (Đính kèm ảnh chụp màn hình vào mục Files)

1. **Ảnh 1 - Web Analytics Dashboard:**
   - Ảnh chụp dashboard Cloudflare Web Analytics (hoặc Google Analytics) hiển thị trang web đã nhận tín hiệu truy cập / pageviews.
2. **Ảnh 2 - Mobile View & Footer:**
   - Ảnh chụp màn hình điện thoại hoặc Chrome DevTools Device Mode (iPhone / Android) hiển thị chân trang (Footer) của Portfolio.
3. **Ảnh 3 - Performance & Lighthouse Score:**
   - Ảnh chụp điểm PageSpeed / Lighthouse (SEO, Accessibility, Performance đạt chuẩn xanh).

---

## 📝 3. Notes (Dán nội dung tóm tắt dưới đây vào ô Notes)

```markdown
### Week 9 Submission: Launch & Keep Building (Checkpoint 2 Passed)

1. **Hardening Review & Adversarial Testing:**
   - Tested empty inputs, regex malformed emails, and rapid double-submit race conditions.
   - Fixed debounce state guard on contact modal (`isFormSubmitting`) and implemented automatic multi-tier fallback to `mailto:` upon API limit (429) or adblocker network blockades.
   - Documented full findings in `where_it_breaks.md` (Fixed vs Known Limitations).

2. **Launch & Hygiene:**
   - Site is fully live over HTTPS at `https://avandall.github.io/Portfolio/`.
   - Comprehensive Open Graph meta tags, SVG inline favicon, Twitter Summary Card, and SEO headers verified.
   - Privacy-friendly analytics configured.

3. **Compounding & Plan to Keep Building:**
   - Documented 30-minute 3-Beat case study framework in `keep_building_plan.md`.
   - Named next upcoming piece: *Distributed Agent Evaluation & Guardrail Benchmark Pipeline*.
   - Established bi-weekly reminder to continuously compound portfolio with production artifacts.
```
