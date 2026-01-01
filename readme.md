---

# 🚀 Full-Stack Secure Docker Deployment

This document explains how our application is built, secured with **SSL (HTTPS)**, and managed on the AWS server using **Docker** and **Nginx**.

---

## 🏗️ The Architecture (The Big Picture)

Our app uses a **Reverse Proxy** design. Instead of users talking to our React or Express apps directly, they talk to **Nginx**, which acts as a secure front gate.

---

## 🛠️ How the Dockerfiles Work

### 1. The Server (Backend)

* **Instruction**: `server/Dockerfile`
* **What it does**: Creates a box containing Node.js 22. It installs your libraries and starts the Express engine.
* **Internal Port**: It listens on **4000**.

### 2. The Client (Frontend) - "The Multi-Stage Bake"

* **Instruction**: `client/Dockerfile`
* **Stage 1 (Builder)**: Takes the React code and the **HTTPS URL** (`VITE_API_URL`). It "bakes" that URL directly into the JavaScript code.
* **Stage 2 (Production)**: Throws away the heavy build tools and puts only the tiny "baked" files into a high-speed Nginx web server.

---

## 🛡️ The Security Layer (Nginx & SSL)

We added a third service called `nginx-proxy`. This is our **Security Guard**.

### What Nginx is doing:

1. **SSL Handling**: It holds the **Let's Encrypt** certificates (the "keys"). It turns the red "Not Secure" warning into a **Green Padlock**.
2. **Traffic Direction**:
* If a user visits `docker.devder.site`, Nginx sends them to the **React Client**.
* If the app asks for `/api`, Nginx sends that request to the **Express Server**.


3. **The Automatic Redirect**: If someone tries to visit the old `http` (Port 80), Nginx automatically pushes them to the secure `https` (Port 443).

### The Magic Tunnels (Volumes):

In the `docker-compose.yml`, we built two tunnels:

* **Keys Tunnel**: Links the server's secret keys folder (`/etc/letsencrypt`) to Nginx.
* **Rules Tunnel**: Links our `nginx.conf` file to Nginx so it knows the "Rules of the House."

---

## 🚦 How to Run the Project

### 1. Prepare the Secret Note (`.env`)

On the AWS server, create a `.env` file in the root folder:

```bash
echo "AWS_PUBLIC_IP=13.233.255.52" > .env

```

### 2. Get the SSL Keys (One-time setup)

We use **Certbot** in "Standalone" mode to talk to the internet and get our certificates:

```bash
sudo certbot certonly --standalone -d docker.devder.site

```

### 3. Start the Whole Team

Run this command to build the boxes and start the guard:

```bash
sudo docker compose up -d --build

```

---

## 🔄 The Flow of a Request

1. **User** types `https://docker.devder.site`.
2. **AWS Security Group** allows the person in through Port 443.
3. **Nginx** greets them, shows the SSL Certificate, and checks the `nginx.conf`.
4. **Nginx** sees they want the homepage and passes the request to the **React Container** inside the private `fullstask-net`.
5. **React** sends a message to `https://docker.devder.site/api`.
6. **Nginx** sees the `/api` part and passes it to the **Express Container**.

---

## 📊 Summary of the Setup

| Part | Role | Port |
| --- | --- | --- |
| **Nginx** | Security Guard (SSL & Routing) | 80, 443 |
| **React** | The Visual Interface (Website) | 8080 |
| **Express** | The Data Brain (API) | 4000 |
| **Certbot** | The Key Maker (SSL Certificates) | N/A |

---

