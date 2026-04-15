<template>
  <div class="test-page">
    <h1>Agent Training Quiz</h1>
    <p class="intro">Match each issue code with the correct approved response from the helpdesk library.</p>

    <div v-if="words.length < 3">
      <p>You need at least three helpdesk responses before the training quiz can begin.</p>
    </div>
    <div v-else>
      <VocabTest :words="words" />
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'
import VocabTest from '../components/VocabTest.vue'

export default {
  name: 'TestView',
  components: {
    VocabTest,
  },
  data() {
    return {
      words: [],
    }
  },
  async mounted() {
    this.words = await api.getWords()
  },
}
</script>

<style scoped>
.intro {
  color: #64748b;
  margin-bottom: 18px;
}
</style>
