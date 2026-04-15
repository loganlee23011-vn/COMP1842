<template>
  <div>
    <h1>Helpdesk Response</h1>

    <div class="ui labeled input fluid">
      <div class="ui label">
        Issue Code
      </div>
      <input type="text" readonly :value="word.key" />
    </div>
    <div class="ui labeled input fluid">
      <div class="ui label">
        Category
      </div>
      <input type="text" readonly :value="word.category" />
    </div>
    <div class="ui labeled input fluid">
      <div class="ui label">
        Assignment Type
      </div>
      <input type="text" readonly :value="word.assignmentType === 'team' ? 'Team' : 'Agent'" />
    </div>
    <div class="ui labeled input fluid">
      <div class="ui label">
        Assigned To
      </div>
      <input type="text" readonly :value="word.agent" />
    </div>
    <div class="ui form">
      <div class="field">
        <label>Standard Response</label>
        <textarea readonly rows="6" :value="word.response"></textarea>
      </div>
    </div>
    <div class="actions">
      <p class="meta">Last updated: {{ formatDate(word.updatedAt) }}</p>
      <RouterLink :to="{ name: 'edit', params: { id: $route.params.id } }">
        Edit response
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'ShowView',
  data() {
    return {
      word: {},
    }
  },
  methods: {
    formatDate(value) {
      return value ? new Date(value).toLocaleString() : 'N/A'
    },
  },
  async mounted() {
    this.word = await api.getWord(this.$route.params.id)
  },
}
</script>

<style scoped>
.meta {
  margin-top: 16px;
  color: #64748b;
}

.actions a {
  display: inline-block;
  margin-top: 8px;
  text-decoration: underline;
}
</style>
