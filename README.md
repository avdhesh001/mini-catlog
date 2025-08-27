# Mini Catalog (Expo + TS)

## Setup

- Install Node 20+
- Install deps: `npm install`
- Start: `npm run android` (or `npm run web`)

## Scripts

- `npm run lint` – ESLint
- `npm run test` – Jest + RTL
- `npm run android` – Run on Android

## Stack

- React Native (Expo), TypeScript
- Navigation: React Navigation (stack + tabs)
- State: Redux Toolkit + redux-persist (AsyncStorage)
- Data: React Query + Axios (mocked local JSON)
- Forms: React Hook Form + Yup
- i18n: i18next (EN/AR), RTL toggle

## Features

- Product list with pull-to-refresh, favorites
- Product details with carousel, add to cart with quantity
- Cart with quantity update, remove, subtotal/total, promo SAVE10
- Offline: cache last product list
- EN/AR translations with RTL

## Testing

- Unit: selectors and reducers
- UI: list favorite toggle, cart promo flow

## CI

- GitHub Actions runs lint and tests on push/PR

## Mock API

- Data in `data/products.json`. Replace with json-server if preferred.
