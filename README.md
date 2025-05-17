# Project Management Application

This is a full-stack project management application that allows users to manage projects, tasks, and workflows. The application is built using modern web technologies, including React, TypeScript, Node.js, and Prisma.

---

## Features

- **User Authentication**: Register, login, and logout functionality with JWT-based authentication.
- **Project Management**: Create, view, update, and delete projects.
- **Task Management**: Manage tasks within projects, including task creation, updates, and deletion.
- **Kanban Board**: Visualize tasks in a Kanban-style board.
- **Gantt Chart**: View project timelines using a Gantt chart.

---

## Prerequisites

Ensure you have the following installed on your system:

1. **Node.js** (v16 or later) - [Download Node.js](https://nodejs.org/)
2. **npm** (comes with Node.js) or **yarn** (optional) - [Install Yarn](https://yarnpkg.com/)
3. **Git** - [Download Git](https://git-scm.com/)
4. **PostgreSQL** (or your preferred database) - Ensure the database is running locally or accessible remotely.
5. **Prisma CLI** (for database migrations) - Install globally using `npm install -g prisma`.
6. **Docker** (optional) - For running the application using Docker Compose.

---

## Getting Started

### 1. Clone the Repository

```powershell
# Clone the repository
git clone https://github.com/your-repo/project-management-app.git
cd project-management-app
```

### 2. Install Dependencies

Navigate to the `apps/backend` and `apps/frontend` directories and install dependencies:

#### Backend
```powershell
cd apps/backend
npm install
```

#### Frontend
```powershell
cd ../frontend
npm install
```

---

### 3. Set Up Environment Variables

Create `.env` files in the `apps/backend` and `apps/frontend` directories.

#### Backend `.env`
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:4000/api
```

---

### 4. Set Up the Database

Navigate to the `apps/backend` directory and run the following commands:

1. **Generate Prisma Client**:
   ```powershell
   npx prisma generate
   ```

2. **Run Migrations**:
   ```powershell
   npx prisma migrate dev --name init
   ```

3. **Seed the Database** (if applicable):
   ```powershell
   npx prisma db seed
   ```

---

### 5. Start the Application

#### Backend
Navigate to the `apps/backend` directory and start the server:

```powershell
npm run dev
```

The backend will run on `http://localhost:4000`.

#### Frontend
Navigate to the `apps/frontend` directory and start the development server:

```powershell
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

### 6. Access the Application

1. Open your browser and navigate to `http://localhost:5173`.
2. Use the application as intended.

---

### 7. Application Screenshots

Below are screenshots of the application to help you understand its functionality and user interface.

#### Landing Page
![Landing Page](Images/landing.png)

#### My Projects Page
![My Projects](Images/myprojects.png)

#### Add New Project Page
![Add New Project](Images/newprojects.png)

#### Add Tasks Page
![Add Tasks](Images/addtasks.png)

---

## Running with Docker

If you prefer to use Docker, you can run the application using Docker Compose:

1. Ensure Docker is installed and running on your system.
2. Run the following command in the root directory:

```powershell
docker-compose up --build
```

This will start both the backend and frontend services.

---

## Project Structure

```
project-management-app/
├── docker-compose.yml
├── apps/
│   ├── backend/
│   │   ├── prisma/          # Prisma schema and migrations
│   │   ├── src/             # Backend source code
│   │   │   ├── controllers/ # API controllers
│   │   │   ├── middleware/  # Middleware functions
│   │   │   ├── routes/      # API routes
│   │   │   ├── types/       # TypeScript types
│   │   ├── package.json     # Backend dependencies
│   ├── frontend/
│   │   ├── public/          # Static assets
│   │   ├── src/             # Frontend source code
│   │   │   ├── components/  # Reusable components
│   │   │   ├── contexts/    # React context providers
│   │   │   ├── pages/       # Application pages
│   │   │   ├── services/    # API service functions
│   │   ├── package.json     # Frontend dependencies
```

---

## Troubleshooting

- **Database Connection Issues**: Ensure your database is running and the `DATABASE_URL` in the `.env` file is correct.
- **Port Conflicts**: If ports `4000` or `5173` are in use, update the `PORT` in the backend or frontend configuration files.
- **Missing Dependencies**: Run `npm install` in both the `apps/backend` and `apps/frontend` directories.

---

## Additional Notes

- **Testing**: Run tests using `npm test` in the respective directories.
- **Linting**: Use `npm run lint` to check for code quality issues.
- **Build**: Use `npm run build` to create production builds.

For further assistance, refer to the project documentation or contact the maintainers.
