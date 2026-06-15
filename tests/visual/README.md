# Visual tests

Playwright-driven visual checks for layout regressions that JSDOM unit tests
can't catch.

## Run

The dev server must be running on `http://localhost:8080` (set `PREVIEW_URL`
to override).

```bash
python3 tests/visual/product-card-price.spec.py
```

## What's covered

| Spec                              | Asserts                                                                 |
| --------------------------------- | ----------------------------------------------------------------------- |
| `product-card-price.spec.py`      | Price row on `/shop` never overflows and stays ≤2 lines at xs/sm/md/lg/xl |

Screenshots are written to `tests/visual/__screenshots__/` for manual review
and are git-ignored.
