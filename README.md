# HireScreenBuddy

An intelligent resume screening system that leverages AI to automatically evaluate and score resumes against job descriptions. This application helps recruiters and hiring teams efficiently screen candidates and identify the best fits for job openings.

## 🎯 Features

- **AI-Powered Resume Screening**: Automatically score and rank resumes using advanced NLP algorithms
- **Job Description Parsing**: Extract key requirements from job postings
- **Resume Parsing**: Support for multiple file formats (PDF, DOCX)
- **Scoring Algorithm**: Intelligent matching between candidate skills and job requirements
- **User Authentication**: Secure login and signup system
- **Dashboard**: Intuitive interface for managing job postings and screening results
- **Real-time Results**: Instant scoring and detailed candidate evaluation reports

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 4.0.6
- **Language**: Java 21
- **Database**: PostgreSQL
- **Key Libraries**:
  - Spring Data JPA (ORM)
  - Spring Web (REST APIs)
  - PDFBox (PDF parsing)
  - Apache Tika (Document processing)
  - OkHttp (HTTP client for AI API calls)
  - Jackson (JSON processing)

### Frontend (React)
- **Framework**: React 19.2.6 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 📁 Project Structure

```
hirescreenbuddy/
├── hirescreenbuddy-frontend/     # React + Vite frontend application
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Page components
│   │   ├── api/                  # API integration
│   │   └── assets/               # Static assets
│   ├── package.json
│   └── vite.config.js
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ayush/hirescreenbuddy/
│   │   │       ├── controller/   # REST API endpoints
│   │   │       ├── model/        # Entity models
│   │   │       ├── service/      # Business logic
│   │   │       ├── repository/   # Database access layer
│   │   │       └── nlp/          # AI scoring & text extraction
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml                       # Maven configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Java 21** or higher
- **Maven** 3.6+
- **PostgreSQL** 12+
- **Node.js** 16+ and npm/yarn

### Backend Setup

1. **Configure Database**:
   ```bash
   # Create PostgreSQL database
   createdb hirescreenbuddy_db
   ```

2. **Set Environment Variables**:
   ```bash
   # Copy example configuration
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```

3. **Update `application.properties`** with your configuration:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/hirescreenbuddy_db
   spring.datasource.username=postgres
   spring.datasource.password=YOUR_PASSWORD
   app.ai.api-key=YOUR_AI_API_KEY  # Get from Groq API
   ```

4. **Build and Run**:
   ```bash
   # Build the project
   mvn clean install
   
   # Run the Spring Boot application
   mvn spring-boot:run
   ```

The backend will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd hirescreenbuddy-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

The frontend will be available at `http://localhost:5173` (Vite default)

## 📚 API Endpoints

### Job Management
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job posting
- `GET /api/jobs/{id}` - Get job details
- `PUT /api/jobs/{id}` - Update job posting
- `DELETE /api/jobs/{id}` - Delete job posting

### Resume Screening
- `POST /api/screening/upload` - Upload resume
- `POST /api/screening/evaluate` - Evaluate resume against job
- `GET /api/screening/results` - Get screening results
- `GET /api/screening/results/{id}` - Get detailed result

### Resume Management
- `GET /api/resumes` - Get all resumes
- `POST /api/resumes/upload` - Upload resume
- `GET /api/resumes/{id}` - Get resume details
- `DELETE /api/resumes/{id}` - Delete resume

## 🔒 Security & Configuration

### Important: Secrets Management
- **Never commit** `application.properties` with real credentials
- Use `application.properties.example` as reference
- Set secrets via environment variables in production
- Keep API keys secure and rotate regularly

### Environment Variables (Optional)
```bash
DB_URL=jdbc:postgresql://localhost:5432/hirescreenbuddy_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
AI_API_KEY=your_api_key
```

## 🧪 Testing

### Backend
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ClassName
```

### Frontend
```bash
cd hirescreenbuddy-frontend

# Run linting
npm run lint
```

## 📦 Building for Production

### Backend
```bash
mvn clean package -DskipTests
# JAR file will be in target/ directory
```

### Frontend
```bash
cd hirescreenbuddy-frontend
npm run build
# Build output will be in dist/ directory
```

## 🔧 Development Tools

- **IDE**: IntelliJ IDEA or VS Code
- **Database Client**: pgAdmin or DBeaver
- **API Testing**: Postman or Insomnia
- **Frontend Dev**: VS Code with ESLint extension

## 📝 File Upload Limits

Currently configured limits:
- Maximum file size: 10MB
- Supported formats: PDF, DOCX, DOC
- Upload directory: `uploads/resumes/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Ayush Sharma**
- GitHub: [@AyuSharma176](https://github.com/AyuSharma176)

## 🙏 Acknowledgments

- Spring Boot for the robust backend framework
- React for the frontend framework
- Groq API for AI capabilities
- PostgreSQL for reliable data storage
- Tailwind CSS for beautiful styling

## 📧 Support

For support, open an issue on the GitHub repository or contact the development team.

---

**Last Updated**: May 2026

