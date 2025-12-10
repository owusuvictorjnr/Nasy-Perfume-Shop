# E-Commerce Platform - Quick Start Guide

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase project setup (for authentication)
- PostgreSQL database (for backend)

---

## 🚀 Getting Started

### 1. Frontend Setup

```bash
cd frontend/nasy-scents-collection

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local with your values:
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Run development server
npm run dev
```

**Frontend will be available at:** http://localhost:3001

### 2. Backend Setup (Optional - for full integration)

```bash
cd backend/nasy-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env with your values:
DATABASE_URL=postgresql://user:password@localhost:5432/nasy_db
FIREBASE_ADMIN_KEY=your_firebase_admin_key
JWT_SECRET=your_secret_key
STRIPE_KEY=your_stripe_key
STRIPE_SECRET=your_stripe_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed

# Run development server
npm run start:dev
```

**Backend will be available at:** http://localhost:3000 (or 4000 depending on config)

---

## 🎨 Available Pages & Features

### Public Pages (No Login Required)

- `http://localhost:3001/` - Homepage
- `http://localhost:3001/product/[slug]` - Product details
- `http://localhost:3001/category/[slug]` - Category pages
- `http://localhost:3001/search?q=perfume` - Search results
- `http://localhost:3001/login` - Login page
- `http://localhost:3001/register` - Register page

### Protected Pages (Login Required)

- `http://localhost:3001/cart` - Shopping cart
- `http://localhost:3001/checkout` - Checkout process
- `http://localhost:3001/orders/history` - Order history
- `http://localhost:3001/orders/confirmation` - Order confirmation
- `http://localhost:3001/account/profile` - User profile
- `http://localhost:3001/wishlist` - Wishlist

---

## 🔑 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable:
   - Authentication (Email/Password + Google OAuth)
   - Firestore Database
4. Copy your config and add to `.env.local`

```javascript
// Example Firebase config
{
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}
```

---

## 🛒 Testing the E-Commerce Flow

### 1. Create an Account

- Visit `/register`
- Sign up with email or Google account

### 2. Browse Products

- Explore homepage categories
- Search for specific products
- View product details
- Check ratings and reviews

### 3. Add to Cart

- Click "Add to Cart" on any product
- View cart at `/cart`
- Update quantities or remove items

### 4. Checkout

- Click "Proceed to Checkout"
- Enter shipping address
- Select shipping method
- Choose payment method
- Review order and confirm

### 5. View Order History

- Visit `/orders/history`
- Track order status
- View past orders

### 6. Manage Account

- Visit `/account/profile`
- Edit profile information
- Manage saved addresses
- Manage saved payment methods
- Update notification preferences

---

## 🧪 Mock Data

The application comes with sample product data in `lib/data.ts`:

```typescript
// Mock products include:
- Women's Perfumes (multiple subcategories)
- Men's Fragrances
- Kids' Products
- Each with: name, price, images, ratings, reviews
```

To use real backend data:

1. Update API endpoints in `lib/products.ts`
2. Implement backend product endpoints
3. Replace mock data fetching with API calls

---

## 🔐 Authentication Test Credentials

For demo purposes, you can use:

```
Email: demo@nasyperfumes.test
Password: Test123456!
```

Or sign up with Google account.

---

## 📱 Responsive Testing

The platform is fully responsive. Test on different devices:

```bash
# Desktop: 1920px and above
# Laptop: 1024px - 1919px
# Tablet: 768px - 1023px
# Mobile: 320px - 767px
```

Use Chrome DevTools to test responsive behavior.

---

## 🔧 Troubleshooting

### Issue: Cart not loading

**Solution:** Ensure API endpoint in `.env.local` is correct, or use mock data mode

### Issue: Firebase authentication not working

**Solution:**

- Check Firebase config in `.env.local`
- Enable Email/Password and Google OAuth in Firebase Console
- Check browser console for errors

### Issue: Products not displaying

**Solution:**

- Verify `lib/data.ts` has product data
- Check browser console for errors
- Ensure images URLs are accessible

### Issue: Build errors

**Solution:**

- Delete `node_modules` and `.next` folder
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

---

## 📊 Database Schema (Backend Reference)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  firstName VARCHAR,
  lastName VARCHAR,
  avatar VARCHAR,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  category VARCHAR,
  subcategory VARCHAR,
  price DECIMAL,
  listPrice DECIMAL,
  brand VARCHAR,
  avgRating FLOAT,
  numReviews INT,
  featured BOOLEAN,
  newArrival BOOLEAN
);

-- Cart
CREATE TABLE cart (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Cart Items
CREATE TABLE cart_items (
  id UUID PRIMARY KEY,
  cartId UUID REFERENCES cart(id),
  productId UUID REFERENCES products(id),
  quantity INT,
  price DECIMAL
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  status VARCHAR DEFAULT 'pending',
  subtotal DECIMAL,
  tax DECIMAL,
  shipping DECIMAL,
  total DECIMAL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  orderId UUID REFERENCES orders(id),
  productId UUID REFERENCES products(id),
  quantity INT,
  price DECIMAL
);
```

---

## 🚀 Deployment

### Frontend (Vercel Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Backend (Railway, Render, or Heroku)

```bash
# Example with Railway
railway link
railway up
```

---

## 📚 Key Files to Modify for Customization

| File                               | Purpose                | Customization            |
| ---------------------------------- | ---------------------- | ------------------------ |
| `tailwind.config.ts`               | Colors, fonts, spacing | Brand colors, typography |
| `lib/data.ts`                      | Product data           | Real product data        |
| `app/(home)/components/Hero.tsx`   | Homepage hero          | Banner images, text      |
| `lib/firebase/firebase.ts`         | Firebase config        | Your Firebase project    |
| `components/Navigation.tsx`        | Header/nav             | Logo, links, branding    |
| `app/(home)/components/Footer.tsx` | Footer                 | Company info, links      |

---

## 🎯 Performance Optimization Checklist

- [ ] Enable image optimization (Cloudinary/Vercel)
- [ ] Implement code splitting
- [ ] Add caching headers
- [ ] Compress images and assets
- [ ] Minify CSS and JavaScript
- [ ] Set up CDN for static assets
- [ ] Enable gzip compression
- [ ] Monitor Core Web Vitals
- [ ] Set up analytics
- [ ] Test on 3G/4G networks

---

## 📞 Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs

---

## ✅ Checklist for Production

- [ ] Environment variables configured
- [ ] Firebase project created and configured
- [ ] Database setup and migrations run
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] Payment gateway integrated (Stripe/PayPal)
- [ ] HTTPS enabled
- [ ] Logging and monitoring set up
- [ ] Backup strategy in place
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Error handling and logging
- [ ] Analytics integrated
- [ ] Email notifications configured
- [ ] SMS notifications (optional)

---

## 🎉 You're All Set!

Your complete e-commerce platform is ready to use. Start with the frontend development, then integrate with the backend APIs when ready.

For questions or support, refer to the documentation or contact the development team.

**Happy coding! 🚀**
