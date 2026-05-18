# Frontend Java Project

This project is a web application that combines a frontend built with HTML, CSS, and JavaScript, and a backend developed in Java. The application is designed to facilitate reservations for travel services.

## Project Structure

```
frontend-java-project
├── frontend
│   ├── index.html
│   ├── css
│   │   └── reserva.css
│   └── js
│       └── app.js
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── Main.java
│   │   └── resources
│   │       └── application.properties
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── MainTest.java
├── pom.xml
└── README.md
```

## Features

- **Frontend**: 
  - A responsive homepage with a hero section, destination cards, service offerings, and a footer.
  - A reservation page with a structured form for travel and passenger data, preferences, and comments.

- **Backend**: 
  - A Java application that handles business logic and data processing.
  - Configuration properties for easy management of application settings.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   ```

2. **Navigate to the project directory**:
   ```
   cd frontend-java-project
   ```

3. **Frontend Setup**:
   - Open the `frontend/index.html` file in a web browser to view the homepage.
   - The CSS and JavaScript files are linked and will provide styling and functionality.

4. **Backend Setup**:
   - Ensure you have Java and Maven installed.
   - Navigate to the `src/main/java/com/example` directory and run the `Main.java` file to start the backend application.

5. **Testing**:
   - Unit tests are located in `src/test/java/com/example/MainTest.java`. Run these tests to ensure the backend functionality works as expected.

## Future Development

- Implement additional features such as user authentication and payment processing.
- Enhance the frontend with more interactive elements and improved styling.
- Expand the backend to handle more complex business logic and data storage.

## Acknowledgments

This project is a collaborative effort aimed at providing a seamless travel reservation experience. Thank you for your interest and contributions!