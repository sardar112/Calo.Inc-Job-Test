# Calo.Inc-Job-Test

This project is a full-stack job management application built with React, Node.js, and TypeScript. The app is designed to display and manage a list of asynchronous job tasks. Each job fetches an image from Unsplash and displays it upon completion. The app has a user-friendly frontend interface where users can view the list of jobs and add new jobs. Each new job appears with a pending status and is updated with an image once processed.

# Requirements.

Create a backend service with next endpoints: /jobs, /jobs/{id}.
POST on /jobs should create a new job in the system and return its ID to a client.
GET on /jobs should return a list of jobs, resolved should return job result, not resolved just a status.
GET on /jobs/{jobId} should return resolved job or its status
Create a client with one page and next functionality.
Display list of jobs.
Be able to create a new job.
Client should be able to fetch and display the results of a job as soon as its resolved. In our case job is delayed execution of retrieving random Unsplash image from the food category, job execution is random might take from 5 sec to 5 min, with 5 sec step.

#What to consider.
Highload, more than 1 pending job.
Unstable internet connection between client and backend.
Job results should be saved, and we should be able to retrieve them later.

# Solution.

Backend
The backend is built using Node.js and TypeScript, featuring a file-based job queue that manages concurrent job processing. Here's a summary of key components:

Job Processing: The backend service handles asynchronous job processing by fetching a random Unsplash image (from the "food" category) for each job, with a random delay of 5 seconds to 5 minutes.
File Handling and Locking: A file-locking mechanism ensures safe concurrent access to job data. Jobs are queued for updates, with exclusive locks implemented for file operations.
Real-time Notifications: WebSocket connections are used to notify the frontend when jobs complete, allowing the client to update job statuses in real-time.
Frontend
The frontend is built with React, TypeScript, Zustand (for state management), and shadCN for a modern UI. Key functionalities include:

Job Display and Creation: A single-page interface shows the job list, including job IDs, statuses, and images upon resolution.
Real-time Updates: WebSocket integration provides real-time updates, refreshing the job list as soon as each job completes.
This design efficiently handles a high volume of pending jobs and network instabilities, ensuring consistent real-time updates and reliable data storage.

# Setup.

git clone repo

# Backend Setup ..........................

cd Calo.Inc-Job-Test/backend.

# Install Dependencies

npm install

# or

yarn install

# Configure Environment Variables

Create a .env file in the root of the project and add the
UNSPLASH_ACCESS_KEY =
UNSPLASH_URL =
NODE_ENV =
PORT =

# Run Server

npm run dev

# Frontend Setup ..........................

cd Calo.Inc-Job-Test/frontend

# Install Dependencies

npm install

# or

yarn install

# Configure Environment Variables

Create a .env file in the root of the project and add the
VITE*WS_URL =
VITE_API_BASE_URL =
Make sure it should be starting with VITE*

# Run Client

npm run dev
