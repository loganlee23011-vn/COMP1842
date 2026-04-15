<template>
  <div class="library-page">
    <div class="library-header">
      <div>
        <h1>Helpdesk Response Library</h1>
      </div>
      <RouterLink class="ui primary button action-button" :to="{ name: 'new-word' }">Add Response</RouterLink>
    </div>

    <div class="ui three column stackable grid filters">
      <div class="column">
        <div class="ui fluid input">
          <input v-model="searchTerm" type="text" placeholder="Search issue code, response, category, or assigned agent..." />
        </div>
      </div>
      <div class="column">
        <select v-model="selectedCategory" class="ui fluid dropdown">
          <option value="">All categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div class="column">
        <select v-model="selectedAgent" class="ui fluid dropdown">
          <option value="">All assignments</option>
          <option v-for="agent in agents" :key="agent" :value="agent">
            {{ agent }}
          </option>
        </select>
      </div>
    </div>

    <table id="words" class="ui celled compact table library-table">
      <thead>
        <tr>
          <th>Issue Code</th>
          <th>Category</th>
          <th>Assignment Type</th>
          <th>Assigned Agent / Team</th>
          <th>Standard Response</th>
          <th>Updated</th>
          <th colspan="3"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(word, i) in filteredWords" :key="word._id || i">
          <td>{{ word.key }}</td>
          <td>{{ word.category }}</td>
          <td>{{ formatAssignmentType(word.assignmentType) }}</td>
          <td>{{ word.agent || 'Unassigned' }}</td>
          <td>{{ word.response }}</td>
          <td>{{ formatDate(word.updatedAt) }}</td>
          <td width="75" class="center aligned">
            <RouterLink :to="{ name: 'show', params: { id: word._id } }">Show</RouterLink>
          </td>
          <td width="75" class="center aligned">
            <RouterLink :to="{ name: 'edit', params: { id: word._id } }">Edit</RouterLink>
          </td>
          <td width="75" class="center aligned" @click.prevent="onDestroy(word._id)">
            <a :href="`/words/${word._id}`">Destroy</a>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="filteredWords.length === 0" class="empty-state">No helpdesk responses match the current filter.</p>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'WordsView',
  data() {
    return {
      words: [],
      searchTerm: '',
      selectedCategory: '',
      selectedAgent: '',
    }
  },
  computed: {
    categories() {
      return [...new Set(this.words.map((word) => word.category).filter(Boolean))].sort()
    },
    agents() {
      return [...new Set(this.words.map((word) => word.agent).filter(Boolean))].sort()
    },
    filteredWords() {
      const term = this.searchTerm.trim().toLowerCase()
      return this.words.filter((word) => {
        const matchesCategory = !this.selectedCategory || word.category === this.selectedCategory
        const matchesAgent = !this.selectedAgent || word.agent === this.selectedAgent
        const matchesTerm = !term
          || word.key?.toLowerCase().includes(term)
          || word.category?.toLowerCase().includes(term)
          || word.response?.toLowerCase().includes(term)
          || word.agent?.toLowerCase().includes(term)
        return matchesCategory && matchesAgent && matchesTerm
      })
    },
  },
  methods: {
    formatDate(value) {
      return value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    formatAssignmentType(value) {
      return value === 'team' ? 'Team' : 'Agent'
    },
    async onDestroy(id) {
      const sure = window.confirm('Are you sure?')
      if (!sure) return

      await api.deleteWord(id)
      this.flash('Response deleted successfully!', 'success')
      this.words = this.words.filter((word) => word._id !== id)
    },
  },
  async mounted() {
    this.words = await api.getWords()
  },
}
</script>

<style scoped>
.library-page {
  display: grid;
  gap: 18px;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 6px;
}

.action-button {
  white-space: nowrap;
  min-width: 140px;
}

.filters {
  margin-bottom: 8px;
}

.library-table th,
.library-table td {
  vertical-align: top;
}

.library-table th:nth-child(4),
.library-table td:nth-child(4) {
  min-width: 260px;
}

.empty-state {
  color: #6b7280;
  margin-top: 16px;
}
</style>
