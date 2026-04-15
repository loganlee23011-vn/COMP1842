<template>
  <section class="landing-steps">
    <div class="landing-container">
      <div class="steps-header">
        <span class="badge">Coursework Flow</span>
        <h2>How The System Works In <span>3 Steps</span></h2>
        <p class="steps-intro">
          This matches the main coursework journey: create the workspace, invite agents, then use tickets and the response library together.
        </p>
      </div>

      <div class="steps-grid">
        <article v-for="step in steps" :key="step.number" class="step-card">
          <div class="step-icon" :class="step.colorClass">{{ step.number }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LandingSteps',
  data() {
    return {
      steps: [
        {
          number: '1',
          title: 'Create The Workspace',
          description: 'Set up IT Helply, create the first agent account, and prepare the response library for common support issues.',
          colorClass: 'step-blue',
        },
        {
          number: '2',
          title: 'Invite Agents And Teams',
          description: 'Invite agents by email, organise them into teams, and wait for invitation acceptance before they join.',
          colorClass: 'step-purple',
        },
        {
          number: '3',
          title: 'Handle Tickets',
          description: 'Track tickets, assign agents or teams, and reuse approved response scripts to keep support consistent.',
          colorClass: 'step-orange',
        },
      ]
    }
  },
}
</script>

<style scoped>
.landing-steps {
  padding: 68px 0 62px;
  background: linear-gradient(180deg, #fdfcf9 0%, #f7f6f2 100%);
  border-top: 1px solid var(--clr-border);
  border-bottom: 1px solid var(--clr-border);
}

.steps-header {
  text-align: center;
  display: grid;
  gap: 14px;
  justify-items: center;
}

.steps-header h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(30px, 4vw, 52px);
}

.steps-header h2 span {
  color: #2554ff;
}

.steps-intro {
  max-width: 760px;
  margin: 0;
  color: var(--clr-muted);
  line-height: 1.7;
  text-align: center;
}

.steps-grid {
  margin-top: 38px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.step-card {
  text-align: center;
  padding: 24px 20px;
  background: #ffffff;
  border: 1px solid #e6edf5;
  border-radius: 22px;
  box-shadow: var(--shadow-sm);
}

.step-icon {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  box-shadow: var(--shadow-md);
}

.step-blue {
  background: linear-gradient(135deg, #5b7cff 0%, #5570d8 100%);
}

.step-purple {
  background: linear-gradient(135deg, #7c6cf6 0%, #b45fd7 100%);
}

.step-orange {
  background: linear-gradient(135deg, #2f7df4 0%, #22c7c7 100%);
}

.step-card h3 {
  margin: 18px 0 10px;
  font-size: 1.75rem;
}

.step-card p {
  margin: 0;
  color: var(--clr-muted);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .steps-grid {
    grid-template-columns: 1fr;
  }
}
</style>
