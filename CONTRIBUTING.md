# Contributing to PrepPilot 🤝

Thank you for your interest in contributing to PrepPilot! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/PrepPilot.git
   cd PrepPilot
   ```
3. **Set up the development environment** using our setup scripts:
   ```bash
   # For macOS/Linux/Unix
   ./setup.sh
   
   # For Windows
   setup.bat
   ```

## 💻 Development Workflow

### Branch Naming Convention
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring

### Making Changes

1. **Create a new branch** from main:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly:
   ```bash
   # Start both servers
   ./start.sh  # or start.bat on Windows
   
   # Test the functionality in the browser
   ```

4. **Commit your changes** with clear messages:
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 📝 Coding Standards

### Backend (Django)
- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Write docstrings for functions and classes
- Use Django's built-in features when possible
- Keep views simple and use serializers for data validation

### Frontend (React/TypeScript)
- Use TypeScript for all new components
- Follow React hooks best practices
- Use Material-UI components consistently
- Maintain the glass-morphic design language
- Keep components small and focused

### Code Style Examples

#### Python (Django)
```python
from typing import List, Optional
from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    """Serializer for Note model with user relationship."""
    
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at']
        
    def validate_title(self, value: str) -> str:
        """Validate note title length."""
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long")
        return value
```

#### TypeScript (React)
```typescript
interface NoteProps {
  note: Note;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const NoteCard: React.FC<NoteProps> = ({ note, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => {
    onEdit(note.id);
  }, [note.id, onEdit]);

  return (
    <Card sx={{ /* glass morphic styles */ }}>
      {/* Component content */}
    </Card>
  );
};
```

## 🧪 Testing

### Backend Testing
```bash
cd smart_exam_hub
python manage.py test
```

### Frontend Testing
```bash
cd smart-frontend
npm test
```

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the established style guidelines
- [ ] Tests pass locally
- [ ] Changes have been tested in both development and production builds
- [ ] Documentation has been updated if necessary
- [ ] Commit messages are clear and descriptive

### Pull Request Template
```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if frontend changes)

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information or context.
```

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Clear description** of the problem
2. **Steps to reproduce** the issue
3. **Expected vs actual behavior**
4. **Environment information**:
   - OS (macOS, Windows, Linux)
   - Python version
   - Node.js version
   - Browser (if frontend issue)
5. **Screenshots** or error messages if applicable

## 💡 Feature Requests

For feature requests, please:

1. Check if the feature already exists or is planned
2. Provide a clear description of the feature
3. Explain the use case and benefits
4. Consider providing mockups or examples

## 🏗️ Project Structure

```
PrepPilot/
├── smart_exam_hub/           # Django backend
│   ├── auth/                # Authentication app
│   ├── notes/               # Notes management
│   ├── quizzes/            # Quiz system
│   ├── planner/            # Study planner
│   ├── forum/              # Discussion forum
│   └── smart_exam_hub/     # Main settings
├── smart-frontend/          # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api/           # API services
│   │   ├── types/         # TypeScript types
│   │   └── theme/         # UI theme
│   └── public/
└── scripts/                # Setup and utility scripts
```

## 🤔 Questions?

If you have questions about contributing:

1. Check the existing issues and discussions
2. Create a new issue with the "question" label
3. Join our community discussions

## 🙏 Recognition

Contributors will be recognized in our README.md file and release notes. Thank you for helping make PrepPilot better!

---

**Happy Contributing! 🚀**