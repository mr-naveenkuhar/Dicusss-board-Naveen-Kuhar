
# Setting up the MySQL Database

This guide will help you set up the MySQL database for the SQL Dashboard application.

## Prerequisites

- MySQL Server installed and running
- Access to a MySQL client (command line or GUI like MySQL Workbench)

## Setup Instructions

1. **Create the database and tables**

   Run the SQL script in `init-db.sql` to create the database and tables with sample data:

   ```bash
   mysql -u root -p < init-db.sql
   ```

   Or, you can copy and paste the contents of `init-db.sql` into your MySQL client.

2. **Configure environment variables**

   Create a `.env` file in the backend directory with your MySQL connection details:

   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=demo_db
   ```

   Replace `your_password` with your actual MySQL password.

3. **Start the backend server**

   ```bash
   npm install
   npm start
   ```

## Database Structure

The script creates the following tables:

- **users**: User accounts with roles
- **posts**: Content posts linked to users
- **comments**: Comments on posts
- **categories**: Content categories

## Sample Data

The script inserts sample data into each table so you can start testing queries right away.

## Troubleshooting

If you encounter any issues:

1. Make sure MySQL is running
2. Check that the user credentials in your `.env` file are correct
3. Verify that the database `demo_db` exists
4. Check MySQL error logs if queries are failing
