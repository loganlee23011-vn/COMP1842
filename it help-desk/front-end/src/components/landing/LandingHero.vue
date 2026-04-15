<template>
  <section class="hero hero-grid">
    <div class="landing-container hero__inner">
      <div class="hero__left">
        <span class="badge">IT Helpdesk Platform</span>
        <h1 class="hero__title">
          Resolve support requests
          <em>faster</em> with one clear dashboard
        </h1>
        <p class="hero__sub">
          IT Helply brings together helpdesk responses, agent assignment, reports, and training so your team can answer faster and stay consistent.
        </p>

        <div class="hero__cta">
          <RouterLink class="btn btn-primary" :to="{ name: 'register' }">Create First Agent</RouterLink>
          <RouterLink class="btn btn-ghost" :to="{ name: 'login' }">Open Dashboard</RouterLink>
        </div>

        <div class="hero__stats">
          <div>
            <div class="stat__num">2 min</div>
            <div class="stat__label">Average first response</div>
          </div>
          <div>
            <div class="stat__num">98%</div>
            <div class="stat__label">Knowledge consistency</div>
          </div>
          <div>
            <div class="stat__num">5+</div>
            <div class="stat__label">Quiz-ready responses</div>
          </div>
        </div>
      </div>

      <div class="hero__media-card">
        <div v-if="youtubeEmbedUrl" class="video-frame">
          <iframe
            :src="youtubeEmbedUrl"
            title="IT Helply demo video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>

        <div v-else class="video-placeholder">
          <span>No video available</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LandingHero',
  data() {
    return {
      youtubeEmbedUrl: '',
    }
  },
}
</script>

<style scoped>
.hero {
  padding: 78px 0 86px;
}

.hero-grid {
  background-image:
    linear-gradient(rgba(37, 84, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 84, 255, 0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  background-position: center;
}

.hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.hero__left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(42px, 5vw, 72px);
  line-height: 1.04;
  margin: 0;
}

.hero__title em {
  color: var(--clr-accent);
  font-style: italic;
}

.hero__sub {
  color: var(--clr-muted);
  line-height: 1.8;
  max-width: 520px;
}

.hero__cta,
.hero__stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero__stats {
  gap: 32px;
}

.stat__num {
  font-family: var(--font-display);
  font-size: 28px;
}

.stat__label {
  font-size: 12px;
  color: var(--clr-muted);
}

.hero__media-card {
  padding: 22px;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  display: grid;
  gap: 16px;
}

.hero__media-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.preview-pill {
  background: var(--clr-accent-lt);
  color: var(--clr-accent);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.preview-meta {
  color: var(--clr-muted);
  font-size: 12px;
}

.video-frame,
.video-placeholder {
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--clr-border);
  background: #fff;
}

.video-frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #eef1ff 0%, #f7f6f2 100%);
}

.video-placeholder__icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--clr-accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.video-placeholder span {
  color: var(--clr-muted);
  font-size: 12px;
  line-height: 1.6;
}

code {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 6px;
}

@media (max-width: 900px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }
}
</style>
