# ILU Palada Challenge – TV display

Route: **`/ilu/tv-display`**. A full-screen 1920×1080 kiosk page (scaled to any screen) that rotates 8 live screens, shows sponsor ads beside them, and plays a full-screen Raihsoft video ad between rotations.

## URL options

| Param | Default | Meaning |
|---|---|---|
| `demo=1` | off | Run on sample data that changes every 7 s (shows the demo-only control buttons). |
| `seconds=18` | 18 | Seconds per screen (minimum 5). |
| `adEvery=4` | 4 | Play the Raihsoft ad after every N screens. `0` turns it off. |

Keyboard: ← / → change screen, Space pause, F fullscreen, A play/skip the Raihsoft ad. Mouse movement shows the control bar; it and the cursor hide after 3.5 s.

## Files

- `TvDisplay.tsx` – client component. Writes the shell once and starts the engine; renders the QR code through a portal.
- `markup.ts` – static shell markup (top bar, ticker, overlays, the Raihsoft ad scenes, control bar).
- `engine.ts` – rotation, transitions, live number tweens, toasts, milestones, ads, Raihsoft ad timeline.
- `tvData.ts` – API → `TvSnapshot` mapping (live source) and the sample data source.
- `tv-display.css` – all styles, scoped under `.tvd`; keyframes are prefixed `tv-`.

## Data (live source)

Polled every 15 s with the same tenant/fundraising config as the order pages (`getILUConfig()`):

| Shown as | API field |
|---|---|
| Total ordered | `order_status.grand_total` (fallback: clubs + `individual_total`) |
| Delivered | `order_status.total_delivered` |
| Ready to deliver | `order_status.total_approved` |
| Pending | ordered − delivered − ready |
| Current stock | `order_status.total_stock` |
| Clubs / individuals split | `organization_total` / `individual_total` |
| Club rows | `order_by_organization`: `total_approved`, `total_delivered`, `total_initiated` |
| Place / zone | `organizations`: `place`, `zone_name` |

**Deliveries over time.** If delivered orders carry a timestamp (`delivered_at`, `delivery_date` or `updated_at` on `order_by_organization.orders[]`), the "Just delivered" list and the hourly chart use it. Without timestamps the display detects deliveries by comparing each poll with the previous one and keeps that log in `localStorage` for the day, so the list and chart fill up while the TV runs.

Screens without data are skipped automatically (no zones → no zone screen, no deliveries yet → no "Just delivered" / hourly screens).

**Ads.** Fetched every 5 min from `NEXT_PUBLIC_ILU_TV_ADS_URL`, default `{BASE_API_URL}orders/advertisements/?tenant=…`. Accepted fields: `id`, `title`/`name`, `description`/`body`/`content`, `contact`/`phone`/`mobile`, `image`/`image_url`/`banner`/`file`, `is_active`, `sort_order`, `start_date`, `end_date`. A row with an image is shown as a full-card image only; otherwise as a coloured text card. When the endpoint is empty or unavailable, two ILU house ads are shown.

If the API is unreachable the last data stays on screen with an "Offline" badge, and polling continues.
