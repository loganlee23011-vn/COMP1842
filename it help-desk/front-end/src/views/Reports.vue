<template>
  <div class="reports-page">
    <div class="page-header">
      <div>
        <h1>Helpdesk Performance Summary</h1>
      </div>
    </div>

    <div class="ui four stackable cards">
      <div class="ui card summary-card">
        <div class="content">
          <div class="header">Total Entries</div>
          <div class="description stat">{{ words.length }}</div>
          <div class="meta">Knowledge base records</div>
        </div>
      </div>

      <div class="ui card summary-card">
        <div class="content">
          <div class="header">Assignments</div>
          <div class="description stat">{{ assignedAgentCount }}</div>
          <div class="meta">Agents or teams linked to responses</div>
        </div>
      </div>

      <div class="ui card summary-card">
        <div class="content">
          <div class="header">Categories</div>
          <div class="description stat">{{ categories.length }}</div>
          <div class="meta">Support areas covered</div>
        </div>
      </div>

      <div class="ui card summary-card">
        <div class="content">
          <div class="header">Quiz Ready</div>
          <div class="description stat">{{ words.length >= 5 ? 'Yes' : 'No' }}</div>
          <div class="meta">At least five entries available</div>
        </div>
      </div>
    </div>

    <div class="ui two column stackable grid">
      <div class="column">
        <h2>Entries by Category</h2>
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Entries</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categoryCounts" :key="item.label">
              <td>{{ item.label }}</td>
              <td>{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="categoryCounts.length === 0" class="empty-copy">No response entries yet.</p>
      </div>

      <div class="column">
        <h2>Entries by Assigned Agent / Team</h2>
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Assigned Agent / Team</th>
              <th>Assignments</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in agentCounts" :key="item.label">
              <td>{{ item.label }}</td>
              <td>{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="agentCounts.length === 0" class="empty-copy">No agent assignments recorded yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'ReportsView',
  data() {
    return {
      words: [],
    }
  },
  computed: {
    categories() {
      return [...new Set(this.words.map((word) => word.category).filter(Boolean))]
    },
    assignedAgentCount() {
      return [...new Set(
        this.words
          .map((word) => word.agent)
          .filter((agent) => agent && agent !== 'Unassigned'),
      )].length
    },
    categoryCounts() {
      const counts = this.words.reduce((acc, word) => {
        const label = word.category || 'Uncategorised'
        acc[label] = (acc[label] || 0) + 1
        return acc
      }, {})

      return Object.entries(counts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => a.label.localeCompare(b.label))
    },
    agentCounts() {
      const counts = this.words.reduce((acc, word) => {
        const label = word.agent || 'Unassigned'
        acc[label] = (acc[label] || 0) + 1
        return acc
      }, {})

      return Object.entries(counts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => a.label.localeCompare(b.label))
    },
  },
  async mounted() {
    this.words = await api.getWords()
  },
}
</script>

<style scoped>
.reports-page {
  display: grid;
  gap: 22px;
}

.empty-copy {
  color: #64748b;
  margin-top: 8px;
}

.summary-card {
  background: #f8fbff;
}

.stat {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 10px 0;
}
</style>
