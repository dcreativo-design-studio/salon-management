# Hair Salon Management System

A full-stack web application for hair salons to manage their services, staff, and appointments. This application allows clients to book appointments online, while providing salon administrators and staff with tools to manage schedules, services, and client relationships.

## Features

### Client Features
- User registration and authentication
- Service browsing and filtering
- Online appointment booking
- View and manage appointment history
- Profile management

### Staff Features
- Manage personal schedule and availability
- View upcoming appointments
- Track appointment history
- Request time off/vacation

### Admin Features
- Manage services (add, edit, delete)
- Manage staff profiles and schedules
- View comprehensive appointment calendar
- Access client database
- Generate reports and analytics

## Tech Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Formik & Yup for form handling and validation
- Tailwind CSS for styling
- Axios for API requests
- JWT for authentication
- React Icons for icons
- React-Toastify for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose for database
- JWT for authentication
- Nodemailer for email notifications
- Multer for file uploads
- Express Validator for validation

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- NPM or Yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd salon-management
```

### Step 2: Set Up the Backend

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables (customize as needed):
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/hair-salon

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
FROM_EMAIL=your_email@example.com
FROM_NAME=Your Hair Salon

UPLOAD_PATH=./public/uploads
```

4. Create the required directories:
```bash
mkdir -p public/uploads/services public/uploads/staff
```

5. Start the server:
```bash
npm run dev
```

The server should now be running on http://localhost:5000.

### Step 3: Set Up the Frontend

1. Open a new terminal window and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The client application should now be running on http://localhost:5173.

## Project Structure

```
salon-management/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── styles/
│   │   ├── components/
│   │   │   ├── UI/
│   │   │   ├── Layout/
│   │   │   ├── Admin/
│   │   │   ├── Staff/
│   │   │   ├── Client/
│   │   │   ├── common/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── public/
│   │   ├── uploads/
│   │   │   ├── services/
│   │   │   ├── staff/
│   ├── .env
││   ├── package.json
│   ├── server.js
├── .gitignore
├── README.md
```

## Database Models

### User
- Basic user details (name, email, phone, etc.)
- Authentication details (password, role)
- Profile image

### Service
- Service details (name, description, price, duration)
- Category
- Image

### Staff
- Links to User model
- Professional details (title, bio, specialties)
- Available services
- Experience and ratings

### Appointment
- Client (User reference)
- Staff (Staff reference)
- Service (Service reference)
- Date and time
- Status (pending, confirmed, cancelled, completed, no-show)
- Notes

### Schedule
- Staff reference
- Working days and hours
- Breaks
- Effective dates

### Vacation
- Staff reference
- Start and end dates
- Status (pending, approved, rejected)
- Reason

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Update password
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:resettoken` - Reset password
- `POST /api/auth/staff` - Register a new staff member (admin only)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create new service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)
- `GET /api/services/categories` - Get all service categories
- `PUT /api/services/:id/image` - Upload service image (admin only)

### Staff
- `GET /api/staff` - Get all staff members
- `GET /api/staff/:id` - Get single staff member
- `GET /api/staff/user/:userId` - Get staff by user ID
- `PUT /api/staff/:id` - Update staff member (admin only)
- `PUT /api/staff/profile` - Update own staff profile (staff only)
- `GET /api/staff/:id/schedules` - Get staff schedules
- `PUT /api/staff/:id/schedules/:dayOfWeek` - Update schedule
- `GET /api/staff/:id/vacations` - Get staff vacations
- `POST /api/staff/:id/vacations` - Request vacation
- `PUT /api/staff/vacations/:id` - Update vacation status (admin only)
- `DELETE /api/staff/vacations/:id` - Cancel vacation request
- `PUT /api/staff/:id/image` - Upload staff image
- `GET /api/staff/specialties` - Get all staff specialties

### Appointments
- `GET /api/appointments` - Get all appointments (admin only)
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment (admin only)
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments/me` - Get logged in user's appointments
- `GET /api/appointments/staff/:staffId` - Get staff appointments
- `PUT /api/appointments/:id/complete` - Mark appointment as completed
- `PUT /api/appointments/:id/no-show` - Mark appointment as no-show
- `GET /api/appointments/available-slots` - Get available time slots
- `GET /api/appointments/stats` - Get appointment statistics (admin only)
- `POST /api/appointments/send-reminders` - Send appointment reminders (admin only)

## Deployment

### Backend Deployment
1. Set up a MongoDB Atlas database
2. Configure environment variables for production
3. Deploy to a service like Heroku, Render, or DigitalOcean

### Frontend Deployment
1. Build the React application:
```bash
cd client
npm run build
```
2. Deploy the built files to Vercel, Netlify, or any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)
