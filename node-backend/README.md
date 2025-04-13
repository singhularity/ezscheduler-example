# Scheduler Widget Node.js Example

This example demonstrates how to use the Scheduler Widget with a Node.js backend for persistent storage of schedules in the file system.

## Features

- Create, load, save, and delete schedules
- Persistent storage using Node.js file system
- RESTful API for schedule management
- Export and import schedules as JSON
- Modern, responsive UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository (if you haven't already)
2. Navigate to the example directory:
   ```
   cd examples/node-backend
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Running the Example

1. Start the server:
   ```
   npm start
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

The example includes a RESTful API with the following endpoints:

- `GET /api/schedules` - List all saved schedules
- `GET /api/schedules/:id` - Get a specific schedule
- `POST /api/schedules` - Save a schedule
- `DELETE /api/schedules/:id` - Delete a schedule

## Project Structure

```
node-backend/
├── data/               # Directory for stored schedules (created automatically)
├── public/             # Static files served by Express
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styles
│   ├── main.js         # Main JavaScript file
│   └── lib/            # Directory for the Scheduler Widget library
│       └── index.umd.js # UMD build of the Scheduler Widget
├── server/             # Server-side code
│   └── index.js        # Express server implementation
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## Notes

This example is for demonstration purposes only and is not intended for production use. In a real-world application, you would want to add:

- User authentication
- Input validation
- Error handling
- Database storage instead of file system
- HTTPS support
