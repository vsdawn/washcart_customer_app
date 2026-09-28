# WashKart - Customer Mobile Application

Production-ready mobile marketplace application for laundry, dry cleaning, steam ironing, shoe restoration, and garment-care services. Built with **React Native CLI**, **TypeScript**, **Redux Toolkit**, **React Navigation**, **React Hook Form**, and **Zod**.

---

## 📱 Features & Highlights

- 🛍️ **Service Browsing & Category Catalog**: Laundry, Dry Cleaning, Wash & Iron, Steam Ironing, Shoe Deep Clean, Blanket Washing, Premium Care.
- 🧺 **Smart Shopping Cart**: Automatic subtotal, delivery fee waiver calculations (free above ₹499), 18% GST tax breakdown, minimum order checks (₹199).
- 🏷️ **Promo Coupon System**: Discount application (`WASH20`, `SAVE50`, `FREEDEL`, `WELCOME100`) with real-time validation.
- 📍 **Address Management**: Saved locations (Home, Work, Other) with GPS detection abstraction.
- 📅 **Flexible Slot Booking**: Date & time window selector for doorstep pickup and minimum 24hr processing time delivery slots.
- 💳 **Payment Gateway Abstraction**: Ready for Razorpay, UPI (GPay, PhonePe, Paytm), Cards, Net Banking, Wallets, and COD.
- 🚚 **Live Order Tracking**: Visual 12-step status timeline (`ORDER_PLACED` to `DELIVERED`), garment-level item counting, and live delivery partner ETA.
- 📦 **Order Management**: Order history, order again (cart re-population), invoice breakdown, and ticket cancellation.
- 💎 **WashKart Pass Subscriptions**: Monthly laundry subscription tiers (Basic, Family Shield, Executive Platinum).
- 🎫 **Support & Complaint Ticket Center**: Order issue reporting (missing item, stain, damage), WhatsApp/Call integration, and FAQs.
- 🔒 **Security & Offline Support**: Secure storage abstraction for auth tokens, network status offline banner, and mock API mode toggle.

---

## 🛠️ Technology Stack

| Library / Tool | Purpose |
| :--- | :--- |
| **React Native CLI** (v0.73.4) | Native cross-platform mobile framework (Non-Expo) |
| **TypeScript** (v5.3.3) | Strong type safety throughout components & store |
| **React Navigation v6** | Native Stack + Bottom Tabs navigation architecture |
| **Redux Toolkit** | Global state management for Auth, Cart, Orders, Location |
| **React Hook Form + Zod** | High-performance form handling & validation schemas |
| **Axios** | HTTP client with bearer auth interceptor & error normalization |
| **AsyncStorage** | Local persistent storage for user preferences & state |
| **Jest & RNTL** | Unit and component testing suite |

---

## 📋 Prerequisites

Ensure your development workstation meets the following requirements:

- **Node.js**: `v18.x` or `v20.x` (`node -v`)
- **npm**: `v9.x` or higher (`npm -v`) or **Yarn**: `1.22.x`
- **Java Development Kit (JDK)**: OpenJDK 17 (`java -version`)
- **Android Studio**: Android Studio Jellyfish/Koala with Android SDK Platform 34 & Android SDK Build-Tools 34.0.0
- **Xcode** *(macOS only for iOS builds)*: Xcode 15.x with iOS 17 SDK & Command Line Tools
- **CocoaPods** *(macOS only)*: `v1.14.x` (`pod --version`)

---

## 🚀 Installation & Setup

1. **Clone the repository & install dependencies**:
   ```bash
   cd laundaryCustomerApp
   npm install
   ```

2. **iOS CocoaPods Setup** *(macOS only)*:
   ```bash
   cd ios
   pod install
   cd ..
   ```

---

## ⚙️ Environment Variables

Environment files are configured in root:

- `.env.development` (Default local development with mock APIs)
- `.env.staging` (Staging server testing)
- `.env.production` (Production API deployment)

### Configuration Keys:

```env
APP_ENV=development
USE_MOCK_API=true
API_BASE_URL=https://api-dev.washkart.com/v1
GOOGLE_MAPS_API_KEY=AIzaSyDevMockKey_WashKart_2026
PAYMENT_GATEWAY_KEY=rzp_test_washkart_mock_123
FIREBASE_PROJECT_ID=washkart-dev-app
```

---

## 🏃 Running the Application

### 1. Start Metro Bundler
```bash
npm start
```

### 2. Run on Android Emulator / Device
Make sure an Android Virtual Device (AVD) is running or a physical device is connected via USB with Debugging enabled.
```bash
npm run android
```

### 3. Run on iOS Simulator *(macOS only)*
```bash
npm run ios
```

---

## 🧪 Running Tests & Quality Checks

### Run Unit & Component Tests
```bash
npm test
```

### Run TypeScript Typechecking
```bash
npm run typecheck
```

### Run ESLint Code Analysis
```bash
npm run lint
```

---

## 📂 Project Directory Structure

```
src/
├── assets/         # App icons & graphics
├── components/     # Reusable UI components
│   ├── cards/      # ServiceCard, OrderCard, CouponCard, CategoryCard, SubscriptionCard
│   ├── checkout/   # PriceBreakdown, SlotSelector, QuantitySelector, LocationSelector
│   ├── common/     # AppButton, AppText, AppInput, AppHeader, AppCard, Icon, RatingStars
│   ├── modals/     # BottomSheet, ConfirmationModal
│   ├── orders/     # StatusTimeline
│   └── states/     # EmptyState, ErrorState, LoadingState, SkeletonLoader
├── config/         # Environment variables & App constants
├── constants/      # Order status configuration timeline & step mappings
├── hooks/          # Custom typed hooks (useCart, useAppDispatch, useAppSelector)
├── i18n/           # Localization strings (en.json)
├── mocks/          # Sample services, categories, coupons, orders, subscriptions
├── navigation/     # AuthNavigator, BottomTabNavigator, RootNavigator
├── screens/        # Screen screens (Auth, Home, Cart, Checkout, Orders, Offers, Profile)
├── services/       # API client, PaymentService, LocationService, AnalyticsService
├── store/          # Redux Toolkit store & slices (auth, cart, location, order)
├── theme/          # Centralized theme (colors.ts, typography.ts, spacing.ts, shadows.ts)
├── types/          # TypeScript interface definitions
├── utils/          # Currency formatters, phone & address validators, storage wrappers
└── validation/     # Zod validation schemas
```

---

## 🔄 Mock API vs Real Backend API Switching

The application is built with a decoupled API layer.

### Using Mock Data (`USE_MOCK_API=true`):
When `USE_MOCK_API=true` in `.env.development`, the app operates independently using realistic mock data in `src/mocks/`. You can log in with any mobile number and test the entire flow (browsing, cart, checkout, payment, order tracking, complaints, subscriptions).

**Demo Credentials**:
- Mobile: `9876543210`
- OTP: `123456`

### Switching to Real Backend APIs:
1. Update `.env.development` or `.env.production`:
   ```env
   USE_MOCK_API=false
   API_BASE_URL=https://your-production-api.washkart.com/v1
   ```
2. The UI screens remain completely unchanged because all API modules in `src/services/api/` abstract network calls using `apiClient`.

---

## 📄 License

Copyright © 2026 WashKart Inc. All rights reserved.
