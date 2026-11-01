# 🎬 IMovies - Online Movie Ticket Booking Platform

**IMovies** is a full-stack cinema ticketing web application designed to deliver a seamless movie browsing, real-time seat reservation, and digital ticketing experience. Built on the **MERN** stack (MongoDB, Express.js, React.js, Node.js) with **Bootstrap 5** and **JWT Authentication**.

---

## 🌟 Key Features & 6 Epics Implementation

### 1. Epic 1: Authentication & Authorization (JWT & Bcrypt)
- **User Registration & Login**: Secure credential verification with salted bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Distinct authorization for regular cinema patrons (`user`) and cinema operators (`admin`).
- **Session Persistence**: JWT token storage with Axios request & response interceptors.

### 2. Epic 2: Movie Catalog & Discovery
- **Now Showing & Coming Soon**: Toggle between movies currently in theaters and upcoming releases.
- **Search & Filters**: Search movies by title and filter by genre (*Action*, *Sci-Fi*, *Drama*, *Comedy*, *Adventure*, etc.) or language.
- **Rich Media & Details**: View ratings, certificates (U, UA, A), runtime, director, starring cast, synopsis, and trailers.

### 3. Epic 3: Cinema, Halls & Showtimes
- **Multiplex Mapping**: Theaters across major cities with format capabilities (IMAX 3D, 4DX, 2D, Dolby Atmos).
- **Date Selector Tabs**: Flexible showtime scheduling (Today, Tomorrow, and upcoming dates).

### 4. Epic 4: Interactive Real-Time Seat Reservation
- **Cinematic Seating Matrix**:
  - Curved screen visual indicator
  - Multi-tier seat layout: **Silver** (Rows A-B), **Gold** (Rows C-E), **VIP Recliners** (Rows F-G).
- **Real-Time Availability**:
  - Available (color-coded by tier)
  - Selected (Emerald green glow with dynamic counter)
  - Booked / Sold Out (Disabled dark state)
- **Concurrency Prevention**: Atomic MongoDB queries prevent race conditions and double-booking.

### 5. Epic 5: Checkout, Pricing & Digital Tickets
- **Dynamic Calculation**: Automatic subtotal, integrated GST (18%) and convenience fees.
- **Simulated Payment Gateway**: Supports Credit/Debit Cards, UPI / QR Code, and NetBanking.
- **Digital M-Ticket**: Digital cinema boarding pass with SVG QR code for cinema entry, printable layout, and unique booking reference.

### 6. Epic 6: User Dashboard & Admin Management
- **My Bookings**: View active tickets, past history, and one-click ticket cancellation with instant seat release.
- **Admin Management Portal**:
  - Live revenue and ticket sales ledger
  - Publish new movies to the catalog
  - Schedule new theater showtimes and custom tier pricing

---

## 🛠️ Project Structure

```
Moviee/
├── client/                     # React frontend (Vite + Bootstrap 5 + Bootstrap Icons)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, MovieCard, SeatPicker, AuthModal
│   │   ├── context/            # AuthContext (JWT, user state, login/register modal)
│   │   ├── pages/              # HomePage, MovieDetailPage, BookingPage, CheckoutPage, TicketPage, MyBookingsPage, AdminDashboardPage
│   │   ├── services/           # api.js (Axios with JWT interceptors)
│   │   ├── App.jsx             # React Router configuration
│   │   ├── index.css           # Cinematic dark theme, seat styles & animations
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express + MongoDB backend
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection handler
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Me, Profile
│   │   ├── movieController.js  # CRUD movie operations
│   │   ├── showController.js   # Show schedules & seat matrix generation
│   │   ├── theaterController.js# Theaters & screens
│   │   └── bookingController.js# Atomic seat booking, cancellation & admin stats
│   ├── middleware/
│   │   └── auth.js             # Protect & role-based authorize middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Theater.js
│   │   ├── Show.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── showRoutes.js
│   │   ├── theaterRoutes.js
│   │   └── bookingRoutes.js
│   ├── .env                    # Environment variables
│   ├── seed.js                 # Database seeder with realistic blockbuster movies
│   ├── server.js               # Express app entrypoint
│   └── package.json
│
└── package.json                # Root scripts
```

---

## 🚀 Getting Started

### 1. Database Setup (MongoDB)
You can use either a **local MongoDB server** or a free cloud cluster from **MongoDB Atlas**:

- **Option A (MongoDB Atlas - Recommended)**:
  1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
  2. Create a free M0 cluster and copy your connection string.
  3. Open `server/.env` and set:
     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/imovies?retryWrites=true&w=majority
     ```

- **Option B (Local MongoDB)**:
  1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
  2. Start the service. Default connection string in `server/.env` is:
     ```env
     MONGO_URI=mongodb://127.0.0.1:27017/imovies
     ```

### 2. Seed Sample Data
Populate the database with blockbusters (*Dune: Part Two*, *Deadpool & Wolverine*, *Interstellar*, *Gladiator II*), multiplexes, show schedules, and pre-configured accounts:
```bash
npm --prefix server run seed
```

### 3. Run the Development Servers

Open two terminals or run:

**Backend Server (Port 5000):**
```bash
npm --prefix server run dev
```

**Frontend React App (Port 3000):**
```bash
npm --prefix client run dev
```

Now open **http://localhost:3000** in your web browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@imovies.com` | `admin123` | Full access: Add movies, schedule shows, view revenue ledger |
| **User** | `user@imovies.com` | `user123` | Book tickets, view digital passes, cancel bookings |

---

## 🧪 Testing the 19 Tasks Checklist

- [x] **Task 1-3 (Auth & Security)**: Test user sign-up, login, and JWT validation.
- [x] **Task 4-6 (Movie Catalog)**: Filter by genres, toggle Now Showing / Upcoming, and search titles.
- [x] **Task 7-8 (Movie Details & Trailers)**: View movie info, cast, and watch trailer links.
- [x] **Task 9-11 (Cinema & Shows)**: Choose date and multiplex showtimes.
- [x] **Task 12-14 (Real-time Seat Reservation)**: Pick Silver, Gold, or VIP seats and verify real-time price updates.
- [x] **Task 15-16 (Checkout & Payment)**: Test simulated payment methods and conflict checks.
- [x] **Task 17 (Digital M-Ticket)**: Verify QR code generation, booking reference, and print preview.
- [x] **Task 18 (Cancellation & Seat Release)**: Cancel a booking from My Tickets and see seats restored to available.
- [x] **Task 19 (Admin Dashboard)**: View live revenue, add new movies, and publish show schedules.

