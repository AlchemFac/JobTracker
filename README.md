# CareerTracker

A full-stack job application management platform built with **HTML, CSS, JavaScript, Node.js, and Express**. CareerTracker helps users organize their job search while leveraging AI-powered tools to analyze job descriptions and compare resumes against job postings.

## 🚀 Live Demo

**Application:** https://career-tracker-n9nu.onrender.com

> **Note:** The current version stores data in the browser using `localStorage`. Each user has their own private data that persists on their device. PostgreSQL and user authentication are planned for a future release.

<img width="2559" height="1392" alt="image" src="https://github.com/user-attachments/assets/b34a1a97-4d23-40c1-a4e0-934cb686203e" />


---

# Overview

CareerTracker was built to simplify the job search process by replacing spreadsheets and notes with a centralized application tracking system.

Users can:

- Track job applications
- Organize applications by status
- Search and filter opportunities
- Save notes
- Analyze job descriptions using AI
- Compare resumes against job postings
- Monitor application progress through dashboard statistics

The project evolved from a frontend JavaScript application into a full-stack application with an Express backend and AI-powered workflows.

---

# Features

## Job Management

- Create job applications
- Edit existing applications
- Delete applications
- Track company, role, application date, status, and notes
- Save AI-generated analysis with each job

## Dashboard

- Total Applications
- Applied
- Interview
- Rejected
- Offer

Dashboard updates automatically as applications change.

## Search & Filtering

- Search by company
- Search by role
- Filter by application status
- Dynamic updates without page refreshes

## AI Job Description Analyzer

Analyze a job posting to receive:

- Match score
- Required skills
- Missing keywords
- Resume improvement suggestions
- Overall recommendation

Supports:

- Mock AI provider
- Ollama (Llama 3)

## Resume Match Analyzer

Compare a resume against a job description to receive:

- Resume match score
- Strong matching skills
- Missing qualifications
- Suggested resume improvements
- Optimized resume bullet recommendations

## Persistence

- Browser localStorage
- Automatic saving
- Persistent data after refresh

---

# Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)

## Backend

- Node.js
- Express.js

## AI

- Ollama
- Llama 3
- Mock AI Provider

## Deployment

- Render

## Development Tools

- Git
- GitHub
- Visual Studio Code
- npm
- dotenv

---

# Project Architecture

```text
Browser
      │
      ▼
HTML / CSS / JavaScript
      │
      ▼
Express REST API
      │
      ▼
AI Provider
(Mock or Ollama)
```

Current persistence:

```text
Browser
      │
      ▼
localStorage
```

Future architecture:

```text
Browser
      │
      ▼
Express API
      │
      ▼
PostgreSQL
      │
      ▼
Authentication
```

---

# Software Engineering Concepts Demonstrated

- Full-stack web development
- RESTful API design
- CRUD operations
- Client-server communication
- Asynchronous programming (`async/await`)
- Fetch API
- JSON serialization
- State management
- DOM manipulation
- Event-driven programming
- Environment-based configuration
- AI integration
- Prompt engineering
- Git version control
- Responsive UI design

---

# Installation

```bash
git clone https://github.com/AlchemFac/JobTracker.git
cd JobTracker
npm install
```

Create a `.env` file:

```env
AI_PROVIDER=mock
```

or

```env
AI_PROVIDER=ollama
```

Run the application:

```bash
npm start
```

Open:

```
http://localhost:3000
```

---

# Roadmap

## Completed

- Full CRUD job management
- Search and filtering
- Dashboard analytics
- AI Job Description Analyzer
- Resume Match Analyzer
- Express backend
- Mock AI provider
- Ollama integration
- Live deployment on Render

## Planned

- PostgreSQL database
- User authentication
- Cloud data persistence
- Multi-device synchronization
- Export applications
- Email notifications
- Interview scheduling
- Enhanced analytics

---

# Lessons Learned

This project strengthened my experience with:

- Full-stack application development
- REST API implementation
- Backend architecture
- AI integration
- Asynchronous JavaScript
- Express middleware
- Environment configuration
- Git workflows
- Debugging and testing
- Deploying applications to the cloud

---

# Future Vision

The long-term goal is to evolve CareerTracker into a production-ready platform where users can securely manage their job search across multiple devices, receive AI-assisted career guidance, and store application data in a cloud-hosted PostgreSQL database with authenticated user accounts.
