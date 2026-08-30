# Free Cleaning Business — UK Cleaning Website Template

A two-page, fully coded, responsive website template for UK cleaning businesses. Built with vanilla HTML/CSS/JS — no build step, no framework — so it can be dropped straight onto Netlify or GitHub Pages.

## What's included

- `index.html` — Home page: hero, trust strip, services, multi-step instant quote calculator, why choose us, before/after preview, how it works, reviews carousel, service area, final CTA
- `work.html` — Our Work: rotating before/after hero showcase + filterable gallery
- `assets/css/style.css` — All styling, driven by CSS custom properties
- `assets/js/config.js` — **The only file you should need to edit for a rebrand.** Business info, contact details, pricing, region settings
- `assets/js/main.js` — Shared behaviour: nav, before/after sliders, reviews carousel, reveal animations
- `assets/js/quote.js` — The multi-step quote calculator logic

## Rebranding for a new client (do this first)

Open `assets/js/config.js` and update:

1. `businessConfig.businessName`, `tagline`, `phoneDisplay`/`phoneRaw`, `whatsapp`, `email`, `addressLine`, `serviceCity`, `serviceAreas`, `hours`, `social`
2. `pricingConfig` — every number the quote calculator uses lives here: `servicePrices`, `bedroomPrices`, `bathroomPrices`, `officeSizePrices`, `frequencyDiscounts`, `addons`, `propertyAdjustments`

Then swap the placeholder photography (currently hotlinked from Unsplash) for the client's real photos in `index.html` / `work.html`, and replace the icon placeholders in `assets/icons/`.

## Going international (e.g. converting to a US client)

Update in `businessConfig`: `country`, `currency`, `currencySymbol`, `postcodeLabel` → `"ZIP Code"`, `phoneCountryCode` → `"+1"`, and re-check phone number formatting in the header/footer. No other file needs to change.

## Connecting the quote form to a real backend

The "Request This Quote" step currently validates and shows a success state only — nothing is submitted anywhere yet. `businessConfig.integrations` in `config.js` marks where to wire this up. The form (`quote.js`, `submitDetails()`) is structured to drop straight into:

- **Netlify Forms** — add `data-netlify="true"` and a hidden form name, point the fetch at `/`
- **Formspree** — POST the `FormData` to your Formspree endpoint
- **EmailJS** — call `emailjs.send()` with the collected fields
- **Supabase / Firebase / custom API** — POST the JSON payload to your endpoint

## Deploying

Drag the whole folder onto Netlify, or push it to a GitHub repo and enable GitHub Pages from the root — no build step required.

## Notes

- All photography is placeholder stock (Unsplash) and should be swapped for the client's real work before launch.
- Floating WhatsApp/phone buttons, before/after sliders, and the quote calculator are fully functional vanilla JS — no dependencies.
- Respects `prefers-reduced-motion` throughout.
