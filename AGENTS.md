# ChamberTech site

chambertech.net: one static page. One person sells two remote PC-tuning services and links to two free tools. Checkout is Shopify (Starter plan, store `be6008.myshopify.com`).

## Rules
- Plain HTML and one CSS file (`assets/ct.css`, tokens at the top, same colors as Chamber Game Optimizer). No JavaScript, no build step for the page.
- One primary (violet, glowing) button per screen. Carbon texture and glow live only in `.hero`.
- Red means before or error. Green means after. Never decoration.
- No taglines, helper text or secondary labels. If a screen needs one to make sense, fix the layout.
- Copy is first person ("I"). The owner is "Chamber" in public copy. Every performance number comes from a real session.
- Prices are typed in `index.html`. When a price changes in Shopify, change it here too.

## Map
- `index.html`: the whole site. `404.html`: not found.
- Booking: each service card is a GET form to `https://be6008.myshopify.com/cart/<variant id>:1`. Shopify opens checkout with the service in the cart; `attributes[...]` fields (the remote-access consent) land in the order's notes. Variant IDs: Overclock & Optimization `41053300850893`, Secure Boot / TPM `48362963730637`.
- Policies live in Shopify and are linked from the footer.
- `bench.json` + `tools/bench.mjs`: the hero benchmark. Edit `bench.json`, then run the tool; it rewrites the chart between the `<!-- bench -->` markers.
- `shopify-theme/`: the same design as a Shopify Online Store 2.0 theme, for when the store moves to a plan that allows custom themes. Its `assets/ct.css` is a copy; sync it from `assets/ct.css` before uploading.

## Commands
- Update the chart: `node tools/bench.mjs`
- Test the chart: `node tools/bench.test.mjs`
- Preview: `python3 -m http.server 8767` and open http://127.0.0.1:8767
- Never push, deploy or change DNS without the owner's go-ahead.

## Domain
The Shopify store's primary domain must not be chambertech.net once the static site is live there, or Shopify will redirect checkout links to the static site. Set `shop.chambertech.net` as the store's primary domain first, then point chambertech.net at the static host.
