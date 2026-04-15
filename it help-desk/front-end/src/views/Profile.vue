<template>
  <div class="profile-page">
    <h1>Edit Profile</h1>

    <form class="ui form profile-form" @submit.prevent="onSubmit">
      <div class="ui labeled input fluid">
        <div class="ui label">Full Name</div>
        <input v-model="form.name" type="text" placeholder="Alex Johnson" />
      </div>

      <div class="ui labeled input fluid">
        <div class="ui label">Department</div>
        <input v-model="form.department" type="text" placeholder="IT Support" />
      </div>

      <div class="ui labeled input fluid">
        <div class="ui label">Email</div>
        <input v-model="form.email" type="email" placeholder="agent@company.com" />
      </div>

      <div class="ui labeled input fluid">
        <div class="ui label">Role</div>
        <input :value="form.role" type="text" readonly />
      </div>

      <div v-if="error" class="ui negative message">
        {{ error }}
      </div>

      <button class="ui primary button" type="submit">Save Profile</button>
    </form>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'
import { setSession, sessionState } from '../helpers/session'

export default {
  name: 'ProfileView',
  data() {
    return {
      form: {
        name: '',
        department: '',
        email: '',
        role: 'agent',
      },
      error: '',
    }
  },
  async mounted() {
    const profile = sessionState.user || await api.getProfile()
    this.form = {
      name: profile.name || '',
      department: profile.department || '',
      email: profile.email || '',
      role: profile.role || 'agent',
    }
  },
  methods: {
    async onSubmit() {
      if (
        this.form.name.trim() === ''
        || this.form.department.trim() === ''
        || this.form.email.trim() === ''
      ) {
        this.error = 'Please complete all profile fields.'
        return
      }

      try {
        const res = await api.updateProfile({
          name: this.form.name,
          department: this.form.department,
          email: this.form.email,
        })
        this.error = ''
        setSession(res.user, res.token)
        this.form.role = res.user.role || 'agent'
        this.flash('Profile updated successfully.', 'success')
      } catch (error) {
        this.error = error?.response?.data?.message || 'Could not update profile.'
      }
    },
  },
}
</script>

<style scoped>
.profile-page {
  max-width: 760px;
}

.profile-form {
  display: grid;
  gap: 14px;
}
</style>
