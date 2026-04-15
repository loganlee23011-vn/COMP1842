<template>
  <div>
    <h1>New Helpdesk Response</h1>
    <WordForm @createOrUpdate="createOrUpdate" />
  </div>
</template>

<script>
import WordForm from '../components/WordForm.vue'
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'NewWordView',
  components: {
    WordForm,
  },
  methods: {
    async createOrUpdate(word) {
      const res = await api.createWord(word)
      this.flash('Response created!', 'success')
      this.$router.push(`/words/${res._id}`)
    },
  },
}
</script>
