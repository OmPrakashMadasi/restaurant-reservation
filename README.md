# Restaurant Reservation Management System

A simple, full-stack web app that lets customers book tables online and helps restaurant admins manage all reservations in one place.

Built with the MERN stack and designed to be easy to understand, maintain, and extend.

## What This App Does

### For Customers
- Create an account and log in
- See available tables with capacities
- Book a table for a specific date and time slot
- Add special notes (e.g. “candle light dinner”)
- View all your reservations
- Cancel your own reservations

### For Admins
- Log in to an admin dashboard
- View all reservations in a single table
- Filter reservations by date
- Cancel or restore any reservation
- See basic stats (total, confirmed, cancelled)
- Manage restaurant tables:
  - View all tables
  - Create new tables
  - Edit table name and capacity
  - Enable/disable tables
  - Delete tables (only if there are no active reservations)

### System Logic
- Prevents double booking of the same table for the same date and time
- Checks that table capacity is enough for the number of guests
- Disallows booking in the past
- Uses role-based access (customer vs admin)
- Secures passwords with hashing and uses JWT for authentication

***

## Tech Stack

**Frontend**
- React (with JSX)
- React Router
- Bootstrap 5 + Bootstrap Icons
- Axios
- React Toastify

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- Bcrypt

***

## Getting Started

### 1. Clone the project

```bash
git clone <your-repo-url>
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

> Use a real MongoDB Atlas connection string and a long random JWT secret.

Run the backend:

```bash
npm start
```

You should see logs like:

- MongoDB connected  
- Server running on port 5000

Health check (optional): open  
`http://localhost:5000/api/health`

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The app should open at:  
`http://localhost:3000`

***

## How to Use

### As a Customer

1. Go to the landing page (`/`).
2. Click **Get Started** and register a new account.
3. Log in.
4. Go to your dashboard:
   - Click **New Reservation**
   - Choose a date, time slot, number of guests, and table
   - Confirm the booking
5. See all your bookings in the table.
6. Cancel any reservation from your dashboard.

### As an Admin

1. Log in using the admin credentials (for example: `admin@test.com` / `123456`).
2. Open the **Admin Dashboard**.
3. Use the **Reservations** tab to:
   - See all reservations
   - Filter by date
   - Cancel or restore bookings
4. Use the **Tables** tab to:
   - View all tables
   - Add new tables
   - Edit table name or capacity
   - Enable/disable tables
   - Delete tables that have no active reservations
### (Note: Change the role of an user to admin to get access to admin pages in user model)

***

## API Overview (Short)

All API routes are prefixed with `/api`.

### Auth
- `POST /api/auth/register` – register a new user
- `POST /api/auth/login` – login and get a JWT
- `GET /api/auth/profile` – get current user info (requires token)

### Customer reservations
- `GET /api/reservations/my` – get current user’s reservations
- `POST /api/reservations` – create a reservation
- `DELETE /api/reservations/:id` – cancel own reservation
- `GET /api/reservations/tables` – get list of available tables for customers

### Admin
- `GET /api/admin/reservations` – get all reservations (optional `?date=YYYY-MM-DD`)
- `DELETE /api/admin/reservations/:id` – cancel any reservation
- `PATCH /api/admin/reservations/:id` – update reservation (e.g. status)
- `GET /api/admin/tables` – get all tables
- `POST /api/admin/tables` – create a new table
- `PATCH /api/admin/tables/:id` – update table
- `DELETE /api/admin/tables/:id` – delete table (if no active reservations)

***

## Data Models (Simplified)

### User
- `name`
- `email`
- `password` (hashed)
- `role` (`customer` or `admin`)

### Table
- `name`
- `capacity`
- `restaurantId` (e.g. `"main-restaurant"`)
- `isAvailable` (true/false)

### Reservation
- `user` (reference to User)
- `table` (reference to Table)
- `date`
- `timeSlot` (e.g. `"19:00"`)
- `guests`
- `status` (`confirmed` or `cancelled`)
- `notes` (optional)

***

## Notes for Reviewers

- The project focuses on:
  - Clean, readable code
  - Clear separation between customer and admin views
  - Correct business logic (no double booking, capacity checks)
  - Simple but functional UI using Bootstrap
- Styling is done with Bootstrap, Bootstrap Icons, and a small custom CSS file.
- Error and success messages are shown using toast notifications for a better user experience.

***

## Possible Future Improvements

If extended further, this project could include:

- Email or SMS notifications on booking
- Support for multiple restaurants/branches
- Floor plan view of tables
- Payment integration for deposits
- Export reservations as CSV
- Advanced reporting for admins