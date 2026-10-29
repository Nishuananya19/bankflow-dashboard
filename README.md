# BankFlow — Digital Banking Dashboard

A responsive mock digital banking dashboard built with Next.js App Router, React, TypeScript, and Tailwind CSS. All data is fictional and held in client-side memory; this is an interview demo, not a real banking application.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Mock login

Use any non-empty email and a password of at least 4 characters. No credentials are sent to a server. The demo login is only a UI gate and is not production authentication.

## Architecture and state

- `app/page.tsx`: interactive dashboard, mock login, account selection, transaction search/filter/sort/pagination, and transfer flow.
- `app/globals.css`: global styles and responsive design.
- Account and transaction types are defined in the page module. Shared account/transaction state lives in the dashboard component so transfer updates are reflected across views.
- The app is a Client Component because its main interactions rely on local React state. A production implementation should move sensitive operations and authorization to server-side services.

## Assumptions and limitations

- All balances, transactions, and reference numbers are fictional.
- Transfers are simulated in browser memory and reset on refresh.
- Authentication is mock-only; do not enter real credentials.
- No real payment gateway, backend API, database, or server-side authorization is connected.
- The chart is a lightweight CSS visualization based on mock monthly values.

## Transfer validation test notes

Manually verify that the app rejects the same source/destination account, zero or negative amounts, and amounts above the source balance. Confirm invalid transfers leave balances unchanged. A valid transfer decreases the source balance, increases the destination balance, and adds a debit and credit record.
