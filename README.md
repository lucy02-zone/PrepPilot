# PrepPilot - Smart Exam Hub 📚

A modern, glass-morphic study platform built with Django REST Framework and React. PrepPilot helps students organize their notes, take quizzes, plan their studies, and engage with a community forum!!!

## ✨ Features

- 📝 **Notes Management**: Create, organize, and share study notes with file uploads
- 🧠 **Quiz System**: Interactive quizzes with instant feedback
- 📅 **Study Planner**: Plan and track your study sessions
- 💬 **Forum**: Discuss topics with other students
- 🔐 **Authentication**: Secure user registration and login
- 🎨 **Glass Morphism UI**: Beautiful, modern interface inspired by macOS/iOS design
- 📱 **Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Python 3.8+** ([Download](https://python.org/downloads/))
- **Node.js 14+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)

### Automatic Setup (Recommended)

#### For macOS/Linux/Unix:
```bash
# Clone the repository
git clone https://github.com/lucy02-zone/PrepPilot.git
cd PrepPilot

# Make setup script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

#### For Windows:
```cmd
# Clone the repository
git clone https://github.com/lucy02-zone/PrepPilot.git
cd PrepPilot

# Run setup script
setup.bat
```

### Manual Setup

If you prefer to set up manually:

#### 1. Backend Setup (Django)
```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
cd smart_exam_hub
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

cd ..
```

#### 2. Frontend Setup (React)
```bash
cd smart-frontend
npm install
cd ..
```

## 🎯 Running the Application

### Using Quick Start Scripts

#### For macOS/Linux/Unix:
```bash
chmod +x start.sh
./start.sh
```

#### For Windows:
```cmd
start.bat
```

### Manual Start

#### 1. Start Backend Server
```bash
cd smart_exam_hub
../.venv/bin/python manage.py runserver
# On Windows: ..\.venv\Scripts\python manage.py runserver
```

#### 2. Start Frontend Server (in a new terminal)
```bash
cd smart-frontend
npm start
```

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 📂 Project Structure

```
PrepPilot/
├── smart_exam_hub/          # Django backend
│   ├── auth/                # Authentication app
│   ├── notes/               # Notes management
│   ├── quizzes/            # Quiz system
│   ├── planner/            # Study planner
│   ├── forum/              # Discussion forum
│   └── smart_exam_hub/     # Main Django settings
├── smart-frontend/          # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api/           # API service layer
│   │   ├── types/         # TypeScript type definitions
│   │   └── theme/         # UI theme and styling
│   └── public/
├── setup.sh               # Unix setup script
├── setup.bat              # Windows setup script
├── start.sh               # Unix start script
├── start.bat              # Windows start script
└── requirements.txt       # Python dependencies
```

## 🎨 UI Design

The application features a modern glass-morphic design inspired by macOS and iOS, with:
- Translucent backgrounds with blur effects
- Smooth animations and transitions
- Responsive grid layouts
- Modern Material-UI components
- Beautiful glass cards and panels

## 🔧 Development

### Backend Development
The backend is built with Django REST Framework and includes:
- JWT authentication
- RESTful API endpoints
- File upload handling
- Database models for notes, quizzes, etc.

### Frontend Development
The frontend uses React with TypeScript and includes:
- Modern hooks-based components
- Material-UI for consistent design
- Axios for API communication
- Context for state management

## 📝 API Endpoints

- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/notes/` - Get all notes
- `POST /api/notes/` - Create new note
- `GET /api/quizzes/` - Get quizzes
- `GET /api/forum/` - Get forum posts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Django REST Framework for the robust backend
- Material-UI for the beautiful components
- React for the dynamic frontend
- The open-source community for inspiration

---

**Happy Studying! 📚✨**
