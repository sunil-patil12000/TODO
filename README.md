# TODO Application

A full-stack TODO application built with Node.js/Express backend and Next.js/React frontend.

## 🚀 Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Real-time task editing
- ✅ Modern UI with Tailwind CSS
- ✅ Responsive design
- ✅ MongoDB database integration

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development server with hot reload

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Radix UI** - UI components
- **Lucide React** - Icons

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **MongoDB Atlas Account** - Database (already configured)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd TODO
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

#### Environment Configuration
The backend is already configured to connect to MongoDB Atlas. The connection string is in `config/conn.js`.

#### Start the Backend Server

```bash
# Development mode with hot reload
npm run dev

# Or manually with node
node index.js
```

The backend server will start on `http://localhost:5000`

**Backend Endpoints:**
- `GET /` - Root endpoint (test page)
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

#### Start the Frontend Development Server

```bash
# Development mode with Turbopack (faster)
npm run dev

# Or standard development mode
npm run build && npm run start
```

The frontend application will start on `http://localhost:3000`

## 🏃‍♂️ Running the Application

### Method 1: Manual Startup (Recommended for Development)

1. **Start the Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
2. **Start the Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Method 2: Using PowerShell Script

Create a batch script to start both services:

1. Create `start-app.ps1` in the root directory:
   ```powershell
   # Start backend
   Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
   
   # Wait a moment for backend to start
   Start-Sleep -Seconds 3
   
   # Start frontend
   Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
   
   Write-Host "Starting TODO Application..."
   Write-Host "Backend: http://localhost:5000"
   Write-Host "Frontend: http://localhost:3000"
   ```

2. Run the script:
   ```bash
   .\start-app.ps1
   ```

## 🧪 Testing the Application

### Manual Testing Steps

1. **Verify Backend Connection**:
   - Visit http://localhost:5000
   - You should see "test of root" message
   - Visit http://localhost:5000/tasks to see all tasks (JSON format)

2. **Test Frontend Functionality**:
   - Visit http://localhost:3000
   - **Add Task**: Type in the input field and click "Add Task"
   - **Complete Task**: Click the checkbox to mark as complete/incomplete
   - **Edit Task**: Click the edit icon, modify text, and save
   - **Delete Task**: Click the delete icon to remove a task

3. **Test API Endpoints** (using curl or Postman):

   ```bash
   # Get all tasks
   curl http://localhost:5000/tasks
   
   # Create a new task
   curl -X POST http://localhost:5000/tasks -H "Content-Type: application/json" -d "{\"item\":\"Test task\"}"
   
   # Update a task (replace {id} with actual task ID)
   curl -X PUT http://localhost:5000/tasks/{id} -H "Content-Type: application/json" -d "{\"done\":true}"
   
   # Delete a task (replace {id} with actual task ID)
   curl -X DELETE http://localhost:5000/tasks/{id}
   ```

### Automated Testing

#### Backend Testing
```bash
cd backend
# Currently no tests are configured
# To add tests, install jest or mocha and create test files
npm test
```

#### Frontend Testing
```bash
cd frontend
# Run ESLint for code quality
npm run lint

# Build production version (tests build process)
npm run build
```

## 🗂️ Project Structure

```
TODO/
├── backend/
│   ├── config/
│   │   └── conn.js          # MongoDB connection
│   ├── models/
│   │   └── list.js          # Task model schema
│   ├── index.js             # Express server & API routes
│   └── package.json         # Backend dependencies
├── frontend/
│   ├── app/
│   │   ├── globals.css      # Global styles
│   │   ├── layout.js        # App layout
│   │   └── page.jsx         # Main TODO page
│   ├── lib/
│   │   └── utils.js         # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
└── README.md               # This file
```

## 🔧 API Documentation

### Task Model
```javascript
{
  _id: ObjectId,
  item: String,        // Task description
  done: Boolean,       // Completion status
  createdAt: Date,     // Auto-generated
  updatedAt: Date      // Auto-generated
}
```

### API Routes

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/tasks` | Get all tasks | - |
| POST | `/tasks` | Create new task | `{"item": "Task description"}` |
| PUT | `/tasks/:id` | Update task | `{"item": "New description", "done": true}` |
| DELETE | `/tasks/:id` | Delete task | - |

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Kill processes on ports
   netstat -ano | findstr :3000
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   ```

2. **MongoDB Connection Issues**:
   - Check internet connection
   - Verify MongoDB Atlas credentials in `backend/config/conn.js`

3. **CORS Issues**:
   - Ensure backend CORS is properly configured
   - Check frontend is calling `http://localhost:5000`

4. **Module Not Found**:
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

### Development Tips

- Backend runs on port 5000 with nodemon for auto-reload
- Frontend runs on port 3000 with Turbopack for faster builds
- Check browser console for frontend errors
- Check terminal output for backend errors
- MongoDB connection string includes credentials - keep secure

## 📝 Future Enhancements

- [ ] Add user authentication
- [ ] Add task categories/tags
- [ ] Add due dates and priorities
- [ ] Add search and filter functionality
- [ ] Add drag-and-drop reordering
- [ ] Add task sharing capabilities
- [ ] Add mobile app version
- [ ] Add automated testing suite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Sunil Patil**

---

**Happy Coding! 🎉**
