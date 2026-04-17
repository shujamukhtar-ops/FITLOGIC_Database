# FitLogic Setup Guide

## Requirements
- **Node.js** (v18 or higher)
- **PostgreSQL** (Running locally on default port `5432` or via socket)

## 1. Database Setup
First, start PostgreSQL on your machine, then run these commands sequentially to initialize and seed the database:

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE fitlogic;"

# Build the schema (Tables, Views, Generated Columns)
psql -U postgres -d fitlogic -f database_schema.sql

# Seed the database with the default Exercises
psql -U postgres -d fitlogic -f seed_exercises.sql
```

## 2. Backend Setup
Install the backend dependencies and start the Express server.

```bash
# Install node modules
npm install

# Start the backend server (Runs on port 3000)
npx tsx server.ts
```

## 3. Frontend Setup
In a new terminal window, navigate to the frontend directory, install dependencies, and run the Vite UI.

```bash
# Enter the application folder
cd src/fit2-main

# Install frontend dependencies
npm install

# Start the frontend dev server (Runs on port 5173)
npm run dev
```

You can now access the app at `http://localhost:5173`.
