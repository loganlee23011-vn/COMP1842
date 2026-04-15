<template>
  <div class="agents-page">
    <div class="page-header">
      <div class="tab-switch">
        <button
          type="button"
          class="tab-button"
          :class="{ active: activeTab === 'agents' }"
          @click="activeTab = 'agents'"
        >
          Agents ({{ users.length }})
        </button>
        <button
          type="button"
          class="tab-button"
          :class="{ active: activeTab === 'teams' }"
          @click="activeTab = 'teams'"
        >
          Teams ({{ teams.length }})
        </button>
      </div>
    </div>

    <div class="ui stackable two column grid main-grid">
      <div class="ten wide column">
        <template v-if="activeTab === 'agents'">
          <div class="ui segment form-panel">
            <h2>Invite New Agent</h2>
            <form class="ui form" @submit.prevent="submitInvite">
              <div class="two fields">
                <div class="field">
                  <label>Full Name</label>
                  <input v-model="inviteForm.name" type="text" placeholder="Anna Lee" />
                </div>
                <div class="field">
                  <label>Department</label>
                  <input v-model="inviteForm.department" type="text" placeholder="Network" />
                </div>
              </div>

              <div class="two fields">
                <div class="field">
                  <label>Email</label>
                  <input v-model="inviteForm.email" type="email" placeholder="agent@company.com" />
                </div>
                <div class="field">
                  <label>Team</label>
                  <select v-model="inviteForm.teamId" class="ui fluid dropdown">
                    <option value="">Select team</option>
                    <option v-for="team in teams" :key="team._id" :value="team._id">
                      {{ team.name }}
                    </option>
                  </select>
                </div>
              </div>

              <button class="ui primary button" type="submit">Send Invitation</button>
            </form>
          </div>

          <div class="ui segment list-panel">
            <div class="list-header">
              <h2>Agents</h2>
              <span>{{ users.length }} active</span>
            </div>
            <table class="ui celled compact table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Teams</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in users"
                  :key="user._id"
                  class="selectable-row"
                  @click="selectDetail('agent', user)"
                >
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ teamNamesForUser(user).join(', ') || 'No team yet' }}</td>
                  <td><span class="status-pill active-status">Active</span></td>
                </tr>
              </tbody>
            </table>
            <p v-if="users.length === 0" class="empty-copy">No active agents yet.</p>
          </div>

          <div class="ui segment list-panel">
            <div class="list-header">
              <h2>Pending Invitations</h2>
              <span>{{ pendingInvitations.length }} waiting</span>
            </div>
            <table class="ui celled compact table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Team</th>
                  <th>Status</th>
                  <th>Last Sent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="invitation in pendingInvitations"
                  :key="invitation._id"
                  class="selectable-row"
                  @click="selectDetail('invitation', invitation)"
                >
                  <td>{{ invitation.name || 'Pending agent' }}</td>
                  <td>{{ invitation.email }}</td>
                  <td>{{ invitation.teamName }}</td>
                  <td><span class="status-pill pending-status">{{ invitationLabel(invitation) }}</span></td>
                  <td>{{ formatDateTime(invitation.lastSentAt) }}</td>
                  <td @click.stop>
                    <button class="ui button mini" type="button" @click="sendReminder(invitation)">
                      Send reminder
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="pendingInvitations.length === 0" class="empty-copy">No pending invitations.</p>
          </div>
        </template>

        <template v-else>
          <div class="ui segment form-panel">
            <h2>Create Team</h2>
            <form class="ui form" @submit.prevent="submitTeam">
              <div class="field">
                <label>Team Name</label>
                <input v-model="teamForm.name" type="text" placeholder="Support Heroes" />
              </div>
              <div class="field">
                <label>Description</label>
                <textarea v-model="teamForm.description" rows="3" placeholder="Describe what this team handles..."></textarea>
              </div>
              <button class="ui primary button" type="submit">Create Team</button>
            </form>
          </div>

          <div class="ui segment list-panel">
            <div class="list-header">
              <h2>Teams</h2>
              <span>{{ teams.length }} team(s)</span>
            </div>
            <table class="ui celled compact table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Agents</th>
                  <th>Pending Invites</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="team in teams"
                  :key="team._id"
                  class="selectable-row"
                  @click="selectDetail('team', team)"
                >
                  <td>{{ team.name }}</td>
                  <td>{{ team.description || 'No description' }}</td>
                  <td>{{ team.members.length }}</td>
                  <td>{{ team.pendingInvitations }}</td>
                </tr>
              </tbody>
            </table>
            <p v-if="teams.length === 0" class="empty-copy">No teams yet. Create one before inviting agents.</p>
          </div>
        </template>
      </div>

      <div class="six wide column">
        <div class="ui segment detail-panel">
          <template v-if="detail.type === 'agent' && detail.item">
            <h2>{{ detail.item.name }}</h2>
            <p>{{ detail.item.email }}</p>
            <p><strong>Department:</strong> {{ detail.item.department }}</p>
            <p><strong>Role:</strong> {{ detail.item.role }}</p>
            <p><strong>Teams:</strong> {{ teamNamesForUser(detail.item).join(', ') || 'No team yet' }}</p>
          </template>

          <template v-else-if="detail.type === 'invitation' && detail.item">
            <h2>{{ detail.item.name || 'Pending agent' }}</h2>
            <p>{{ detail.item.email }}</p>
            <p><strong>Team:</strong> {{ detail.item.teamName }}</p>
            <p><strong>Status:</strong> {{ invitationLabel(detail.item) }}</p>
            <p><strong>Sent:</strong> {{ formatDateTime(detail.item.lastSentAt) }}</p>
            <p><strong>Expires:</strong> {{ formatDateTime(detail.item.expiresAt) }}</p>
          </template>

          <template v-else-if="detail.type === 'team' && detail.item">
            <h2>{{ detail.item.name }}</h2>
            <p>{{ detail.item.description || 'No description provided.' }}</p>
            <p><strong>Agents:</strong> {{ detail.item.members.length }}</p>
            <ul class="member-list">
              <li v-for="member in detail.item.members" :key="member._id">
                {{ member.name }} ({{ member.email }})
              </li>
            </ul>
          </template>

          <template v-else>
            <h2>Details</h2>
            <p>Select an agent, invitation, or team to view more information.</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'AgentsView',
  data() {
    return {
      activeTab: 'agents',
      users: [],
      teams: [],
      invitations: [],
      detail: {
        type: '',
        item: null,
      },
      inviteForm: {
        name: '',
        department: '',
        email: '',
        teamId: '',
      },
      teamForm: {
        name: '',
        description: '',
      },
    }
  },
  computed: {
    pendingInvitations() {
      return this.invitations.filter((invitation) => invitation.status === 'pending' || invitation.status === 'expired')
    },
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      const [users, teams, invitations] = await Promise.all([
        api.getUsers(),
        api.getTeams(),
        api.getInvitations(),
      ])

      this.users = users
      this.teams = teams
      this.invitations = invitations
    },
    teamNamesForUser(user) {
      const userTeamIds = (user.teamIds || []).map((teamId) => String(teamId))
      return this.teams
        .filter((team) => userTeamIds.includes(String(team._id)))
        .map((team) => team.name)
    },
    selectDetail(type, item) {
      this.detail = { type, item }
    },
    invitationLabel(invitation) {
      return invitation.status === 'expired' ? 'Expired' : 'Invitation sent'
    },
    formatDateTime(value) {
      return value ? new Date(value).toLocaleString() : 'N/A'
    },
    async submitInvite() {
      if (!this.inviteForm.email.trim() || !this.inviteForm.teamId) {
        this.flash('Email and team are required before sending an invitation.', 'error')
        return
      }

      await api.inviteAgent(this.inviteForm.teamId, this.inviteForm)
      this.flash('Invitation created successfully.', 'success')
      this.inviteForm = {
        name: '',
        department: '',
        email: '',
        teamId: '',
      }
      await this.loadData()
      this.activeTab = 'agents'
    },
    async sendReminder(invitation) {
      await api.remindInvitation(invitation._id)
      this.flash('Invitation reminder sent.', 'success')
      await this.loadData()
    },
    async submitTeam() {
      if (!this.teamForm.name.trim()) {
        this.flash('Team name is required.', 'error')
        return
      }

      const team = await api.createTeam(this.teamForm)
      this.flash(`Team ${team.name} created successfully.`, 'success')
      this.teamForm = {
        name: '',
        description: '',
      }
      await this.loadData()
      this.activeTab = 'teams'
      this.selectDetail('team', this.teams.find((item) => item._id === team._id) || team)
    },
  },
}
</script>

<style scoped>
.agents-page {
  display: grid;
  gap: 18px;
}

.tab-switch {
  display: flex;
  gap: 10px;
}

.tab-button {
  border: 0;
  background: transparent;
  padding: 0 0 10px;
  cursor: pointer;
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid transparent;
}

.tab-button.active {
  color: #111827;
  border-bottom-color: #2563eb;
}

.main-grid {
  align-items: flex-start;
}

.form-panel,
.list-panel,
.detail-panel {
  margin: 0;
}

.list-panel + .list-panel {
  margin-top: 18px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.list-header h2,
.form-panel h2,
.detail-panel h2 {
  margin: 0;
}

.list-header span,
.empty-copy,
.detail-panel p {
  color: #64748b;
}

.selectable-row {
  cursor: pointer;
}

.status-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.active-status {
  background: #dcfce7;
  color: #166534;
}

.pending-status {
  background: #e0ecff;
  color: #1d4ed8;
}

.member-list {
  margin: 12px 0 0;
  padding-left: 18px;
}

textarea {
  min-height: 90px;
}
</style>
