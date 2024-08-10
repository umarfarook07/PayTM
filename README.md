
# PayTM Clone

## Overview

This project is a clone of PayTM, built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It provides basic features similar to a digital wallet, allowing users to sign up, log in, and view their balance and the accounts of other users.

## Features

- **User Authentication**:
  - Implemented secure signup and signin endpoints.
  - Users can register with their details, and on successful signup, the system automatically generates a random amount of fake money in their account.

- **Dashboard**:
  - After logging in, users are directed to a dashboard where they can view their balance and see the accounts of other users.

- **Security**:
  - Used JSON Web Tokens (JWT) to manage user sessions securely.
  
- **Input Validation**:
  - Integrated Zod for robust validation of user input to ensure data integrity.

## Inspiration

This project was inspired by Harkirat Singh's projects on the 100xDevs platform, aimed at providing practical experience in full-stack development.

## Technologies Used

- **MongoDB**: Database for storing user information.
- **Express.js**: Backend framework for building the REST API.
- **React.js**: Frontend library for building the user interface.
- **Node.js**: Server-side environment to run JavaScript.
- **JWT (jsonwebtoken)**: For secure user authentication.
- **Zod**: Schema declaration and validation library for input validation.
