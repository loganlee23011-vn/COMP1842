<template>
  <div>
    <h2>Score: {{ score }} out of {{ answered }}</h2>

    <div v-if="!testOver" class="quiz-card ui segment">
      <p class="meta">Category: {{ currWord.category }} | Assigned Agent / Team: {{ currWord.agent || 'Unassigned' }}</p>
      <h3>{{ currWord.key }}</h3>
      <p>Select the correct standard response:</p>

      <div class="ui relaxed divided list">
        <button
          v-for="option in currentOptions"
          :key="option"
          class="ui fluid button option-button"
          @click="submitAnswer(option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <p :class="['results', resultClass]">
      <span v-html="result"></span>
    </p>

    <button v-if="testOver" class="ui button" @click="restartQuiz">Restart Quiz</button>
  </div>
</template>

<script>
export default {
  name: 'VocabTest',
  props: {
    words: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      randWords: [...this.words].sort(() => 0.5 - Math.random()),
      incorrectGuesses: [],
      result: '',
      resultClass: '',
      score: 0,
      testOver: false,
      answered: 0,
    }
  },
  computed: {
    currWord() {
      return this.randWords.length ? this.randWords[0] : {}
    },
    currentOptions() {
      if (!this.currWord.response) return []

      const distractors = this.words
        .filter((word) => word._id !== this.currWord._id)
        .map((word) => word.response)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)

      return [this.currWord.response, ...distractors].sort(() => 0.5 - Math.random())
    },
  },
  methods: {
    submitAnswer(selectedResponse) {
      if (selectedResponse === this.currWord.response) {
        this.flash('Correct!', 'success', 1000)
        this.score += 1
      } else {
        this.flash('Wrong!', 'error', 1000)
        this.incorrectGuesses.push(this.currWord.key)
      }

      this.answered += 1
      this.randWords.shift()

      if (this.randWords.length === 0) {
        this.testOver = true
        this.displayResults()
      }
    },
    displayResults() {
      if (this.incorrectGuesses.length === 0) {
        this.result = 'You matched every issue code to the correct response. Well done!'
        this.resultClass = 'success'
      } else {
        const incorrect = this.incorrectGuesses.join(', ')
        this.result = `<strong>Review these issue codes:</strong> ${incorrect}`
        this.resultClass = 'error'
      }
    },
    restartQuiz() {
      this.randWords = [...this.words].sort(() => 0.5 - Math.random())
      this.incorrectGuesses = []
      this.result = ''
      this.resultClass = ''
      this.score = 0
      this.testOver = false
      this.answered = 0
    },
  },
}
</script>

<style scoped>
.quiz-card {
  margin: 20px 0;
  border-radius: 16px;
}

.meta {
  color: #6b7280;
  margin-bottom: 8px;
}

.option-button {
  display: block;
  margin-bottom: 10px;
  text-align: left;
  white-space: normal;
}

.results {
  margin: 25px auto;
  padding: 15px;
  border-radius: 5px;
}

.error {
  border: 1px solid #ebccd1;
  color: #a94442;
  background-color: #f2dede;
}

.success {
  border: 1px solid #d6e9c6;
  color: #3c763d;
  background-color: #dff0d8;
}
</style>
