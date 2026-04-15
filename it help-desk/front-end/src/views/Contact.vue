<template>
  <div class="contact-page">
    <div class="contact-panel">
      <h1>Contact Support</h1>

      <form class="ui form contact-form" @submit.prevent="onSubmit">
        <div class="field">
          <label>Name</label>
          <input v-model="form.name" type="text" placeholder="Your name" />
        </div>

        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="your-email@example.com" />
        </div>

        <div class="field">
          <label>Subject</label>
          <input v-model="form.subject" type="text" placeholder="What do you need help with?" />
        </div>

        <div class="field">
          <label>Message</label>
          <textarea v-model="form.message" rows="6" placeholder="Write your support message here..."></textarea>
        </div>

        <div v-if="message" class="ui positive message">
          {{ message }}
        </div>

        <div v-if="error" class="ui negative message">
          {{ error }}
        </div>

        <button class="ui primary button" type="submit" :disabled="submitting">
          {{ submitting ? 'Sending...' : 'Send Message' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'
import { sessionState } from '../helpers/session'

export default {
  name: 'ContactView',
  data() {
    return {
      sessionState,
      submitting: false,
      message: '',
      error: '',
      form: {
        name: '',
        email: '',
        subject: '',
        message: '',
      },
    }
  },
  mounted() {
    if (this.sessionState.user) {
      this.form.name = this.sessionState.user.name || ''
      this.form.email = this.sessionState.user.email || ''
    }
  },
  methods: {
    async onSubmit() {
      if (
        this.form.name.trim() === ''
        || this.form.email.trim() === ''
        || this.form.subject.trim() === ''
        || this.form.message.trim() === ''
      ) {
        this.error = 'Please complete all contact fields.'
        this.message = ''
        return
      }

      try {
        this.submitting = true
        const res = await api.contactSupport(this.form)
        this.error = ''
        this.message = res.message
        this.form.subject = ''
        this.form.message = ''
      } catch (error) {
        this.message = ''
        this.error = error?.response?.data?.message || 'Could not send your support message.'
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>

<style scoped>
.contact-page {
  min-height: 100%;
}

.contact-panel {
  max-width: 760px;
}

.contact-form textarea {
  min-height: 140px;
}
</style>
