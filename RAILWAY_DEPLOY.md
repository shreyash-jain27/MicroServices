# 🛤️ Deploying Service Hub to Railway

This project is structured as a monorepo. To deploy it to Railway, follow these steps to set up each microservice and their respective databases.

## 1. Prerequisites
- A [Railway](https://railway.app/) account.
- This project pushed to a GitHub repository.

## 2. Create a New Project
1. Log in to Railway and click **"New Project"**.
2. Select **"Deploy from GitHub repo"** and choose your repository.

## 3. Provision Databases
Before configuring the services, add the required managed databases:
1. In your project, click **"Add Service"** -> **"Database"** -> **"MongoDB"**.
2. Click **"Add Service"** -> **"Database"** -> **"Redis"**.

## 4. Set Up Microservices
You need to create 4 separate services in Railway, all pointing to the same repository but using different Dockerfiles.

### A. API Gateway (Entry Point)
1. Click **"Add Service"** -> **"GitHub Repo"** -> Select your repo.
2. **Settings**:
   - **Service Name**: `gateway`
   - **Root Directory**: `/`
   - **Dockerfile Path**: `services/gateway/Dockerfile`
3. **Variables**:
   - `PORT`: `3000`
   - `JWT_ACCESS_SECRET`: (Generate a secure string)
   - `AUTH_SERVICE_URL`: `http://auth:3001`
   - `CHAT_SERVICE_URL`: `http://chat:3002`
   - `NOTIFICATION_SERVICE_URL`: `http://notification:3003`

### B. Auth Service
1. Click **"Add Service"** -> **"GitHub Repo"** -> Select your repo.
2. **Settings**:
   - **Service Name**: `auth`
   - **Root Directory**: `/`
   - **Dockerfile Path**: `services/auth/Dockerfile`
3. **Variables**:
   - `PORT`: `3001`
   - `JWT_ACCESS_SECRET`: (Same as Gateway)
   - `JWT_REFRESH_SECRET`: (Generate a secure string)
   - `MONGODB_URI`: `${{MongoDB.MONGODB_URL}}` (Select from reference)
   - `REDIS_URL`: `${{Redis.REDIS_URL}}` (Select from reference)

### C. Chat Service
1. Click **"Add Service"** -> **"GitHub Repo"** -> Select your repo.
2. **Settings**:
   - **Service Name**: `chat`
   - **Root Directory**: `/`
   - **Dockerfile Path**: `services/chat/Dockerfile`
3. **Variables**:
   - `PORT`: `3002`
   - `MONGODB_URI`: `${{MongoDB.MONGODB_URL}}`
   - `REDIS_URL`: `${{Redis.REDIS_URL}}`
   - `JWT_ACCESS_SECRET`: (Same as Gateway)

### D. Notification Service
1. Click **"Add Service"** -> **"GitHub Repo"** -> Select your repo.
2. **Settings**:
   - **Service Name**: `notification`
   - **Root Directory**: `/`
   - **Dockerfile Path**: `services/notification/Dockerfile`
3. **Variables**:
   - `PORT`: `3003`
   - `REDIS_URL`: `${{Redis.REDIS_URL}}`
   - `SMTP_HOST`: (Your email provider host)
   - `SMTP_USER`: (Your email)
   - `SMTP_PASS`: (Your app password)

## 5. Important Configuration
- **Internal Networking**: The `AUTH_SERVICE_URL` etc., in the Gateway should use the Railway service names (e.g., `http://auth:3001`). Railway handles the internal DNS.
- **Health Checks**: Each service has a health check defined in its Dockerfile. Railway will automatically use these.
- **Common Package**: Since the Dockerfiles are run from the root, the `@service-hub/common` package will be correctly built and included in each service.

## 6. Deployment Tip
If you have the Railway CLI installed, you can link the project locally:
```bash
railway link
```
Then you can push changes directly:
```bash
git push origin main
```
Railway will automatically trigger builds for all services.
