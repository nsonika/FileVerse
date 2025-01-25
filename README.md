# Fullstack File Management System

---

## Features
- Drag-and-drop file upload.
- File preview and download options.
- Backend API for file processing and management.
- Dockerized setup for easy deployment.
- End-to-end (E2E) testing using Cypress.

---

## Prerequisites
Make sure you have the following installed:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Setup Instructions

### 1. Backend Setup
- Navigate to the backend folder:
   ```bash
   cd backend
   ```
- Build and start the backend using Docker:
   ```bash
   docker-compose up --build
   ```

**Environment Variables**:  
Create a `.env` file in the backend directory with the following content. Replace placeholders with your actual Appwrite configuration values:
```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_appwrite_project_id
APPWRITE_API_KEY=your_appwrite_api_key
APPWRITE_BUCKET_ID=your_appwrite_bucket_id
APPWRITE_DATABASE_ID=your_appwrite_database_id
APPWRITE_COLLECTION_ID=your_appwrite_collection_id
```

---

### 2. Frontend Setup
- Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
- Build and start the frontend using Docker:
   ```bash
   docker-compose up --build
   ```

**Environment Variables**:  
Create a `.env` file in the frontend directory with the following content:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## Testing

### End-to-End (E2E) Testing with Cypress
This project uses Cypress for automated end-to-end testing.

- **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

- **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

- **Run Cypress in interactive mode:**
   ```bash
   npx cypress open
   ```
   This opens the Cypress Test Runner. You can select the test suite to run.

- **Run Cypress in headless mode:**
   ```bash
   npx cypress run
   ```
   This will execute all tests and generate a report.

---

## Usage
- Access the frontend at [http://localhost:3000](http://localhost:3000).
- Use the UI to upload, preview, and download files.
- Uploaded files are managed through Appwrite's backend services.

---

## Technologies Used
- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Appwrite, FastAPI
- **Testing**: Cypress
- **Deployment**: Docker and Docker Compose

---

## Folder Structure
- **frontend/**: Contains the Next.js-based UI for file management.
- **backend/**: Contains API logic for file uploads and interactions with Appwrite.
- **frontend/cypress/**: E2E testing suite for frontend validation.
