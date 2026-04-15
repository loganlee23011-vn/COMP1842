<template>
  <div class="auth-screen">
    <div class="auth-panel">
      <div class="auth-copy">
        <h1>Accept Team Invitation</h1>
        <p v-if="invitation">
          Join <strong>{{ invitation.team?.name }}</strong> on the helpdesk platform.
        </p>
      </div>

      <div v-if="loading" class="ui active inline loader"></div>

      <div v-else-if="error" class="ui negative message">
        {{ error }}
      </div>

      <form v-else class="ui form auth-form" @submit.prevent="onSubmit">
        <div class="field">
          <label>Email</label>
          <input :value="invitation.email" type="email" readonly />
        </div>

        <div class="two fields">
          <div class="field">
            <label>Full Name</label>
            <input v-model="form.name" type="text" :readonly="Boolean(existingUser)" />
          </div>
          <div class="field">
            <label>Department</label>
            <input v-model="form.department" type="text" :readonly="Boolean(existingUser)" />
          </div>
        </div>

        <div v-if="!existingUser" class="two fields">
          <div class="field">
            <label>Password</label>
            <input v-model="form.password" type="password" placeholder="Create password" />
          </div>
          <div class="field">
            <label>Confirm Password</label>
            <input v-model="form.confirmPassword" type="password" placeholder="Repeat password" />
          </div>
        </div>

        <div v-if="existingUser" class="ui info message">
          This email already has an agent account. Accepting the invitation will add that account to the selected team.
        </div>

        <button class="ui primary fluid button" type="submit">
          {{ existingUser ? 'Join Team' : 'Activate Account and Join Team' }}
        </button>
        <RouterLink class="back-link" :to="{ name: 'login' }">Back to Login</RouterLink>
      </form>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'
import { setSession } from '../helpers/session'

export default {
  name: 'AcceptInviteView',
  data() {
    return {
      loading: true,
      invitation: null,
      existingUser: null,
      error: '',
      token: '',
      form: {
        name: '',
        department: '',
        password: '',
        confirmPassword: '',
      },
    }
  },
  async mounted() {
    //get token
    this.token = this.$route.query.token || ''

    if (!this.token) {
      this.loading = false
      this.error = 'Invitation token is missing.'
      return
    }

    try {
      const res = await api.getInvitation(this.token)
      this.invitation = res.invitation
      this.existingUser = res.existingUser
      this.form.name = res.existingUser?.name || res.invitation?.name || ''
      this.form.department = res.existingUser?.department || res.invitation?.department || ''
    } catch (error) {
      this.error = error?.response?.data?.message || 'Unable to load invitation.'
    } finally {
      this.loading = false
    }
  },
  methods: {
    async onSubmit() {
      if (!this.existingUser) {
        if (!this.form.name.trim() || !this.form.department.trim() || !this.form.password.trim()) {
          this.error = 'Please complete all account fields.'
          return
        }

        if (this.form.password !== this.form.confirmPassword) {
          this.error = 'Passwords do not match.'
          return
        }
      }

      try {
        const res = await api.acceptInvitation({
          token: this.token,
          name: this.form.name,
          department: this.form.department,
          password: this.form.password,
        })
        setSession(res.user, res.token)
        this.flash(res.message, 'success')
        this.$router.push('/tickets')
      } catch (error) {
        this.error = error?.response?.data?.message || 'Unable to accept invitation.'
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

.back-link {
  display: inline-block;
  margin-top: 14px;
  color: #5f6b7a;
}
</style>
