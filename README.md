### CoffeeCan Backend

### Overview
CoffeeCan's Backend is a Node JS + Express + Typescript server following the Model-View-Controller pattern. Database used for main storage is MongoDB and the search database is Algolia.  Both these databases are managed and provided by the companies backing these technologies. Deployment is handled through containerization with Docker and endpoint configuration is done using Nginx

### Requirements
Node.js v14 or later
npm v6 or later
Getting Started
Clone the repository:

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```

```bash
### Install dependencies:
npm install
```

Run the development server:
```
npm run start
```
This will start the server on http://localhost:3000 and automatically restart it whenever you make changes to the code.

Build and run for production:
```
npm run build
npm serve
````
This will build the TypeScript code to JavaScript and start the server.

### Project Structure
The project is structured as follows:
```
src/
├── controllers/    # Controller functions for handling requests
├── models/         # Data models and interfaces
├── routes/         # Express routes for defining API endpoints
├── scripts/          # Useful scripts for data transformation and processing
├── index.ts          # Express app setup and Server entry point
nginx.conf - Configuration file for the HTTP server

### Environment Variables
The following environment variables can be set to configure the application:

MONGO_URI - ....
ALGOLIA_APP_ID - ....
ALGOLIA_APP_ID - .....
Environment variables can be set by creating a .env file in the root of the project, following the format of .env.example.


### Deployments
This code is Dockerized using nodejs image as per the instructions in `Dockerfile` and then served at port 3000. Then an nginx reverse proxy is used to serve it over port 80 and 443 (HTTP and HTTPS) as an API to all interacting services.
The MongoDB database is a cloud managed database provided by the company itself and is network blocked to accept API requests only from the serving machine's IP address

### Contributing
Contributions are welcome! If you find a bug or have an idea for a new feature, feel free to open an issue or submit a pull request.
