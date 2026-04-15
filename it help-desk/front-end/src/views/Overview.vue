<template>
  <div class="overview-page">
    <div class="page-header">
      <div>
        <h1>Helpdesk Dashboard</h1>
      </div>
      <div class="header-actions">
        <RouterLink class="ui button" :to="{ name: 'new-word' }">New Response</RouterLink>
        <RouterLink class="ui primary button" :to="{ name: 'new-ticket' }">New Ticket</RouterLink>
      </div>
    </div>

    <div class="ui four stackable cards">
      <div class="ui card summary-card">
        <div class="content">
          <div class="header">Total Tickets</div>
          <div class="description stat">{{ tickets.length }}</div>
        </div>
      </div>
      <div class="ui card summary-card">
        <div class="content">
          <div class="header">Open Tickets</div>
          <div class="description stat">{{ statusCount('Open') }}</div>
        </div>
      </div>
      <div class="ui card summary-card">
        <div class="content">
          <div class="header">Resolved Tickets</div>
          <div class="description stat">{{ statusCount('Resolved') }}</div>
        </div>
      </div>
      <div class="ui card summary-card">
        <div class="content">
          <div class="header">Total Responses</div>
          <div class="description stat">{{ words.length }}</div>
        </div>
      </div>
    </div>

    <div class="ui two column stackable grid">
      <div class="column">
        <h2>Tickets by Status</h2>
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Tickets</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ticketStatusCounts" :key="item.label">
              <td>{{ item.label }}</td>
              <td>{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="column">
        <h2>Tickets by Priority</h2>
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Tickets</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ticketPriorityCounts" :key="item.label">
              <td>{{ item.label }}</td>
              <td>{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="ui two column stackable grid">
      <div class="column">
        <h2>Recent Tickets</h2>
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Ticket Code</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in recentTickets" :key="ticket._id">
              <td>{{ ticket.ticketCode }}</td>
              <td>{{ ticket.status }}</td>
              <td>{{ ticket.assignedTo || 'Unassigned' }}</td>
              <td>{{ formatDate(ticket.updatedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="column">
        <h2>Recent Responses</h2>
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Issue Code</th>
              <th>Assignment</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="word in recentWords" :key="word._id">
              <td>{{ word.key }}</td>
              <td>{{ word.agent || 'Unassigned' }}</td>
              <td>{{ formatDate(word.updatedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="ui two column stackable grid">
      <div class="column">
        <h2>Response Categories</h2>
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
      </div>

      <div class="column">
        <h2>Response Assignment Coverage</h2>
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Assigned To</th>
              <th>Entries</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in responseAssignmentCounts" :key="item.label">
              <td>{{ item.label }}</td>
              <td>{{ item.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

//call api from backend
import { api } from '../helpers/helpers/helpers'


const countBy = (items, pick, fallback) => {
  const counts = items.reduce((acc, item) => {
    const key = pick(item) || fallback
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export default {
  name: 'OverviewView',
  data() {
    return {
      words: [],
      tickets: [],
    }
  },
  computed: {
    ticketStatusCounts() {
      return countBy(this.tickets, (ticket) => ticket.status, 'Unknown')
    },
    ticketPriorityCounts() {
      return countBy(this.tickets, (ticket) => ticket.priority, 'Unknown')
    },
    categoryCounts() {
      return countBy(this.words, (word) => word.category, 'Uncategorised')
    },
    responseAssignmentCounts() {
      return countBy(this.words, (word) => word.agent, 'Unassigned')
    },
    recentTickets() {
      return [...this.tickets].slice(0, 5)
    },
    recentWords() {
      return [...this.words].slice(0, 5)
    },
  },
  methods: {
    formatDate(value) {
      return value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    statusCount(status) {
      return this.tickets.filter((ticket) => ticket.status === status).length
    },
  },
  async mounted() {
    const [words, tickets] = await Promise.all([
      api.getWords(),
      api.getTickets(),
    ])

    this.words = words
    this.tickets = tickets
  },
}
</script>

<style scoped>
.overview-page {
  display: grid;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.summary-card {
  background: #f8fbff;
}

.stat {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
