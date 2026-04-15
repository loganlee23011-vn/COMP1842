<template>
  <div class="auth-screen">
    <div class="auth-panel">
      <RouterLink class="auth-brand" :to="{ name: 'landing' }">IT <span>Helply</span></RouterLink>

      <div class="auth-copy">
        <h1>Create First Agent Account</h1>
      </div>

      <form class="ui form auth-form" @submit.prevent="onSubmit">
        <div class="two fields">
          <div class="field">
            <label>Full Name</label>
            <input v-model="form.name" type="text" placeholder="Alex Johnson" />
          </div>
          <div class="field">
            <label>Department</label>
            <input v-model="form.department" type="text" placeholder="IT Support" />
          </div>
        </div>

        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="agent@company.com" />
        </div>

        <div class="two fields">
          <div class="field">
            <label>Password</label>
            <input v-model="form.password" type="password" placeholder="Create password" />
          </div>
          <div class="field">
            <label>Confirm Password</label>
            <input v-model="form.confirmPassword" type="password" placeholder="Repeat password" />
          </div>
        </div>

        <div v-if="error" class="ui negative message">
          {{ error }}
        </div>

        <button class="ui primary fluid button" type="submit">Register</button>
        <RouterLink class="ui button fluid" :to="{ name: 'login' }">Back to Login</RouterLink>
      </form>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'
import { setSession } from '../helpers/session'

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        name: '',
        department: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      error: '',
    }
  },
  methods: {
    async onSubmit() {
      if (
        this.form.name.trim() === ''
        || this.form.department.trim() === ''
        || this.form.email.trim() === ''
        || this.form.password.trim() === ''
        || this.form.confirmPassword.trim() === ''
      ) {
        this.error = 'Please complete every registration field.'
        return
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Passwords do not match.'
        return
      }

      try {
        const res = await api.register({
          name: this.form.name,
          department: this.form.department,
          email: this.form.email,
          password: this.form.password,
        })
        this.error = ''
        setSession(res.user, res.token)
        this.flash(`Agent account created for ${this.form.name}`, 'success')
        this.$router.push('/tickets')
      } catch (error) {
        this.error = error?.response?.data?.message || 'Registration failed.'
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
  width: min(100%, 560px);
  background: #fff;
  border: 1px solid #dfe6ec;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.auth-brand {
  display: inline-block;
  margin-bottom: 14px;
  font-family: Georgia, serif;
  font-size: 1.5rem;
  color: #111827;
  text-decoration: none;
}

.auth-brand span {
  color: #2554ff;
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
