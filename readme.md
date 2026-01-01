
# Full-Stack Docker Deployment Documentation

## 🚀 The Deployment Lifecycle

This document outlines the step-by-step process of how our application was built, orchestrated, and executed on the AWS Ubuntu server.

---

## Step 1: The "Launch" Command

The deployment started with the following command:
`sudo docker compose up -d --build`

* **`--build`**: Instructs Docker to ignore old images and create fresh ones. This ensures code changes (like the updated API URL) are included.
* **`-d` (Detached)**: Runs the containers in the background. This allows the application to stay online even after the SSH session is closed.

---

## Step 2: Building the Backend (Server)

Docker follows the instructions in the `server/Dockerfile` to create the API image:

1. **Base Layer**: Pulls `node:22-alpine` to provide a lightweight Linux OS with Node.js pre-installed.
2. **Dependencies**: Runs `npm install` inside the container to build the node_modules folder.
3. **Code Injection**: Copies the Express.js source code into the image.
4. **Final Result**: A standalone image capable of running the API on **Port 4000**.

---

## Step 3: Building the Frontend (The "Bake")

The `client/Dockerfile` uses a **Multi-stage Build** to optimize size and security:

1. **Preparation**: In the `builder` stage, Docker receives `VITE_API_URL` from the docker Compose `args`.
2. **The Injection**: The variable is set as an `ENV`. During `RUN npm run build`, **Vite** searches the React code and physically replaces `import.meta.env.VITE_API_URL` with `http://your-ip:4000`.
3. **The Cleanup**: Docker discards the heavy Node.js environment and copies **only** the static `/dist` folder into a lightweight **Nginx** image.

---

## Step 4: Orchestration (The Setup)

Docker Compose acts as the "Manager" to coordinate the containers:

* **Networking**: Creates `fullstask-net`, a private virtual bridge allowing containers to communicate.
* **Service Sequencing**:
* Starts `express-server` first.
* Starts `react-client` only after the server is ready (via `depends_on`).


* **Port Mapping**: Opens "tunnels" from the AWS Public IP to the containers:
* **Port 8080** → Maps to Client Container (Port 80).
* **Port 4000** → Maps to Server Container (Port 4000).



---

## Step 5: Runtime Execution

Once the system is live, the data flow follows this path:

1. **Client Load**: The user visits `http://your-ip:8080`. Nginx serves the "baked" `index.js` to the user's browser.
2. **Browser Execution**: The user's browser (not the server) executes the React code.
3. **The API Call**: React sees the hardcoded URL `http://your-ip:4000` and sends a request from the **user's computer** to the AWS server.
4. **Backend Response**: The Express server processes the request and returns JSON data to the user.

---

## Summary of Benefits

| Feature | Benefit |
| --- | --- |
| **Portability** | The app runs identically on AWS, Azure, or local machines. |
| **Security** | Source code is hidden; users only interact with compiled assets. |
| **Efficiency** | The frontend container is ~50MB (Alpine + Nginx), saving server resources. |

---
