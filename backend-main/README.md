# HRM Backend

This is the backend service for the HRM (Human Resource Management) system. It provides endpoints for managing employees, HR tasks, and administrative operations with proper authentication and security.

## Project Structure

```
├── routes
│   ├── admin_api
│   │   ├── index.js
│   │   └── v1.js
│   ├── employee_api
│   │   ├── index.js
│   │   └── v1.js
│   ├── hr_api
│   │   ├── index.js
│   │   └── v1.js
├── config
│   ├── db.js
│   ├── validation
│   │   └── index.js
│   ├── constant.js
│   ├── nodemailer.config.js
│   └── responseHandler.config.js
├── controllers
│   ├── admin
│   │   └── v1
│   │       ├── index.js
│   │       └── authController.js
│   ├── employee
│   │   └── v1
│   │       ├── index.js
│   │       ├── attendanceController.js
│   │       ├── authController.js
│   │       ├── employeeController.js
│   │       └── forgotPassword.js
│   ├── hr
│   │   └── v1
│   │       ├── index.js
│   │       └── authController.js
├── middlewares
│   ├── authenticate.js
│   └── authorize.js
├── models
│   ├── attendance.model.js
│   ├── user.model.js
├── utils
│   ├── 
│   ├── 
│   └── 
├── .env
├── server.js
└── package.json
```

## Installation

1. **Clone the Repository**

```bash
git clone <repository-url>
cd backend
```

2. **Install Dependencies**

```bash
npm install
```

3. ****Follow `.env.example` to generate `.env`.****


4. **Database Setup**
   Ensure your MongoDB instance is running and accessible. Update `MONGO_URI` in `.env` accordingly.

5. **Run the Project In Development**

```bash
npm run dev
```

6. **Run the Project In Production**

```bash
npm start
```


## BASE API Endpoints

### Admin API

- `/api/v1/admin` 

### Employee API

- `/api/v1/employee`

### HR API

- `/api/v1/hr`

## Important Notes

- Ensure all `.env` variables are correctly set.
- Follow proper request format while testing endpoints using Postman or any API client.
- Routes are versioned (e.g., `/admin_api/v1`, `/employee_api/v1`) for better scalability.


