# Helpdesk Response Library

A full-stack CRUD application built with:

- `Node.js` + `Express`
- `MongoDB` + `Mongoose`
- `Vue 3` + `Vue Router`

This project was adapted from a key/value CRUD lab into a small business scenario: a **Helpdesk Response Library**. Each record stores:

- `key`: issue code, for example `PWD_RESET`
- `response`: the standard helpdesk response text
- `category`: department or support category, for example `Security` or `Billing`

The system also includes:

- CRUD pages for helpdesk entries
- A dashboard page
- A staff training quiz
- Login and register form pages
- Search and category filtering

## 1. Requirements

Before running the project, install these tools:

- [Node.js](https://nodejs.org/) (recommended: LTS version)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- `npm` (comes with Node.js)

## 2. Download The Source Code

If using GitHub:

```bash
git clone <your-github-repository-url>
cd vocab-buider
```

If the project was shared as a ZIP file:

1. Extract the ZIP file
2. Open the extracted `vocab-buider` folder in VS Code

## 3. Install Dependencies

This project has **two separate parts**:

- `server`
- `front-end`

Open a terminal in the project folder and install both.

### Install the server packages

```bash
cd server
npm install
```

### Install the front-end packages

Open a new terminal:

```bash
cd front-end
npm install
```

## 4. Start MongoDB

Make sure MongoDB is running on your machine before starting the server.

The server currently connects to:

```text
mongodb://localhost/vocab-builder
```

If MongoDB is not running, the backend will fail to load data.

## 5. Run The Project

You need **two terminals**.

### Terminal 1: Run the backend server

```bash
cd server
npm start
```

The API runs on:

```text
http://localhost:3000
```

### Terminal 2: Run the Vue front end

```bash
cd front-end
npm run serve
```

The front end normally runs on:

```text
http://localhost:8080
```

## 6. How To Use The System

After both parts are running:

1. Open `http://localhost:8080`
2. Go to `Dashboard` to see the overview page
3. Go to `Library` to view all helpdesk response entries
4. Click `New Entry` to create a new issue code and response
5. Use `Show`, `Edit`, and `Destroy` to manage entries
6. Go to `Training Quiz` to test staff knowledge
7. Open `Login` and `Register` to view the authentication forms

## 7. Example Data

You can create example records such as:

- `PWD_RESET`
  Response: `Ask the user to use the reset link and confirm their email address.`
  Category: `Security`
- `BILLING_LATE`
  Response: `Advise of the grace period and provide the payment link.`
  Category: `Billing`
- `VPN_ACCESS`
  Response: `Check whether the user is enrolled in MFA and resend the VPN setup steps.`
  Category: `Network`

## 8. Notes

- The Login and Register pages are currently **front-end forms only**.
- They are not yet connected to a real authentication backend or user database.
- If you want full authentication, you would need to add:
  - a user model
  - password hashing
  - login/register API routes
  - session or token handling

## 9. Common Problems

### `npm install` fails

Make sure Node.js is installed correctly:

```bash
node -v
npm -v
```

### MongoDB connection error

Make sure MongoDB is started before running the backend.

### Front-end shows no data

Check:

- the backend server is running on port `3000`
- MongoDB is running
- the front-end is running on port `8080`

### Vue shows old errors in VS Code

Try:

1. Save all files
2. Restart the Vue dev server
3. Run `Developer: Reload Window` in VS Code

## 10. Project Structure

```text
vocab-buider/
├── server/
│   ├── api/
│   ├── server.js
│   └── package.json
├── front-end/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vue.config.js
└── README.md
```
