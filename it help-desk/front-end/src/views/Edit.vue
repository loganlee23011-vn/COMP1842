<template>
  <div>
    <h1>Edit Helpdesk Response</h1>
    // props words by wordform recieve data from this.word
    <WordForm :word="word" @createOrUpdate="createOrUpdate" />
  </div>
</template>

<script>
import WordForm from '../components/WordForm.vue'
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'EditView',
  components: {
    WordForm,
  },
  data() {
    return {
      word: {},
    }
  },
  async mounted() {
    this.word = await api.getWord(this.$route.params.id)
  },
  methods: {
    async createOrUpdate(word) {
      await api.updateWord(word)
      this.flash('Response updated successfully!', 'success')
      this.$router.push(`/words/${word._id}`)
    },
  },
}
</script>
