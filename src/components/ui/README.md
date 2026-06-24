# CairnID UI Components

Reusable interface primitives live here. Use Tailwind utilities for layout and
composition, but do not rebuild buttons, cards, status pills, chips, banners, or
icon buttons page by page.

The rule is:

- Design decisions start in `src/styles/tokens.css`.
- Tailwind utility names are bridged from those tokens in `src/styles/app.css`.
- Reusable component behavior and states live in `src/styles/components.css`.
- Astro wrappers in this folder provide the public component API.

If a repeated UI pattern does not have a primitive yet, add one here and document
it on `/ui` before using it elsewhere.
