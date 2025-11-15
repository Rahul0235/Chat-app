# QuickChat - Real-time Chat Application

A modern, real-time chat application built with React, Node.js, Socket.IO, and MongoDB.

## Features

- ✅ User Authentication (Login/Signup)
- ✅ Real-time messaging with Socket.IO
- ✅ Image sharing in chats
- ✅ Online/Offline user status
- ✅ Profile management
- ✅ Responsive design
- ✅ Message seen status
- ✅ User search functionality

## Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Socket.IO Client
- React Router DOM
- React Hot Toast
- Axios

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image uploads)
- bcryptjs (Password hashing)

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Chat-app
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Setup**

Create `.env` files:

**Server (.env)**
```env
MONGODB_URI=mongodb+srv://patelrahul0235:rahul17@cluster0.kum6ysu.mongodb.net/
PORT=5000
JWT_SECRET=gs#secret

CLOUDINARY_CLOUD_NAME=drsarbv84
CLOUDINARY_API_KEY=611733113112283
CLOUDINARY_API_SECRET=flXG7xmSh6i9YC87IYNA6GZAodo
```

**Client (.env)**
```env
VITE_BACKEND_URL=http://localhost:5000
```

4. **Start the application**

**Option 1: Use the startup script (Windows)**
```bash
# From the root directory
start.bat
```

**Option 2: Manual start**
```bash
# Terminal 1 - Start server
cd server
npm start

# Terminal 2 - Start client
cd client
npm run dev
```

## Usage

1. **Register/Login**: Create a new account or login with existing credentials
2. **Chat**: Select a user from the sidebar to start chatting
3. **Send Images**: Click the gallery icon to share images
4. **Profile**: Update your profile picture and bio from the profile page
5. **Real-time**: Messages appear instantly with Socket.IO

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/check` - Check authentication
- `PUT /api/auth/update-profile` - Update user profile

### Messages
- `GET /api/messages/users` - Get all users for sidebar
- `GET /api/messages/:id` - Get messages with specific user
- `POST /api/messages/send/:id` - Send message to user
- `PUT /api/messages/mark/:id` - Mark message as seen

## Project Structure

```
Chat-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── assets/         # Images and assets
│   │   ├── lib/            # Utility functions
│   │   └── context/        # React context
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── lib/                # Utility functions
│   └── package.json
└── README.md
```

## Troubleshooting

### Common Issues

1. **Port already in use**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

2. **MongoDB connection issues**
- Check your MongoDB URI
- Ensure your IP is whitelisted in MongoDB Atlas

3. **Cloudinary upload issues**
- Verify your Cloudinary credentials
- Check image size limits

### Development Tips

- Use `npm run server` in server directory for nodemon auto-restart
- Client runs on `http://localhost:5173`
- Server runs on `http://localhost:5000`
- Check browser console for client-side errors
- Check terminal for server-side errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.