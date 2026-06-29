# Vehicle Service Booking System

## Overview

The Vehicle Service Booking System is a responsive frontend web application developed to simplify the process of booking and managing vehicle service appointments. The system provides separate interfaces for customers and support staff, enabling customers to book services online while allowing support executives to manage bookings efficiently.

The project is developed using HTML5, CSS3, Bootstrap 5, JavaScript,JQuery, SweetAlert2, and JSON Server. JSON Server is used as a mock REST API to perform CRUD operations without requiring a backend framework.

---

## Objectives

- Provide an easy-to-use platform for customers to book vehicle services.
- Allow support staff to manage customer bookings efficiently.
- Demonstrate frontend development concepts using JavaScript.
- Perform CRUD operations using REST APIs.
- Implement authentication using Local Storage.
- Build a responsive and modern user interface.

---

## Technologies Used

Technology 
HTML5 
CSS3 
Bootstrap 5 
JavaScript (ES6+)
JQuery 
SweetAlert2 
JSON Server 
Local Storage 

---

## Project Features

### Landing Page

- Attractive homepage
- Navigation to Login and Registration
- Responsive design
- Theme support

---

### Registration Module

- Customer registration
- Form validation
- Password validation
- Email uniqueness check
- Phone number validation
- Address validation
- User data stored in JSON Server

---

### Login Module

- Customer Login
- Support Login
- Role-based authentication
- Local Storage session management
- Redirect based on user role
- Invalid login handling

---

## Customer Dashboard

The customer dashboard allows registered users to manage their service bookings.

### Features

- Welcome message
- Dashboard statistics
- Theme toggle
- Logout
- Book Service
- Edit Booking
- Delete Booking
- View Active Bookings
- View Booking History
- Search bookings
- Sort bookings
- Responsive booking cards
- Booking Details Modal
- View rejection reason
- View suggested service date
- View suggested service time

---

## Support Dashboard

The support dashboard enables service executives to manage all customer bookings.

### Features

- Dashboard statistics
- Sidebar navigation
- Active Bookings
- Booking History
- Search bookings
- Filter by booking date
- Filter by booking status
- Responsive booking cards
- Booking details modal
- Accept bookings
- Reject bookings
- Provide rejection reason
- Suggest alternative booking date
- Suggest alternative booking time
- Mark accepted bookings as completed
- Pagination
- Theme toggle
- Logout

---

## Booking Status

 Status - Description 
 Pending - Booking submitted by customer and waiting for review 
 Accepted - Booking accepted by support staff 
 Rejected - Booking rejected with a reason and suggested reschedule 
 Completed  Vehicle service completed successfully 

---

## Project Structure

```
Vehicle-Service-Booking-System
│
│
├── pages
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── customer_dashboard.html
│   └── service_dashboard.html
│
├── scripts
│   ├── index.js
│   ├── login.js
│   ├── register.js
│   ├── customer_dashboard.js
│   └── service_dashboard.js
│
├── styles
│   ├── index.css
│   ├── login.css
│   ├── register.css
│   ├── customer_dashboard.css
│   └── service_dashboard.css
│
├── assets
│   ├── img_dark.png
│   ├── img_light.png
│   ├── logo.png
│
├── db.json
│
└── README.md
```

---

## Database Structure

### Users Collection

```json
{
  "id": "",
  "name": "",
  "email": "",
  "phone": "",
  "address": "",
  "password": "",
  "role": ""
}
```

### Bookings Collection

```json
{
  "id": "",
  "userId": "",
  "customerName": "",
  "service": "",
  "vehicleNumber": "",
  "vehicleType": "",
  "bookingDate": "",
  "amount": "",
  "status": "",
  "rejectReason": "",
  "suggestedDate": "",
  "suggestedTime": ""
}

---

## Authentication

The application supports role-based authentication.

### Customer

- Register
- Login
- Book services
- Manage personal bookings
- Track booking status

### Support

- Login
- View all customer bookings
- Manage booking requests
- Update booking status

Authentication is maintained using the browser's Local Storage.

---

## Responsive Design

The application is fully responsive and optimized for different screen sizes.

- Desktop
- Laptop
- Tablet
- Mobile

Bootstrap 5 Grid System and utility classes are used throughout the project.

---

## Form Validations

### Registration

- Name validation
- Email validation
- Phone number validation
- Address validation
- Password strength validation
- Confirm password validation

### Login

- Required field validation
- Invalid credential handling

### Booking

- Service selection
- Vehicle number validation
- Vehicle type validation
- Booking date validation

### Reject Booking

- Reject reason required
- Suggested date required
- Suggested time required

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/danu857/Vehicle_Booking_System.git
```

### 2. Navigate to the project directory

```bash
cd vehicle-service-booking-system
```

### 3. Install JSON Server

```bash
npm install -g json-server
```

### 4. Start the JSON Server

```bash
json-server --watch db.json
```

The server will run at:

```
http://localhost:3000
```

### 5. Run the Project

Open the project using Visual Studio Code and launch `index.html` using the Live Server extension or any local web server.

---
##Screenshot
![Home Page](/assets/Screenshot/Home_Page.png)

## Future Enhancements

- Admin Dashboard
- Email Notifications
- SMS Notifications
- Online Payment Integration
- Service Slot Availability
- Vehicle Service History
- Invoice Generation
- Customer Reviews and Ratings
- Real Backend Integration
- JWT Authentication
- Profile Management
- Service Reminders

---

## Learning Outcomes

This project demonstrates practical implementation of:

- CRUD Operations using REST APIs
- Fetch API with Async/Await
- ES6 JavaScript Concepts
- DOM Manipulation
- Event Handling
- Form Validation
- Local Storage Authentication
- Responsive Web Design
- Modular JavaScript Development
- Bootstrap Components
- API Integration using JSON Server

---

## Author

**Danusree K S**

