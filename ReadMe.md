# Nasy Perfume Collection

Nasy Perfume Collection is an online e‑commerce store for perfumes and fragrances. It supports a full e‑commerce feature set: product catalog, shopping cart, checkout, order management, shipping, user accounts, coupons, reviews and accepts payments (Stripe, PayPal, credit/debit).

## Key features
- Product listing, categories, variants (size, scent)
- Search, filters, sorting, recommendations
- Persistent shopping cart, guest & registered checkout
- Secure payments: Stripe, PayPal, card payments
- Orders, invoices, shipment tracking, returns
- Admin dashboard: product, order and customer management
- Discounts, coupons, gift cards, email notifications
- Analytics & basic fraud checks

## Payments
- Supports Stripe and PayPal out of the box; can add other gateways
- Use test keys in development, live keys in production
- Webhook endpoints for payment status and subscription events
- Follow PCI compliance and HTTPS for production

## Quick start (developer)
1. git clone 
2. cd repo
3. cp .env.example .env and set:
    - DATABASE_URL
    - STRIPE_KEY, STRIPE_SECRET
    - PAYPAL_CLIENT_ID, PAYPAL_SECRET
    - SMTP_HOST, SMTP_USER, SMTP_PASS
4. npm install (or yarn)
5. npm run migrate && npm run seed
6. npm run dev
7. Configure webhooks for Stripe/PayPal to /api/webhooks

## Deployment notes
- Use HTTPS and set secure cookies
- Configure payment gateway live credentials and webhook URLs
- Scale database and background workers for order processing
- Enable email delivery and monitoring

## Contributing
- Fork, create a feature branch, open PR with description and tests
- Keep changes scoped and document new env vars or migrations

## License
MIT — see LICENSE file

## Contact
Support: support@nasyperfume.example
d