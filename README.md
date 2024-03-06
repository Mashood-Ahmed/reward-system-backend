# Reward System
Reward System is an Express-Nodejs application designed to handle REST API requests. It uses PostgreSQL as database storage.
It provides a complete support for a task management social media application:
1. Scalable Task Management
-- Develop a scalable backend infrastructure using Node.js to efficiently manage and process task assignments, ensuring optimal performance as user activity increases.
2. Secure User Authentication
-- Implement robust user authentication mechanisms to safeguard user accounts and maintain the security of personal information.
3. Efficient Reward Distribution
-- Create backend processes for fair and efficient reward distribution upon successful task completion, considering factors such as task complexity and user contributions.
4. Task Completion Verification
-- Establish reliable mechanisms for verifying task completion, preventing fraudulent activities and ensuring the integrity of the reward system.


# Prerequisites
- Node.js and npm should be installed. You can download them from here.
- PostgreSQL should be installed and running. You can download it from here.
- Postman (or any other API Testing application)

# Install dependencies:
To install all required dependencies, run:
```bash
npm install
```
# Required Credentails:
Open .env file in root folder to enter following as per local setup:
	- 1. PORT: A non occupied port on local system to run the application.
	- 2. DATABASE_PORT: The port number on which local PostgreSQL is running.
	- 3. DATABASE_PASSWORD: Your local database password.

# Setup Database 1:
Manually create a database with the name "reward-system" on your local PostgreSQL database

# Running the Application
To start the application, run:

```bash
npm run server
```

The application will start on http://localhost:3000 by default.

# Database Setup 2:
Using Postman or any other API testing software, run the following APIs in order:

`http://localhost:{your_port_number}/db/force`
`http://localhost:{your_port_number}/db/procedures`
