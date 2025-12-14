
# Seatify

Seatify is a full-stack web application for event organizers and attendees to manage, book, and visualize seat reservations for events such as conferences, concerts, and seminars.

## Features

- **User Authentication**: Secure sign-up, login, and password reset using JWT and bcrypt.
- **Event Management**: Create, view, and manage events with customizable seating layouts.
- **Seat Booking**: Real-time seat selection and booking with visual layouts.
- **QR Code Integration**: Generate and scan QR codes for event access and seat verification.
- **Attendee Management**: View and manage event participants, generate attendee reports.
- **Responsive UI**: Modern, user-friendly React interface.

## Architecture

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** for data modeling
- **Authentication**: JWT tokens, bcrypt password hashing
- **File Uploads**: Multer and Sharp for image processing
- **Scheduled Tasks**: node-cron for automated jobs
- **Validation**: express-validator for input validation
- **Error Handling**: Centralized error middleware

### Frontend
- **React** (SPA) with React Router
- **Axios** for API communication
- **Component-based**: Modals for sign-in, sign-up, event creation, seat selection, etc.
- **QR Code Display**: qrcode.react for rendering QR codes

## Folder Structure

- `backend/` — Node.js/Express API, models, controllers, routes, and utilities
- `frontend/seatify-react/` — React app source code, components, pages, and styles

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)

### Backend
1. Navigate to `backend/`
2. Install dependencies:
	```bash
	npm install
	```
3. Configure environment variables in `config.env` (see sample below):
	```env
	PORT=5050
	DB=mongodb+srv://<username>:<PASSWORD>@cluster.mongodb.net/seatify
	DB_PASSWORD=yourpassword
	JWT_SECRET=your_jwt_secret
	JWT_EXPIRES_IN=90d
	```
4. Start the server:
	```bash
	npm run dev
	```

### Frontend
1. Navigate to `frontend/seatify-react/`
2. Install dependencies:
	```bash
	npm install
	```
3. Start the React app:
	```bash
	npm start
	```

## API Overview

- **Auth**: `/api/auth/signup`, `/api/auth/login`, `/api/auth/reset-password`
- **Events**: `/api/events` (CRUD), `/api/events/:id`
- **Seats**: `/api/events/:eventId/seats` (booking, layout)
- **Users**: `/api/users/me`, `/api/users/:id`

## Communication

- The frontend communicates with the backend via RESTful APIs using Axios.
- JWT tokens are sent in the `Authorization` header for protected routes.
- CORS is enabled for cross-origin requests.

## Error Handling & Security

- Centralized error handler for API responses
- Input validation and sanitization on all endpoints
- Passwords are hashed before storage
- Sensitive data is managed via environment variables
- Scheduled jobs for event-related automation

## Testing

- (Recommended) Use Jest and Supertest for backend API and DB operation tests
- Example test cases: user registration, login, event creation, seat booking, etc.

## License

ISC License. See LICENSE file for details.

---
For more details, see the documentation files and explore the codebase.
