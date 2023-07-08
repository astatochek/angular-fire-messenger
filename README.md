# Messenger Installation Guide

This guide provides step-by-step instructions to install the Messenger application developed using Angular, Python, Java Spring, and Keycloak 19.0.3.

## Prerequisites

Before proceeding with the installation, ensure that you have the following prerequisites installed on your system:

- Node.js (v18 or higher)
- Python (v3.10 or higher)
- Java Development Kit (JDK) (v17 or higher)
- Keycloak 19.0.3

## Installation Steps

Please follow the steps below to install and configure the Messenger application:

1. Clone the repository:
   ```shell
   git clone https://github.com/astatochek/mm-messenger-project
   ```

2. Install frontend dependencies:
   ```shell
   cd webapp
   npm install
   ```
   You might need to use flag `--force`

3. Install backend dependencies:
   ```shell
   cd server/avatars
   pip install -r requirements.txt
   ```

4. Configure Keycloak:
   - Install Keycloak 19.0.3 following the instructions provided by the Keycloak documentation.
   - Once Keycloak is installed, start the Keycloak server.
   - Access the Keycloak admin console in your web browser (e.g., http://localhost:8080/auth/admin).
   - Log in using your admin credentials.
   - Create a new realm with the name "test":
     - Click on the "Master" dropdown on the top-left corner and select "Add realm".
     - Enter "test" as the name and click "Create".
   - Create a new client named "client":
     - Navigate to the "Clients" section in the sidebar and click "Create".
     - Enter "client" as the Client ID and click "Save".
     - Configure the "Access Type" and other settings according to your requirements.
     - Make sure to set the "Valid Redirect URIs" and "Web Origins" to match your deployment environment.
     - Generate and note down the "Client Secret" for future use.

5. Update the Client Secret:
   - Open the file `server/src/main/java/com/example/keycloaktest/service/KeycloakService.java` in a text editor.
   - Locate the line that sets the client secret and replace the placeholder with the actual client secret obtained from Keycloak.
   - Save the file.

## Usage

To start the Messenger application, follow the steps below:

1. Start the backend python server:
   ```shell
   cd server/avatars
   python app.py
   ```

2. Start the backend spring development server in any IDE of your choice:
   ```shell
   cd server
   ```

3. Start keycloak server (use official documantation):
   
4. Start the frontend development server:
   ```shell
   cd webapp
   ng serve
   ```

5. Access the Messenger application in your web browser:
   ```shell
   http://localhost:4200
   ```

## Conclusion

You have successfully installed and configured the Messenger application with Keycloak integration. Now you can use the Messenger to communicate with your contacts securely. Enjoy messaging!
