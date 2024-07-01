# Budget Messenger

- A chat application built with the MERN stack, simulating the features and behavior of modern chat apps like Messenger using Socket.IO.

## Features

- User registration and login
- View list of online friends realtime
- Send text messages
- Send images
- Chat app behaviors:
  - New message notifications
  - Typing indicators
  - Message status: sending, sent, delivered, seen
- Synchronization across multiple logged-in devices

## Technologies

- **MERN Stack**
  - **Frontend:** React, Redux Toolkit, SASS, RTK Query, use-sound
  - **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Real-time communication:** Socket.IO

## Screenshots
### Login Page
![Login Page](./screenshots/login.png)

### Chat Page
![Chat Page](./screenshots/chat.png)

### Online Friends List
![Online Friends List](./screenshots/online_friends.png)

### Message Status
![Message Status](./screenshots/message_status.png)

## Project Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/npvu1510/budget_messenger.git
   
2. Install dependencies:
   ```sh
   npm install
   
3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables. An example `.env` file:
   ```env
    PORT = 5000
    
    MONGODB_URI_STRING = ...
    
    JWT_SECRET_KEY = ...
    
    JWT_EXPIRES_IN = 24h
    COOKIE_EXPIRES_IN_DAY = 100

4. Start server:
   ```sh
   npm run server

5. Start client:
   ```sh
   npm run server

6. Start socket:
   ```sh
   cd socket
   npm run server
