# To-Do List Application  

## Table of Contents  
1. [Overview](#overview)  
2. [Features](#features)  
3. [Challenges and Solutions](#challenges-and-solutions)  
4. [Getting Started](#getting-started)  
5. [Technologies Used](#technologies-used)  

---
### Installation  
1. **Clone the repository**:  
   ```bash  
   git clone https://github.com/JithinGeorge10/the-alter-office-task.git 
   cd  https://github.com/JithinGeorge10/the-alter-office-task



## Instructions to run the project
..cd frontend
npm run dev

..cd backend
npm start


## Overview  
This is a **To-Do List application** built with modern web development tools and frameworks. It allows users to manage their tasks efficiently with features like Google authentication, image uploads, and task management. The project is structured with a **React (Vite) TypeScript frontend**, a **Node.js TypeScript backend**, and **MongoDB** as the database. Firebase is used for Google authentication and file storage.  

---

## Features  
- **User Authentication**  
  - Google authentication via Firebase.  


- **List and Board**  
- Tasks are shown in both list an board
- **Task Management**  
  - Add tasks with image uploads stored in Firebase Storage.  
  - Edit tasks with history tracking for previous updates.  
  - Change task status with batch update functionality.  


- **Search and Filter**  
  - Search tasks based on keywords and apply filters for better organization.  

- **Task History**  
  - Maintains a date-based history of edits and status changes for each task.  

---

## Challenges and Solutions  

### 1. **Session Handling**  
- **Challenge**: Unable to clear authentication tokens stored in cookies on the frontend. Attempting to use `localStorage` resulted in additional bugs.  
- **Solution**:  
  - Implemented a separate database for blacklisted tokens.  
  - Created a middleware to verify tokens against the blacklist collection before processing requests.  

### 2. **Drag-and-Drop Functionality**  
- **Challenge**: UI alignment issues and partial implementation of drag-and-drop functionality.  
- **Solution**: Gained a better understanding of the drag-and-drop library and improved alignment, though some edge cases still need work.  

### 3. **Activity Tracking in Task Edits**  
- **Challenge**: Previously updated statuses were not reflected correctly.  
- **Solution**: Introduced a history feature that logs the date and details of all updates.  

---

## Getting Started  

### Prerequisites  
- **Node.js** 
- **MongoDB**  
- **Firebase** (set up project and credentials)  

Hosted Platforms:
Frontend: Vercel
Backend: Render


Hosted Live Link:
https://task-management-pi-three.vercel.app/