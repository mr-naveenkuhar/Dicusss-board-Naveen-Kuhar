# Dialog-X-Nexus

## Overview
Dialog-X-Nexus is a modern SQL Dashboard application designed for managing and visualizing MySQL databases. It provides an intuitive interface for executing SQL queries, managing posts and comments, and exploring database schemas.

## Features
- **SQL Query Execution**: Run SQL queries and view results in real-time.
- **Database Schema Visualization**: Explore table structures, indexes, and relationships.
- **Post Management**: Create, read, update, and delete posts and comments.
- **User Authentication**: Secure login and registration system.
- **Responsive Design**: Optimized for all devices.

## Technologies Used
- **Frontend**: Vite, React, TypeScript, Tailwind CSS, shadcn-ui
- **Backend**: Express.js, MySQL
- **Other Tools**: Lucide Icons, Radix UI, Recharts

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MySQL Server running

### Steps
1. **Clone the Repository**:
   ```bash
   git clone <YOUR_GIT_URL>
   cd dialog-x-nexus
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup MySQL Database**:
   - Run the SQL script to create the database and tables:
     ```bash
     mysql -u root -p < backend/init-db.sql
     ```
   - Configure the `.env` file in the `backend` directory:
     ```env
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=demo_db
     ```

4. **Start the Backend Server**:
   ```bash
   cd backend
   npm start
   ```

5. **Start the Frontend**:
   ```bash
   npm run dev
   ```

## Usage
- Access the application at `http://localhost:8080`.
- Use the SQL editor to execute queries.
- Manage posts and comments via the dashboard.

## API Documentation
### Endpoints
- `GET /api/test-connection`: Test database connection.
- `POST /api/execute-query`: Execute SQL queries.
- `GET /api/schema`: Retrieve database schema information.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push to your fork.
4. Submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
