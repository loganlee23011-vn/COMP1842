<template>
  <section id="features" class="feature-band">
    <div class="landing-container">
      <div class="section-head">
        <span class="badge">Core Features</span>
        <h2>Built for the coursework and ready for demo</h2>
        <p>Everything on the site maps back to your helpdesk response library scenario.</p>
      </div>

      <div class="feature-grid">
        <article class="feature-card">
          <h3>CRUD Response Library</h3>
          <p>Create, edit, search, and delete issue-code responses with category and assigned agent or team.</p>
        </article>
        <article class="feature-card">
          <h3>Agent Training Quiz</h3>
          <p>Test agent knowledge by matching issue codes to the correct approved response.</p>
        </article>
        <article class="feature-card">
          <h3>Reports and Agents</h3>
          <p>View category summaries, assignment coverage, and registered helpdesk agents.</p>
        </article>
      </div>
    </div>
  </section>

  <section id="preview" class="preview preview-section-break">
    <div class="landing-container">
      <div class="section-head">
        <span class="badge">Preview</span>
        <h2>One workspace for support operations</h2>
        <p>Use the tabs to show different parts of the system during your coursework demo.</p>
      </div>

      <div class="preview__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="preview__frame">
        <img
          :src="activePreview.src"
          :alt="activePreview.alt"
          class="preview-image"
        />
      </div>
    </div>
  </section>
</template>

<script>
import agentsImg from '../../assets/agents.png'
import dashboardImg from '../../assets/dashboard.png'
import newEntryImg from '../../assets/new-entry.png'
import reportsImg from '../../assets/reports.png'

export default {
  name: 'LandingPreview',
  computed: {
    activePreview() {
      return this.images[this.activeTab]
    },
  },
  data() {
    return {
      activeTab: 'dashboard',
      tabs: [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'reports', label: 'Reports' },
        { key: 'agents', label: 'Agents' },
        { key: 'ticket', label: 'New Entry' },
      ],
      images: {
        dashboard: {
          src: dashboardImg,
          alt: 'Dashboard preview',
        },
        reports: {
          src: reportsImg,
          alt: 'Reports preview',
        },
        agents: {
          src: agentsImg,
          alt: 'Agents preview',
        },
        ticket: {
          src: newEntryImg,
          alt: 'New entry preview',
        },
      },
    }
  },
}
</script>

<style scoped>
.feature-band,
.preview {
  padding: 74px 0;
}

.preview-section-break {
  background:
    linear-gradient(180deg, #f7f6f2 0%, #ffffff 14%, #ffffff 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.section-head {
  text-align: center;
  display: grid;
  gap: 14px;
  justify-items: center;
  margin-bottom: 40px;
}

.section-head h2 {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.15;
  margin: 0;
}

.section-head p {
  color: var(--clr-muted);
  line-height: 1.7;
  max-width: 620px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.feature-card {
  padding: 24px;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.feature-card h3 {
  margin: 0 0 10px;
}

.feature-card p {
  color: var(--clr-muted);
}

.preview__tabs {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 40px;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-md);
  padding: 4px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.tab-btn {
  font-size: 13px;
  font-weight: 500;
  padding: 8px 20px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--clr-muted);
  cursor: pointer;
}

.tab-btn.active {
  background: var(--clr-text);
  color: #fff;
}

.preview__frame {
  min-height: 420px;
}

.preview-image {
  width: 100%;
  display: block;
  min-height: 420px;
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
  object-fit: cover;
  object-position: top center;
  background: #f7f6f2;
}

@media (max-width: 900px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .preview-image {
    min-height: 300px;
  }
}
</style>
