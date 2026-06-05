# JobTracker

A full-stack job search management application built with HTML, CSS, JavaScript, Node.js, and Express. The application helps users organize and track job applications while providing the foundation for AI-assisted job analysis.

## Overview

JobTracker was created to solve a real problem: managing job applications during a job search. Instead of tracking applications in spreadsheets or notes, users can store applications in a centralized dashboard, search and filter results, and maintain persistent records between browser sessions.

The project started as a frontend-only application and has since evolved into a full-stack application with a Node.js/Express backend and AI analysis architecture.

---

## Features

### Job Management

* Add new job applications
* Store company name
* Store job title
* Store application date
* Track application status
* Save notes for each application
* Delete applications

### Search and Filtering

* Search by company name
* Search by job title
* Filter by application status
* Dynamic updates without page refreshes

### Persistence

* Data stored using browser localStorage
* Applications remain available after browser refreshes
* Automatic saving after updates

### Visual Organization

* Color-coded application statuses
* Responsive card-based layout
* Clean dashboard interface

### AI Analyzer Architecture

* Job description input area
* Analyze Job workflow
* Frontend-to-backend communication
* Express API endpoint structure
* Ready for OpenAI integration
* Currently configured for mock responses until API integration is enabled

---

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Backend

* Node.js
* Express.js

### Development Tools

* Visual Studio Code
* Git
* GitHub
* npm

### Future Integrations

* OpenAI API
* Database (MongoDB or PostgreSQL)
* Authentication
* Cloud Deployment

---

## Project Structure

```text
JobTracker/
│
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── .env
│
└── node_modules/
```

---

## How It Works

### Frontend Flow

1. User enters job information.
2. Form submission creates a job object.
3. Job object is added to the jobs array.
4. jobs array is saved to localStorage.
5. UI is re-rendered with updated data.

### Search and Filtering

1. User enters a search term or selects a status filter.
2. JavaScript filters the jobs array.
3. Matching jobs are rendered.
4. Original data remains unchanged.

### AI Analysis Flow

```text
User
 ↓
Frontend (JavaScript)
 ↓
Fetch Request
 ↓
Express Backend
 ↓
AI Analysis Route
 ↓
Response
 ↓
Frontend Display
```

---

## Key Software Engineering Concepts Demonstrated

### DOM Manipulation

The application dynamically creates and updates job cards using JavaScript and the Document Object Model (DOM).

### Event-Driven Programming

User interactions trigger event listeners that update application state and UI.

### State Management

The jobs array serves as the application's source of truth.

### CRUD Operations

Current implementation includes:

* Create
* Read
* Delete

Update functionality is planned for a future release.

### Local Persistence

Data is stored using localStorage and restored when the application loads.

### Client-Server Architecture

The application now includes:

* Frontend client
* Express backend
* API endpoint architecture

### Version Control

Git is used to track project history and manage feature development through commits.

---

## Current Status

### Version 1.0

Completed:

* Job creation
* Job deletion
* Search functionality
* Status filtering
* localStorage persistence
* Color-coded status tracking
* Git integration
* GitHub repository
* Express backend
* AI analyzer frontend
* API architecture

In Progress:

* Mock AI analyzer responses
* OpenAI integration

Planned:

* Edit job functionality
* Dashboard statistics
* Resume keyword extraction
* Interview preparation generator
* CSV export
* Database integration
* User authentication
* Cloud deployment

---

## Installation

Clone the repository:

```bash
git clone https://github.com/AlchemFac/JobTracker.git
```

Navigate to the project directory:

```bash
cd JobTracker
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
OPENAI_API_KEY=your_key_here
```

Start the server:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

## Lessons Learned

This project provided hands-on experience with:

* JavaScript fundamentals
* DOM manipulation
* Event listeners
* Array methods
* localStorage
* Git and GitHub workflows
* Node.js
* Express routing
* Environment variables
* API architecture
* Frontend-to-backend communication

---

## Future Goals

The long-term goal is to evolve JobTracker into a complete AI-assisted job search platform that helps users:

* Track applications
* Analyze job descriptions
* Tailor resumes
* Generate interview preparation material
* Prioritize applications based on fit and opportunity
