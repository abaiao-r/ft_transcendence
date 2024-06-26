// website with login, 2fa and 42 login where we can play local pong against ai or guest players. Frontend in vannila js, html, css and bootstrap. Backend django, database postgresql. used docker for deployment.

# Project Evaluation Checklist

## Preliminary Setup

### .env File Configuration
1. **Verify .env file presence and configuration:**
   - Open the repository and check for the `.env` file at the root.
   - Open the `.env` file and confirm it contains all necessary credentials, API keys, and environment variables.
   - Ensure no credentials are hardcoded in the codebase by searching for keywords like "password", "apikey", "secret", etc.

### Docker Configuration
2. **Check Docker setup:**
   - Ensure the `docker-compose.yml` file is at the root of the repository.
   - Run the command `docker-compose up --build` in the terminal.
   - Observe the build process for any errors or warnings.
   - Ensure the application starts successfully without crashing.

## Basic Checks

### Website Availability
3. **Check website access:**
   Test cases 1:
   - Open a web browser and navigate to the website URL.
   - Verify the website loads correctly without any errors.
   
   Test cases 2:
   - Open the website in a private or incognito window to check for any caching issues.
   - Ensure the website loads correctly in the private window as well.

### User Registration
4. **Test user registration:**
   Test cases 1:
   - Navigate to the registration page.
   - Fill out the registration form with valid user details.
   - Submit the form and check for successful registration.

   Test cases 2:
   - Attempt to register with an existing email address or username.
   - Verify the application displays an appropriate error message.

   Test cases 3:
   - Submit the registration form with invalid data (e.g., missing fields, incorrect email format).
   - Ensure the application validates the inputs and displays relevant error messages.

   Test cases 4:
   - Submit the registration with js or sql injection.
   - Ex: `username: <script>alert('XSS')</script>`
   - Ensure the application sanitizes the inputs and displays relevant error messages.

### User Login
5. **Test user login:**
   Test cases 1:
   - Navigate to the login page.
   - Enter valid credentials and log in.
   - Verify the application redirects to the user dashboard or home page.

   Test cases 2:
   - Attempt to log in with invalid credentials.
   - Ensure the application displays an appropriate error message.

   Test cases 3:
   - Attempt to log in with a valid username and incorrect password.
   - Verify the application displays an appropriate error message.

   Test cases 4:
   - Attempt to log in with a valid username and sql injection in password.
   - Ex: `password: ' OR 1=1 --`
   - Ensure the application sanitizes the inputs and displays relevant error messages.

### Single Page Application (SPA)
6. **Verify SPA behavior:**
   Test cases 1:
   - Navigate through different pages and sections of the website.
   - Check if the website behaves like a single-page application (SPA) with smooth transitions and dynamic content loading.

   Test cases 2:
   - Refresh the page or navigate directly to a specific URL.
   - Ensure the application loads the correct content and maintains the SPA behavior.

   Test cases 3:
   - Use the browser's back and forward buttons to navigate through the website.
   - Verify the application updates the content dynamically without full page reloads.

## User Interface and Design

### Cross-Browser Compatibility
7. **Check compatibility with Chrome:**
   Test cases 1:
   - Open the website in the Google Chrome browser.
   - Ensure all elements are displayed correctly and the website functions as expected.

   Test cases 2:
   - Open the website in other popular browsers (e.g., Firefox, Safari, Edge).
   - Verify the website's compatibility and functionality across different browsers.


## Security Concerns

### TLS/HTTPS
8. **Verify HTTPS setup:**
   Test cases 1:
   - Open the website in a web browser and check for a secure connection (https://).
   - Verify the presence of a valid SSL certificate.

   Test cases 2:
   - Attempt to access the website using an insecure connection (http://).
   - Ensure the application redirects to the secure (https://) version of the website.

   Test cases 3:
   - Use online tools like SSL Labs to scan the website for SSL/TLS configuration issues.
   - Ensure the website receives a good rating for its SSL/TLS setup.


### Password Security
9. **Check password hashing:**
   Test cases 1:
   - Register a new user and check the database for the stored password.
   - Verify that the password is hashed and not stored in plain text by searching for keywords like "password" in the database. Ex in django look for: User.objects.create_user(username='john', 'john@example.com`, 'password')


### Input Validation and Sanitization
10. **Test input validation:**
   Test cases 1:
   - Submit forms with valid inputs and check if the application accepts them.
   - Verify that the application validates inputs correctly and does not allow invalid data to be submitted.

   Test cases 2:
   - Submit forms with invalid inputs (e.g., incorrect formats, special characters).
   - Ensure the application displays relevant error messages and prevents submission of invalid data.
   

### Error Handling
11. **Check for unhandled errors:**
    - Navigate through the website and intentionally trigger potential error scenarios (e.g., invalid form submissions, accessing non-existent pages).
    - Ensure the application handles these errors gracefully and does not crash.

## Game Functionality

### Local Game Playability
12. **Test local game controls:**
    - Start a local game and check if both players can control their paddles using different sections of the keyboard.
    - Verify that player movements are responsive and match key presses.

### Tournament Matchmaking
13. **Test tournament initiation and matchmaking:**
    - Start a new tournament and enter aliases for multiple players.
    - Verify the matchmaking system correctly pairs players for matches.
    - Check that the tournament progresses through rounds as players win or lose.

### Game Rules and Controls
14. **Verify game replication and controls:**
    - Play a game to ensure it replicates the original Pong experience (e.g., paddle movement, ball physics).
    - Check for an end-game screen or message when a game concludes.
    - Ensure any game rules or controls are clearly explained or documented.

### Lag and Disconnection Handling
15. **Test lag and disconnection scenarios:**
    - Simulate a lag by intentionally slowing down the network connection.
    - Ensure the game handles lag without crashing (e.g., pauses the game, allows players to catch up).
    - Disconnect and reconnect a player to ensure the game resumes correctly without crashing.

## Module-Specific Tests

### Major Module 01 (example: AI Opponent)
16. **Verify AI opponent functionality:**
    - Play a game against the AI opponent to ensure it provides a challenging experience.
    - Check that the AI simulates human behavior and anticipates moves as required.

17. **Explain AI module:**
    - Prepare a detailed explanation of the AI opponent's implementation, including its logic and decision-making processes.

### Additional Modules (if implemented)
18. **Verify additional minor modules:**
    - Test the functionality of any additional minor modules, such as User and Game Stats Dashboards, by navigating to the relevant sections and checking for expected behavior.
    - Ensure dashboards display accurate and relevant st

