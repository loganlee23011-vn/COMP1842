<template>
  <footer id="footer" class="landing-footer">
    <div class="landing-container landing-footer__inner">
      <div class="landing-footer__brand">IT <span>Helply</span></div>
      <ul class="landing-footer__links">
        <li><a href="#features">Features</a></li>
        <li><a href="#preview">Preview</a></li>
        <li><RouterLink :to="{ name: 'register' }">Create account</RouterLink></li>
      </ul>
      <p class="landing-footer__copy">&#169; 2026 IT Helply Coursework Demo</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'LandingFooter',
}
</script>

<style scoped>
.landing-footer {
  border-top: 1px solid var(--clr-border);
  padding: 40px 0 28px;
  background: var(--clr-bg);
}

.landing-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.landing-footer__brand {
  font-family: var(--font-display);
  font-size: 18px;
}

.landing-footer__brand span {
  color: var(--clr-accent);
}

.landing-footer__copy,
.landing-footer__links a {
  color: var(--clr-muted);
  font-size: 13px;
}

.landing-footer__links {
  display: flex;
  gap: 20px;
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
