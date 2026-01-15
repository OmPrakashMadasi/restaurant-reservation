# Restaurant Reservation Management System

A full-stack web application that makes restaurant table booking simple and hassle-free. Built with the MERN stack, this system helps customers reserve tables online while giving restaurant admins complete control over all bookings.

## Why This Project?

Managing restaurant reservations manually is time-consuming and error-prone. This app solves that by:
- Letting customers book tables 24/7 without phone calls
- Preventing double bookings automatically
- Giving admins a clear view of all reservations
- Making the entire process smooth and user-friendly

## Features

### For Customers
- Quick registration and secure login
- Browse available tables by capacity
- Book tables for specific dates and time slots
- Add special requests or notes
- View all your upcoming reservations
- Cancel bookings anytime

### For Administrators  
- See all reservations in one dashboard
- Filter bookings by date
- View customer details and special requests
- Cancel or restore any reservation
- Get real-time stats (total, confirmed, cancelled)

### Smart System Features
- **No double bookings** - The system automatically blocks already-booked slots
- **Capacity checking** - Can't book more guests than a table can handle
- **Past date prevention** - Only future dates can be selected
- **Role-based access** - Customers and admins see different interfaces
- **Secure authentication** - JWT-based login with password encryption

## Tech Stack

**Frontend**
- React.js - UI framework
- Bootstrap 5 - Styling and components
- React Router - Page navigation
- Axios - API calls
- Context API - State management

**Backend**
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - Database
- Mongoose - Database modeling
- JWT - Authentication
- Bcrypt - Password hashing

## Getting Started

### Prerequisites
Make sure you have these installed:
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier works great)
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/restaurant-reservation.git
cd restaurant-reservation
