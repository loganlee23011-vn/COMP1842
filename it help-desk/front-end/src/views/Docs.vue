<template>
  <div class="landing-page docs-page">
    <LandingNavbar />

    <main class="docs-main">
      <section class="docs-hero">
        <div class="landing-container">
          <span class="badge">Documentation</span>
          <h1>Setup and Run Guide</h1>
          <p>
            Follow these steps from top to bottom after cloning the repository. This page is written so another person can pull the code and run the project successfully.
          </p>
        </div>
      </section>

      <section class="docs-content">
        <div class="landing-container docs-grid">
          <article class="docs-card wide">
            <h2>1. Clone the Project from Git</h2>
            <p>Open a terminal and clone the repository to your machine.</p>
            <p>
              Repository:
              <a
                href="https://github.com/loganlee23011-vn/COMP1842-web2"
                target="_blank"
                rel="noreferrer"
              >https://github.com/loganlee23011-vn/COMP1842-web2</a>
            </p>
            <pre><code>git clone git@github.com:loganlee23011-vn/COMP1842-web2.git
cd vocab-buider</code></pre>
            <p>After cloning, make sure the project contains two main folders:</p>
            <ul>
              <li><code>server</code> for Express, MongoDB, Mongoose, JWT, and API routes</li>
              <li><code>front-end</code> for the Vue user interface</li>
            </ul>
          </article>

          <article class="docs-card">
            <h2>2. Software Required</h2>
            <ul>
              <li>Node.js LTS</li>
              <li>npm</li>
              <li>MongoDB Community Server</li>
              <li>Git</li>
              <li>VS Code or another code editor</li>
            </ul>
            <pre><code>node -v
npm -v
git --version</code></pre>
          </article>

          <article class="docs-card">
            <h2>3. Install Backend Packages</h2>
            <p>Open a terminal inside the <code>server</code> folder and install all dependencies.</p>
            <pre><code>cd server
npm install</code></pre>
            <p>The backend packages used in this project include:</p>
            <ul>
              <li><code>express</code></li>
              <li><code>mongoose</code></li>
              <li><code>cors</code></li>
              <li><code>body-parser</code></li>
              <li><code>jsonwebtoken</code></li>
              <li><code>dotenv</code></li>
              <li><code>nodemon</code></li>
            </ul>
          </article>

          <article class="docs-card">
            <h2>4. Install Frontend Packages</h2>
            <p>Open another terminal inside the <code>front-end</code> folder and install the Vue dependencies.</p>
            <pre><code>cd front-end
npm install</code></pre>
            <p>The frontend uses Vue, Vue Router, Axios, and Semantic UI CSS.</p>
          </article>

          <article class="docs-card wide">
            <h2>5. Configure the Backend Environment</h2>
            <p>Before starting the server, create the environment file inside the <code>server</code> folder.</p>
            <p>If the file already exists, check that the values are correct. If it does not exist, copy from <code>.env.example</code>.</p>
            <pre><code>MONGODB_URI=mongodb://localhost/vocab-builder
JWT_SECRET=change-this-secret-for-coursework
PORT=3000</code></pre>
            <p>What these values do:</p>
            <ul>
              <li><code>MONGODB_URI</code> tells Mongoose which MongoDB database to connect to</li>
              <li><code>JWT_SECRET</code> is used to sign and verify login tokens</li>
              <li><code>PORT</code> is the backend server port</li>
            </ul>
          </article>

          <article class="docs-card">
            <h2>6. Start MongoDB</h2>
            <p>MongoDB must be running before the Express server starts, otherwise the backend cannot connect to the database.</p>
            <p>The project uses this database:</p>
            <pre><code>mongodb://localhost/vocab-builder</code></pre>
          </article>

          <article class="docs-card">
            <h2>7. Start the Backend Server</h2>
            <pre><code>cd server
npm start</code></pre>
            <p>If successful, the server should connect to MongoDB and run on:</p>
            <pre><code>http://localhost:3000</code></pre>
          </article>

          <article class="docs-card">
            <h2>8. Start the Frontend Server</h2>
            <pre><code>cd front-end
npm run serve</code></pre>
            <p>The Vue app should run on:</p>
            <pre><code>http://localhost:8080</code></pre>
          </article>

          <article class="docs-card">
            <h2>9. Basic Run Checklist</h2>
            <ol>
              <li>Open <code>http://localhost:8080</code></li>
              <li>Landing page should load</li>
              <li>Open <code>Docs</code> and <code>Login</code></li>
              <li>Register a user account</li>
              <li>Login successfully</li>
              <li>Create a helpdesk response entry</li>
              <li>Open library, reports, and quiz pages</li>
            </ol>
          </article>

          <article class="docs-card">
            <h2>10. Example Data You Can Add</h2>
            <ul>
              <li><code>PWD_RESET</code> -> Ask the user to use the reset link and confirm their email address.</li>
              <li><code>BILLING_LATE</code> -> Advise of the grace period and provide the payment link.</li>
              <li><code>VPN_ACCESS</code> -> Check MFA and resend the VPN setup steps.</li>
            </ul>
          </article>

          <article class="docs-card wide">
            <h2>11. Common Problems and Fixes</h2>
            <ul>
              <li>If <code>npm install</code> fails, check Node.js and npm are installed correctly.</li>
              <li>If Vue shows <code>Network Error</code>, check the backend server is actually running on port <code>3000</code>.</li>
              <li>If the backend crashes at startup, check the <code>server/.env</code> file exists and MongoDB is running.</li>
              <li>If protected pages redirect to login, the JWT token may be missing, expired, or invalid.</li>
              <li>If the library does not load data, confirm MongoDB contains records and the API server has connected successfully.</li>
            </ul>
          </article>
        </div>
      </section>
    </main>

    <LandingFooter />
  </div>
</template>

<script>
import '../assets/landing.css'
import LandingFooter from '../components/landing/LandingFooter.vue'
import LandingNavbar from '../components/landing/LandingNavbar.vue'

export default {
  name: 'DocsView',
  components: {
    LandingNavbar,
    LandingFooter,
  },
}
</script>

<style scoped>
.docs-main {
  min-height: calc(100vh - 160px);
}

.docs-hero {
  padding: 72px 0 28px;
  background:
    linear-gradient(rgba(37, 84, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 84, 255, 0.05) 1px, transparent 1px);
  background-size: 44px 44px;
}

.docs-hero h1 {
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 60px);
  margin: 16px 0 10px;
}

.docs-hero p {
  max-width: 720px;
  color: var(--clr-muted);
  line-height: 1.8;
}

.docs-content {
  padding: 28px 0 72px;
  background: linear-gradient(180deg, #f7f6f2 0%, #ffffff 16%, #ffffff 100%);
}

.docs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  max-width: 880px;
}

.docs-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 24px;
}

.docs-card.wide {
  grid-column: auto;
}

.docs-card h2 {
  margin: 0 0 12px;
}

.docs-card p,
.docs-card li {
  color: var(--clr-muted);
  line-height: 1.7;
}

.docs-card a {
  color: #2554ff;
  text-decoration: none;
}

.docs-card a:hover {
  text-decoration: underline;
}

.docs-card ul,
.docs-card ol {
  margin: 0;
  padding-left: 20px;
}

.docs-card pre {
  margin: 12px 0 0;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  overflow: auto;
}

.docs-card code {
  font-family: Consolas, monospace;
}

</style>
