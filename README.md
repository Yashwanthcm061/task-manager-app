# Task Manager Application

## Overview

A full-stack Task Manager application that allows users to register, log in, and manage tasks across three stages: Todo, In Progress, and Done.

## Live Demo

Frontend:
https://task-manager-app-ten-kappa.vercel.app

Backend:
https://task-manager-backend-6n70.onrender.com

## Features

* User Registration
* User Login
* JWT Authentication
* Protected Dashboard
* Create Tasks
* View Tasks
* Update Task Status
* Delete Tasks
* Logout Functionality
* Responsive UI using Tailwind CSS

## Tech Stack

### Frontend

* React
* Vite
* React Router DOM
* Axios
* Tailwind CSS

### Backend

* Flask
* Python
* JWT Authentication

### Database

* PostgreSQL (Neon)

### Deployment

* Frontend: Vercel
* Backend: Render

## Database Schema

### Users Table

| Column   | Type                |
| -------- | ------------------- |
| id       | SERIAL PRIMARY KEY  |
| name     | VARCHAR(100)        |
| email    | VARCHAR(100) UNIQUE |
| password | VARCHAR(255)        |

### Tasks Table

| Column      | Type               |
| ----------- | ------------------ |
| id          | SERIAL PRIMARY KEY |
| title       | VARCHAR(255)       |
| description | TEXT               |
| status      | VARCHAR(50)        |
| user_id     | INTEGER            |
| created_at  | TIMESTAMP          |

## API Endpoints

### Authentication

* POST /register
* POST /login

### Tasks

* GET /tasks
* POST /tasks
* PUT /tasks/:id
* DELETE /tasks/:id

## Assumptions

* Each task belongs to one user.
* Users can only access their own tasks.
* Task status can only be Todo, In Progress, or Done.
* Email addresses must be unique.

## Technical Decisions

* React + Vite was chosen for fast frontend development.
* Flask was chosen as a lightweight backend framework.
* PostgreSQL was used for reliable relational data storage.
* JWT authentication was implemented for secure API access.
* Tailwind CSS was used to create a responsive UI quickly.

## Tradeoffs

* Status updates are implemented using dropdowns instead of drag-and-drop functionality.
* A simple Kanban-style layout was used to keep the application lightweight and easy to maintain.

## How to Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Future Enhancements

* Drag-and-drop task movement
* Task priorities
* Due dates
* Task search and filtering
* User profile management
