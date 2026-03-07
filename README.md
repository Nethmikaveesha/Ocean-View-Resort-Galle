# Ocean View Resort Galle – Hotel Reservation & Management System

## Project Overview
The **Ocean View Resort Galle Reservation System** is a web-based application developed to manage hotel reservations and operations efficiently. The system allows customers to register, check room availability, and make reservations online. It also enables hotel staff such as receptionists, managers, and administrators to manage reservations, rooms, and customer information through dedicated dashboards. The system automatically calculates reservation costs and generates invoices for customers. By digitizing the reservation process, the system reduces manual work and improves accuracy. Overall, the system helps improve customer service and supports effective hotel management.

---

## Features



### 1. Customer
- Register and login securely to the system.
- Check room availability by selecting dates and room categories.
- Create, update, and cancel reservations.
- Automatically receive an invoice calculated based on room charges and number of nights.
- Download reservation invoice as a PDF.
- Access the help section for system guidance.

### 2. Receptionist
- Create reservations for walk-in customers.
- Check room availability based on customer requirements.
- View and cancel reservations when necessary.
- View room information and details.
- Access the help section through the dashboard.

### 3. Manager
- Create and cancel reservations on behalf of customers.
- Check room availability before reservations.
- View all registered customer records.
- Manage rooms by adding, updating, or deleting room information.
- View the list of registered customers.
- Access the help section.

### 4. Admin
- Manage system users (add, update, delete managers and receptionists).
- Create, view, and cancel reservations.
- Manage room records (add, update, delete).
- View all registered customers.
- Access the help section from the admin dashboard.

---

## Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Spring Boot
- REST API
- JWT Authentication
- iText (PDF bill generation)

### Database
- MongoDB

### Testing
- JUnit
- Selenium

---

## Prerequisites

Make sure the following software is installed:

- Java 17
- Node.js 18+
- MongoDB
- Maven

---

## Installation & Setup

### 1. Clone the Repository


```bash
git clone https://github.com/NethmiKaveesha/Ocean-View-Resort-Galle.git
```

### 2. Backend Setup

```
cd backend
mvn clean install
```

### 3. Frontend Setup

```
cd frontend
npm install
```

(Optional) Create a `.env` file for frontend configuration if needed.

---

## How to Run the Application

1. Start **MongoDB**

2. Start Backend

```
cd backend
mvn spring-boot:run
```

3. Start Frontend

```
cd frontend
npm run dev
```

The application will run at:

```
http://localhost:5173
```

---

## Project Structure

```
Ocean-View-Resort-Galle
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   └── config
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── services
│
│
└── README.md
```

---

## API Overview

Main API modules include:

- **Auth API**
  - Login
  - Register
  - JWT authentication

- **Reservations API**
  - Create reservation
  - View reservations
  - Cancel reservation

- **Rooms API**
  - List rooms
  - Check availability

- **Bills API**
  - Generate bills
  - Download bill PDF

- **Admin API**
  - Manage staff
  - Manage system users

- **Customer API**
  - Customer profile management

All secured APIs require **JWT authentication**.

---


## Configuration

### Backend

Configuration file:

```
backend/src/main/resources/application.properties
```

Contains database connection and JWT configuration.

### Frontend

Environment variables can be stored in:

```
frontend/.env
```

---

## User Roles

The system supports the following roles:

- Customer
- Receptionist
- Manager
- Admin

Each role has different permissions and system access.

---

## Contributing

1. Fork the repository
2. Create a new branch

```
git checkout -b feature-name
```

3. Commit changes

```
git commit -m "Add new feature"
```

4. Push to your branch

```
git push origin feature-name
```

5. Open a Pull Request

---

## License

This project currently uses a placeholder license.  
Add a `LICENSE` file if required.
