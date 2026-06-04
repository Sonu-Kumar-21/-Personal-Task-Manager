# Personal Task Manager

This project is a full-stack web application built for the **Exercise 1: Personal Task Manager** assignment. It allows users to create, view, update, prioritize, categorize, and delete personal tasks. The app features a premium glassmorphic UI, dynamic sorting, and drag-and-drop reordering, all backed by a robust REST API and automated testing.

## Live Demo Links

- **Frontend Deployment**: [Insert Vercel/Netlify Link Here]
- **Backend Deployment**: [Insert Render/Railway Link Here]

*(Note to reviewer: If deployed links are missing, please rely on the local setup instructions below).*

---

## Tech Stack

### Frontend
- **React (via Vite)**: Chosen for its fast development server and modern functional component paradigm.
- **Vanilla CSS**: Used to demonstrate strong foundational styling skills (Glassmorphism, gradients, micro-animations) without relying on Tailwind or component libraries.
- **Lucide-React**: Used for crisp, modern iconography.
- **@dnd-kit/core**: Chosen for its robust, accessible, and highly customizable drag-and-drop functionality.
- **Vitest & React Testing Library**: Chosen for their modern, lightning-fast component testing capabilities to ensure UI reliability.

### Backend
- **Node.js & Express**: Chosen for its lightweight, unopinionated approach to building RESTful APIs.
- **fs.promises (Local JSON)**: Used `tasks.json` as the database to satisfy the local persistence requirement without forcing the reviewer to configure PostgreSQL or MongoDB.
- **cors**: Required to allow the frontend and backend to communicate across different local ports.

---

## How to Run Locally

*Prerequisites: Ensure you have Node.js installed.*

You will need two terminal windows to run both the frontend and backend locally.

### 1. Start the Backend API
In your first terminal window, navigate to the backend folder, install dependencies, and start the server:
```bash
cd backend
npm install
npm start
```
*The backend server will run on `http://localhost:5000`.*

### 2. Start the Frontend Application
In your second terminal window, navigate to the frontend folder, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser to view the app.*

### 3. Run Automated Tests (Optional)
To verify the React component tests:
```bash
cd frontend
npm run test
```

---

## API Documentation

The backend exposes a RESTful API at `http://localhost:5000/api/tasks`.

### 1. Get All Tasks
- **Method**: `GET`
- **Path**: `/` (or `/?search=keyword`)
- **Response Shape**:
  ```json
  [
    {
      "id": "1689234812",
      "title": "Buy Groceries",
      "description": "Milk, Eggs, Bread",
      "dueDate": "2023-12-01",
      "priority": "High",
      "category": "Shopping",
      "completed": false,
      "createdAt": "2023-11-20T10:00:00.000Z"
    }
  ]
  ```

### 2. Create a Task
- **Method**: `POST`
- **Path**: `/`
- **Request Body**:
  ```json
  {
    "title": "Buy Groceries",
    "description": "Milk, Eggs",
    "dueDate": "2023-12-01",
    "priority": "High",
    "category": "Shopping"
  }
  ```
- **Response Shape**: Returns the created task object (same shape as above).

### 3. Update a Task
- **Method**: `PUT`
- **Path**: `/:id`
- **Request Body**: (Send only the fields you wish to update)
  ```json
  {
    "completed": true
  }
  ```
- **Response Shape**: Returns the updated task object.

### 4. Delete a Task
- **Method**: `DELETE`
- **Path**: `/:id`
- **Response Shape**: `204 No Content` (Empty body).

---

## Project Structure

```text
Personal Task Manager/
│
├── backend/                  # Node.js Express API
│   ├── data/                 
│   │   ├── store.js          # File reading/writing utilities
│   │   └── tasks.json        # The local JSON database
│   ├── routes/
│   │   └── tasks.js          # Express router & validation logic
│   ├── package.json
│   └── server.js             # API entry point & CORS configuration
│
└── frontend/                 # React Vite Application
    ├── src/
    │   ├── components/       # Reusable React components (TaskItem, TaskForm, etc.)
    │   ├── hooks/            
    │   │   └── useTasks.js   # Custom hook abstracting API calls & state
    │   ├── test/             # Vitest setup files
    │   ├── App.jsx           # Main application view and layout
    │   ├── index.css         # Core design system and global styles
    │   └── main.jsx          # React DOM mounting
    ├── vite.config.js        # Vite & Vitest configuration
    └── package.json
```

---

## Next Steps

While this project is feature-complete for the assignment, there are a few things I chose not to do, and a few things I would build next if I had more time:

### What I Chose Not to Do
- **Real Database Integration**: I chose to use a local `tasks.json` file instead of PostgreSQL or MongoDB. This ensures the app is incredibly easy for reviewers to clone and run immediately without needing to set up a database instance or environment variables.
- **Drag-and-Drop Backend Sync**: Users can reorder tasks visually on the frontend using drag-and-drop, but this custom order isn't saved to the backend database. Refreshing resets the drag-and-drop order. I chose to focus my time on Custom Hooks, Component Testing, and Accessibility instead.

### What I Would Build Next
1. **User Authentication**: Implement JWT-based auth (e.g., using Auth0 or Passport) so multiple users can register and securely manage their own private task lists.
2. **Database Migration**: Migrate from the local JSON file to PostgreSQL using Prisma ORM for scalable data management and robust querying.
3. **Global State & Caching**: As the app scales, I would introduce React Query to handle aggressive client-side caching, background fetching, and pagination to optimize performance.
