# Tamaliftics

Tamaliftics is a comprehensive fitness tracking application that helps users manage their workouts, track exercises, monitor diet, and record weight progress. The application provides a user-friendly interface for fitness enthusiasts to plan and track their fitness journey.

## Features

### User Authentication
- Secure login and registration
- JWT-based authentication

### Workout Management
- Create and manage workout plans
- Schedule workouts
- Track workout progress

### Exercise Tracking
- Browse exercise library
- Categorize exercises by muscle groups
- Track exercise performance and progress
- Record exercise track points

### Weight Tracking
- Record and visualize weight measurements
- Track weight progress over time
- Set weight goals

### Diet Management
- Track daily food intake
- Monitor nutritional information
- Plan meals

### Dashboard
- Overview of fitness progress
- Visual representations of key metrics
- Quick access to main features

## Technical Stack

### Frontend
- **Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.0.4
- **UI Library**: Mantine UI (v7.17.x)
- **Routing**: React Router 7.2.0
- **Charts**: Recharts 2.0.10
- **HTTP Client**: Axios 1.8.1
- **Form Handling**: Mantine Form
- **Date Handling**: Dayjs 1.11.13
- **Code Quality**: ESLint 9.30.1, Prettier 3.5.2

### Backend
- **Framework**: Spring Boot 3.3.5
- **Language**: Java 21
- **Database**: MySQL 8.0.28
- **ORM**: Spring Data JPA
- **Security**: Spring Security, JWT
- **API Documentation**: SpringDoc OpenAPI
- **Build Tool**: Maven

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- Java 21
- MySQL 8.0.28
- Maven

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Configure the database connection in `src/main/resources/application.properties` or `application.yml`

3. Build the application:
   ```
   mvn clean install
   ```

4. Run the application:
   ```
   mvn spring-boot:run
   ```

## Usage

### Authentication
1. Register a new account or log in with existing credentials
2. The system will provide a JWT token for authenticated requests

### Workout Management
1. Navigate to the Workout section
2. Create a new workout plan or select an existing one
3. Add exercises to your workout plan
4. Track your progress as you complete workouts

### Exercise Tracking
1. Browse the exercise library in the Exercises section
2. Filter exercises by category
3. Record your performance for each exercise
4. View your progress over time

### Weight Tracking
1. Navigate to the Weight section
2. Record your weight measurements
3. View your weight progress on the chart

### Diet Management
1. Navigate to the Diet section
2. Record your daily food intake
3. Monitor your nutritional information

## API Documentation
The API documentation is available at `http://localhost:8080/swagger-ui.html` when the backend is running.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
This project is licensed under the MIT License.
