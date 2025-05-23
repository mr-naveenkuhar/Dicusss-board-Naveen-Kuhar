# Discussion Board Project Plan

## Group Members and Roles
- Naveen Kuhar - Backend
- Rukasna - Frontend
- Mandeep - Security

## Classcode 
- CP-S4 

## Technologies Used

- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) **TypeScript**: Frontend development.
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React**: Backend development.
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white) **Bootstrap**: Styling.
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) **SQL**: Database management.
- ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring&logoColor=white) **Spring Security**: Authentication and security.

## Timeline

```mermaid
gantt
    title Discussion Board Project Timeline
    dateFormat  YYYY-MM-DD
    axisFormat  %d-%b

    section Phase 1: Planning and Setup
    Define project requirements       :done,    des1, 2025-05-22, 1d
    Set up the development environment:done,    des2, 2025-05-22, 1d
    Create database schema and models :done,    des3, 2025-05-22, 1d

    section Phase 2: Backend Development
    Create discussion board functionality:active, des4, 2025-05-23, 2d
    Add database integration and relationships:    des5, 2025-05-23, 2d
    Write unit tests for backend functionality:    des6, 2025-05-23, 2d

    section Phase 3: Frontend Development
    Develop UI components using Bootstrap:    des7, 2025-05-25, 2d
    Integrate frontend with backend API:    des8, 2025-05-25, 2d
    Implement responsive design:    des9, 2025-05-25, 2d

    section Phase 4: Security and Deployment
    Add Spring Security for authentication:    des10, 2025-05-27, 1d
    Conduct end-to-end testing:    des11, 2025-05-27, 1d
    Deploy the application to production:    des12, 2025-05-27, 1d

    section Milestones
    Project Kickoff                     :milestone, m1, 2025-05-22, 0d
    Backend Development Complete        :milestone, m2, 2025-05-24, 0d
    Frontend Development Complete       :milestone, m3, 2025-05-26, 0d
    Project Deployment                  :milestone, m4, 2025-05-27, 0d
```

## Screenshots

![Application Screenshot](public/Screenshots/image.png)

## Project Goal
The project aims to develop a comprehensive discussion board application where users can register, create threads, post messages, and interact with others. The application will feature user authentication, thread management, and a responsive user interface.

## Key Elements

### Backend
- **Database**: A relational database (e.g., MySQL, PostgreSQL) to store user data, threads, and posts. Sequelize ORM is used for database interaction.
- **API**: RESTful API endpoints for user authentication, thread management, and post management.
- **Models**:
  - `User`: Represents registered users with attributes like `id`, `username`, `email`, and `password`.
  - `Thread`: Represents discussion threads with attributes like `id`, `title`, and `userId` (foreign key).
  - `Post`: Represents posts within threads with attributes like `id`, `content`, `threadId` (foreign key), and `userId` (foreign key).
- **Middleware**: Authentication middleware to secure API endpoints and validate user sessions.
- **Relationships**:
  - `User` has many `Threads` and `Posts`.
  - `Thread` belongs to a `User` and has many `Posts`.
  - `Post` belongs to both `Thread` and `User`.

### Frontend
- **UI Components**:
  - Reusable components for forms, navigation, and displaying threads/posts.
  - Components include `LoginForm`, `RegisterForm`, `MainNavigation`, `NewPostInput`, and `PostItem`.
- **Pages**:
  - `Index`: Displays a list of threads.
  - `PostDetailPage`: Shows posts within a thread.
  - `ProfilePage`: Displays user profile information.
  - `ChatbotPage`: Integrates a chatbot for user assistance.
- **Services**:
  - `postService`: Handles API calls related to posts.
  - `chatbotService`: Manages chatbot interactions.
  - `sqlService`: Executes SQL queries for advanced users.

### Communication
- **Routes**:
  - `/api/users`: Handles user-related operations like registration and login.
  - `/api/threads`: Manages thread creation and retrieval.
  - `/api/posts`: Handles post creation and retrieval.
- **Error Handling**:
  - Backend: Centralized error handling middleware for API responses.
  - Frontend: User-friendly error messages displayed in the UI.

## Risks
- **Database Issues**: Connection problems or schema conflicts.
- **API Security**: Risks of unauthorized access or data breaches.
- **Integration Challenges**: Ensuring seamless communication between frontend and backend.
- **Timeline Delays**: Unforeseen delays in development or testing phases.

## Communication Plan
- **Team Meetings**: Weekly meetings to discuss progress and address blockers.
- **Task Management**: Use tools like Trello or Jira to track tasks and milestones.
- **Code Reviews**: Regular reviews to maintain code quality and consistency.
- **Documentation**: Maintain detailed documentation for API endpoints, database schema, and project setup.
- **Communication Tools**: Use Slack or Microsoft Teams for real-time communication.

## How Everything Works and How We Achieve It

### Backend

1. **Database**:
   - A relational database (e.g., MySQL, PostgreSQL) is used to store data for users, threads, and posts.
   - Sequelize ORM simplifies database interactions by allowing us to define models (`User`, `Thread`, `Post`) and their relationships.
   - Relationships:
     - `User` has many `Threads` and `Posts`.
     - `Thread` belongs to a `User` and has many `Posts`.
     - `Post` belongs to both `Thread` and `User`.

2. **API**:
   - RESTful API endpoints handle user authentication, thread management, and post management.
   - Routes are organized in `userRoutes.js` and `threadRoutes.js`.

3. **Authentication**:
   - Users register and log in via API endpoints (`/api/users/register` and `/api/users/login`).
   - Passwords are hashed before storing them in the database.
   - JWT tokens are issued upon successful login to maintain authenticated sessions.

4. **Middleware**:
   - Authentication middleware ensures only authorized users can access protected routes.

5. **Database Synchronization**:
   - The database schema is synchronized using `sequelize.sync()` in `server.js`.

### Frontend

1. **UI Components**:
   - Reusable components like `LoginForm`, `RegisterForm`, `MainNavigation`, and `PostItem` are built using React.
   - These components are styled and designed to provide a responsive user interface.

2. **Pages**:
   - `Index`: Displays a list of threads.
   - `PostDetailPage`: Shows posts within a thread.
   - `ProfilePage`: Displays user profile information.
   - `ChatbotPage`: Integrates a chatbot for user assistance.

3. **State Management**:
   - React Context or Redux is used to manage global state, such as user authentication status and thread data.

4. **API Integration**:
   - Axios is used to make HTTP requests to the backend API.
   - Responses are processed and displayed using React components.

5. **Services**:
   - `postService`: Handles API calls related to posts.
   - `chatbotService`: Manages chatbot interactions.
   - `sqlService`: Executes SQL queries for advanced users.

### How Backend and Frontend Work Together

1. **User Registration and Login**:
   - The frontend sends a POST request to `/api/users/register` or `/api/users/login`.
   - The backend validates the input, processes the request, and returns a response (e.g., a JWT token for login).

2. **Thread and Post Management**:
   - Threads and posts are created via POST requests to `/api/threads` and `/api/posts`.
   - The backend validates the input, stores the data in the database, and returns the created resource.
   - Threads and posts are retrieved via GET requests to `/api/threads` and `/api/posts`.

3. **Error Handling**:
   - The backend uses centralized error-handling middleware to return consistent error responses.
   - The frontend displays user-friendly error messages based on the backend's responses.

### Deployment

1. **Backend**:
   - Deployed to a cloud platform like AWS or Heroku.
   - The database is hosted on a managed service like AWS RDS or Azure SQL.

2. **Frontend**:
   - Hosted on a static site hosting service like Netlify or Vercel.

### Testing

1. **Unit Tests**:
   - Written for backend models and API endpoints to ensure individual components work as expected.

2. **Integration Tests**:
   - Validate that the frontend and backend work together seamlessly.

3. **End-to-End Tests**:
   - Simulate user interactions to test the entire application flow.

### How We Achieve This

1. **Planning**:
   - A detailed project plan was created, outlining goals, elements, timeline, and risks.

2. **Development**:
   - Backend and frontend were developed in parallel, with clear API contracts to ensure compatibility.

3. **Collaboration**:
   - Regular team meetings, task tracking, and code reviews ensured smooth progress.

4. **Tools and Technologies**:
   - Sequelize for database interaction.
   - React for building the frontend.
   - Axios for API communication.
   - JWT for authentication.
   - Cloud platforms for deployment.
