<template>
  <header class="landing-navbar">
    <div class="landing-container landing-navbar__inner">
      <RouterLink to="/" class="landing-brand">IT <span>Helply</span></RouterLink>

      <nav class="landing-links">
        <a href="#features">Features</a>
        <a href="#preview">Preview</a>
        <RouterLink :to="{ name: 'docs' }">Docs</RouterLink>
        <RouterLink :to="{ name: 'contact' }">Contact</RouterLink>
      </nav>

      <div class="landing-actions">
        <RouterLink class="btn btn-ghost" :to="{ name: 'login' }">Login</RouterLink>
        <RouterLink class="btn btn-primary" :to="{ name: 'register' }">Start Free</RouterLink>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'LandingNavbar',
}
</script>

<style scoped>
.landing-navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 72px;
  background: rgba(247, 246, 242, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--clr-border);
  display: flex;
  align-items: center;
}

.landing-navbar__inner {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
}

.landing-brand {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--clr-text);
  text-decoration: none;
}

.landing-brand span {
  color: var(--clr-accent);
}

.landing-links {
  display: flex;
  align-items: center;
  gap: 18px;
  flex: 1;
}

.landing-links a,
.landing-links :deep(a) {
  color: var(--clr-muted);
  text-decoration: none;
}

.landing-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 900px) {
  .landing-navbar {
    height: auto;
    padding: 14px 0;
  }

  .landing-navbar__inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .landing-links,
  .landing-actions {
    flex-wrap: wrap;
  }
}
</style>
