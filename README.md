Real Estate Platform

* The primary focus of this project is to learn and understand the backend development using MERN stack, while also utilizing TypeScript for type safety in the frontend and Tailwind CSS for styling *

The Real Estate Platform is a web application built using the MERN stack (MongoDB, Express, React, Node.js).

Features:
User authentication and authorization
Create, read, update, and delete property listings
Image upload and management for property listings
Filter and search functionality for property listings
Responsive design using Tailwind CSS

Tech Stack:

Frontend:

React with TypeScript
Tailwind CSS for styling
React Router for navigation
Axios for API requests
React Hook Form for form handling

Backend:

Node.js with Express.js
MongoDB with Mongoose for database
JWT for authentication
 Firebase Storage for image upload
Dev Tools
TypeScript for type safety
ESLint and Prettier for code quality
Jest for testing

Installation:

Prerequisites:
Node.js (>=14.x)
npm or yarn
MongoDB (local or Atlas)
Backend Setup
Clone the repository:

git clone https://github.com/yourusername/real-estate-platform.git
cd real-estate-platform
Install server dependencies:

cd server
npm install
Create a .env file in the server directory and add the following environment variables:

env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Start the backend server:

npm start
Frontend Setup
Install client dependencies:

Copy code
cd client
npm install
Create a .env file in the client directory and add the following environment variables:

Start the frontend development server:

Copy code
npm start
Usage
Open your browser and navigate to http://localhost:3000
Register a new account or login with existing credentials.
Create, view, update, and delete property listings.
Use the search and filter functionality to find specific properties.
