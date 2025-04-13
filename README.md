# Scheduler Widget Complete Example

This example demonstrates a complete implementation of the Scheduler Widget with:
- A Node.js backend for storing and managing schedules
- A React frontend for a modern user interface

## Project Structure

- `node-backend/` - Express.js server that handles schedule data storage
- `react-frontend/` - React application that provides a user-friendly interface

## Integration Approach

This example demonstrates how to use the Scheduler Widget as a local npm package. The setup script will:

1. Build the Scheduler Widget package from the source code
2. Install it as a dependency in the React frontend
3. Set up the Node.js backend to serve the API endpoints

## Quick Setup

For convenience, we've provided a setup script that will install all dependencies for both the backend and frontend:

```bash
# Run the setup script from the complete-example directory
./setup.sh
```

## Manual Setup Instructions

### 1. Install Dependencies

First, install the dependencies for both the backend and frontend:

```bash
# Install backend dependencies
cd node-backend
npm install

# Install frontend dependencies
cd ../react-frontend
npm install
```

### 2. Start the Backend Server

```bash
cd node-backend
npm start
```

This will start the Node.js server on http://localhost:3000.

### 3. Start the React Frontend

In a new terminal:

```bash
cd react-frontend
npm start
```

This will start the React development server on http://localhost:3001, which will automatically proxy API requests to the backend.

## Using the Application

1. Open your browser to http://localhost:3001
2. Create a new schedule by clicking the "Create New Schedule" button
3. Add time slots by clicking on the calendar
4. Save your schedule using the "Save Schedule" button
5. Load, edit, or delete existing schedules from the schedule list

## Features

- Create, load, save, and delete schedules
- Switch between weekly and monthly views
- Import and export schedules as JSON
- Modern, responsive UI with React
- Persistent storage with Node.js backend
- Material UI integration for a polished look and feel

## Scheduler Widget Enhancements

The scheduler widget used in this example includes the following enhancements:

1. Continuous time slots are visually merged into single blocks
2. Different blocks use gradient variations of the primary color
3. Deleting any slot in a continuous group deletes the entire group
4. Intuitive time slot selection with mouse interactions
5. Support for multi-date selection

## API Endpoints

The backend provides the following RESTful API endpoints:

- `GET /api/schedules` - Get a list of all schedules
- `GET /api/schedules/:id` - Get a specific schedule by ID
- `POST /api/schedules` - Create a new schedule
- `PUT /api/schedules/:id` - Update an existing schedule
- `DELETE /api/schedules/:id` - Delete a schedule

## Development

This example is set up for development with hot-reloading enabled for both the frontend and backend. The React frontend is configured to proxy API requests to the Node.js backend, so you don't need to worry about CORS issues during development.
