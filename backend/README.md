
# SQL Dashboard Backend

This is a simple Express.js backend that connects to a MySQL database and provides API endpoints for the SQL Dashboard frontend.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` and configure your MySQL connection:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   ```

3. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

- `GET /api/test-connection` - Test database connection
- `POST /api/execute-query` - Execute SQL query
- `GET /api/schema` - Get database schema information

## Security Notes

For safety reasons, certain SQL operations (DROP, DELETE, TRUNCATE, ALTER, UPDATE) are disabled in this demo.
