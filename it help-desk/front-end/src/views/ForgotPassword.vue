<template>
  <div class="auth-screen">
    <div class="auth-panel">
      <div class="auth-copy">
        <h1>Forgot password?</h1>
        <p>Enter your email address and the system will send a reset link if the account exists.</p>
      </div>

      <form class="ui form auth-form" @submit.prevent="onSubmit">
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="agent@company.com" />
        </div>

        <div v-if="message" class="ui positive message">
          {{ message }}
        </div>

        <div v-if="error" class="ui negative message">
          {{ error }}
        </div>

        <button class="ui primary fluid button" type="submit" :disabled="submitting || cooldown > 0">
          {{ buttonLabel }}
        </button>
        <RouterLink class="ui button fluid" :to="{ name: 'login' }">Back to Login</RouterLink>
      </form>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'ForgotPasswordView',
  data() {
    return {
      form: {
        email: '',
      },
      submitting: false,
      cooldown: 0,
      cooldownTimer: null,
      error: '',
      message: '',
    }
  },
  computed: {
    buttonLabel() {
      if (this.submitting) return 'Sending...'
      if (this.cooldown > 0) return `Wait ${this.cooldown}s`
      return 'Send Reset Email'
    },
  },
  beforeUnmount() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer)
    }
  },
  methods: {
    startCooldown() {
      this.cooldown = 30
      if (this.cooldownTimer) {
        clearInterval(this.cooldownTimer)
      }

      this.cooldownTimer = setInterval(() => {
        if (this.cooldown <= 1) {
          clearInterval(this.cooldownTimer)
          this.cooldownTimer = null
          this.cooldown = 0
          return
        }

        this.cooldown -= 1
      }, 1000)
    },
    async onSubmit() {
      if (this.submitting || this.cooldown > 0) {
        return
      }

      if (this.form.email.trim() === '') {
        this.error = 'Please enter your email address.'
        this.message = ''
        return
      }

      try {
        this.submitting = true
        const res = await api.forgotPassword({ email: this.form.email })
        this.error = ''
        this.message = res.message
        this.startCooldown()
      } catch (error) {
        this.message = ''
        this.error = error?.response?.data?.message || 'Could not send reset email.'
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>

<style scoped>
.auth-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 18px;
  background: #f4f6f8;
}

.auth-panel {
  width: min(100%, 460px);
  background: #fff;
  border: 1px solid #dfe6ec;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.auth-copy h1 {
  margin: 10px 0 10px;
  font-size: 2rem;
  color: #1f2937;
}

.auth-copy p {
  color: #5f6b7a;
  line-height: 1.6;
}

.auth-form {
  margin-top: 22px;
}

.auth-form :deep(.ui.primary.button) {
  background: #1f2937;
}

.auth-form :deep(.ui.primary.button:hover) {
  background: #111827;
}

.auth-form :deep(.ui.button) {
  border-radius: 8px;
}

.auth-form :deep(.ui.button:not(.primary)) {
  background: #f8fafc;
  color: #334155;
}

.auth-form :deep(.ui.button:not(.primary):hover) {
  background: #eef2f7;
  color: #1f2937;
}

.auth-form input {
  border-radius: 8px;
}
</style>
