# Visual tests

Playwright-driven visual checks for layout regressions that JSDOM unit tests
can't catch.

## Layout assertions

```bash
python tests/visual/product-card-price.spec.py
python tests/visual/issue-index-card.spec.py
```

`product-card-price` asserts the `/shop` ProductCard price row at xs/sm/md/lg/xl
never overflows, stays within 2 lines, and keeps the current price on the first
line.

`issue-index-card` renders the "Why ASIKON" editorial card on `/` at the same
breakpoints and asserts: card doesn't overflow the viewport, headline font-size
sits in the expected responsive band (40/48/56px), tight 0.9 leading, mono
label >= 10px, the pulse dot is present and >= 7px, and the footer label stays
on-screen.

Both specs save per-breakpoint screenshots to `__screenshots__/` for review.


## Baseline diffing

```bash
python tests/visual/diff.py            # compare current screenshots to baselines
python tests/visual/diff.py --update   # overwrite baselines (after an intentional UI change)
```

Pixel comparison with an 8/255 per-channel tolerance; a screenshot fails if
more than 0.5% of pixels differ. Failing pairs are written to `__diffs__/`
with the changed pixels highlighted in red.

Baselines live in `__baselines__/` and **must be committed**. Update them
whenever a card visual is intentionally changed and include the new
baselines in the same PR.

## CI

`.github/workflows/visual-tests.yml` runs on every PR:

1. installs deps + Chromium
2. boots the Vite dev server on `127.0.0.1:8080`
3. runs the layout spec (assertions + screenshots)
4. diffs against `__baselines__/`
5. uploads `visual-screenshots` artifact (screenshots + red diff overlays)
6. posts/updates a PR comment summarizing pass/fail with a link to the artifact

## First-time setup on CI

Run the suite locally once, then:

```bash
python tests/visual/diff.py --update
git add tests/visual/__baselines__
```

Commit the baselines and merge — CI will diff against them from then on.

## Layout

| Folder            | Purpose                              | Git              |
| ----------------- | ------------------------------------ | ---------------- |
| `__screenshots__` | Latest run output                    | ignored          |
| `__baselines__`   | Approved reference images            | **committed**    |
| `__diffs__`       | Red-highlighted diffs for failures   | ignored          |
