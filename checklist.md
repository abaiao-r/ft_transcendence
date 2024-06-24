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
   - Open a web browser and navigate to the provided URL.
   - Ensure the website loads without errors.

### User Registration
4. **Test user registration:**
   - Navigate to the registration page.
   - Fill out the registration form with a valid email and strong password.
   - Submit the form and check for a successful registration message.
   - Verify email format validation by entering an invalid email and checking for an error message.
   - Test password strength validation by entering a weak password and checking for an error message.

### User Login
5. **Test user login:**
   - Navigate to the login page.
   - Enter valid user credentials and submit the form.
   - Ensure successful login and redirection to the dashboard or homepage.
   - Test incorrect login by entering invalid credentials and checking for an error message.

### Single Page Application (SPA)
6. **Verify SPA behavior:**
   - Navigate to different pages within the website.
   - Ensure the page content updates without a full page reload.
   - Use the browser's back and forward buttons to navigate between pages and ensure content updates correctly.

### Cross-Browser Compatibility
7. **Check compatibility with Chrome:**
   - Open the website in the latest version of Google Chrome.
   - Navigate through different pages and features to ensure everything works as expected.

## Security Concerns

### TLS/HTTPS
8. **Verify HTTPS setup:**
   - Ensure the website is accessible over HTTPS by checking the URL starts with "https://".
   - Click on the padlock icon in the address bar to view the TLS certificate details.
   - Confirm the certificate is valid and not expired.

### Password Security
9. **Check password hashing:**
   - Register a new user and check the database to ensure passwords are stored as hashed values, not plain text.
   - Verify the use of a strong hashing algorithm like bcrypt or Argon2.

### Input Validation and Sanitization
10. **Test input validation:**
    - Submit forms with invalid data (e.g., SQL injection attempts, XSS scripts).
    - Ensure the server-side validation catches and sanitizes these inputs.
    - Check that error messages are displayed appropriately for invalid inputs.

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

