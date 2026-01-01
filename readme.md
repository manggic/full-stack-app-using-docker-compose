
---

# 🚀 Full-Stack Secure Docker Deployment

This document explains how our application is built, secured with **SSL (HTTPS)**, and managed on the AWS server using **Docker**, **Nginx**, and **GitHub Actions**.

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

## 🤖 CI/CD Pipeline (The Robot Assistant)

We use **GitHub Actions** to automate our deployment. This means every time you "Push" code to GitHub, a "Robot" updates your AWS server for you.

### How the Automation Works:

1. **Trigger**: You push code to the `main` branch on GitHub.
2. **Login**: The robot uses a secret **SSH Key** (stored in GitHub Secrets) to log into your AWS server.
3. **Update**: The robot runs these commands on your server:
* `git pull`: Downloads the newest code.
* `docker compose up --build`: Rebuilds the boxes with the new changes.



---

## 🛡️ The Security Layer (Nginx & SSL)

We added a third service called `nginx-proxy`. This is our **Security Guard**.

### What Nginx is doing:

1. **SSL Handling**: It holds the **Let's Encrypt** certificates. It turns the red "Not Secure" warning into a **Green Padlock**.
2. **Traffic Direction**:
* If a user visits `docker.devder.site`, Nginx sends them to the **React Client**.
* If the app asks for `/api`, Nginx sends that request to the **Express Server**.



---

## 🚦 How to Run the Project

### 1. Set up GitHub Secrets

Before the "Robot" can work, you must add these to **GitHub Settings > Secrets > Actions**:

* `EC2_SSH_KEY`: The text inside your `.pem` file.
* `HOST`: Your AWS Public IP.
* `USERNAME`: `ubuntu`.

### 2. Prepare the Server

On the AWS server, create a `.env` file in the root folder:

```bash
echo "AWS_PUBLIC_IP=your_ip_here" > .env

```

### 3. Get the SSL Keys (One-time setup)

```bash
sudo certbot certonly --standalone -d docker.devder.site

```

### 4. Deploy

Just push your code!

```bash
git add .
git commit -m "Deploying my app"
git push origin main

```

---

## 🔄 The Flow of a Request

1. **User** types `https://docker.devder.site`.
2. **Nginx** greets them, shows the SSL Certificate (Port 443).
3. **Nginx** sees they want the homepage and passes the request to the **React Container**.
4. **React** sends a message to `/api`.
5. **Nginx** sees the `/api` part and passes it to the **Express Container**.

---

## 📊 Summary of the Setup

| Part | Role | Port |
| --- | --- | --- |
| **Nginx** | Security Guard (SSL & Routing) | 80, 443 |
| **React** | The Visual Interface (Website) | 8080 |
| **Express** | The Data Brain (API) | 4000 |
| **GitHub Actions** | The Deployment Robot | N/A |

---
