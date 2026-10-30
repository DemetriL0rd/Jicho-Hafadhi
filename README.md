# Jicho Hifadhi: job ad risk checker

Prototype for the 13th ROLIC competition (Indiana University Maurer School of Law, with Lawyers Without Borders):
"Online Safety and Anti-Trafficking Education". It scores job ads that Tanzanian students see on WhatsApp,
Facebook and similar sites for signs of scams and trafficking. It runs entirely in the browser, with no AI and no server.

Live site: https://demetril0rd.github.io/Jicho-Hafadhi/

## Files
- `index.html`: the finished page. Open it in any browser; nothing else is needed.
- `build.py`: rebuilds `index.html` from `src/` (`python3 build.py`).
- `src/page.html`: layout, styles and page logic (check a job, warning signs, gauge, test log, updates). The marker `/*CORE*/` is where the four scripts below are inserted.
- `src/core.js`: the 19 factors and their tiers and points, bonus combinations, risk bands and scoring (`scoreAd`).
- `src/salary.js`: exchange rates, job types and salary benchmarks by region, with sources.
- `src/wordbank.js`: word lists for job titles, duties, requirements, vague job phrases, known employers and business words. Add entries here to teach the reader new words.
- `src/rules.js`: the English rule-based reader (`readJob`) that turns ad text into factor tiers, with evidence.

## Notes
- **Tanzania is home.** Anywhere else, including Kenya, counts as abroad.
- **The test log** is shared with your team when the page runs as a hosted artifact on claude.ai. When you open the HTML file directly, tests are saved in that browser only; use Export CSV to share them.
- **The AI second opinion button** only works in the hosted version. The rule-based scoring works everywhere.
