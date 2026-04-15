<template>
  <div>
    <h1>Support Ticket</h1>

    <div class="ui labeled input fluid">
      <div class="ui label">Ticket Code</div>
      <input type="text" readonly :value="ticket.ticketCode" />
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">Subject</div>
      <input type="text" readonly :value="ticket.subject" />
    </div>

    <div class="ui two column stackable grid">
      <div class="column">
        <div class="ui labeled input fluid">
          <div class="ui label">Requester</div>
          <input type="text" readonly :value="ticket.requesterName" />
        </div>
      </div>
      <div class="column">
        <div class="ui labeled input fluid">
          <div class="ui label">Requester Email</div>
          <input type="text" readonly :value="ticket.requesterEmail" />
        </div>
      </div>
    </div>

    <div class="ui three column stackable grid">
      <div class="column">
        <div class="ui labeled input fluid">
          <div class="ui label">Category</div>
          <input type="text" readonly :value="ticket.category" />
        </div>
      </div>
      <div class="column">
        <div class="ui labeled input fluid">
          <div class="ui label">Priority</div>
          <input type="text" readonly :value="ticket.priority" />
        </div>
      </div>
      <div class="column">
        <div class="ui labeled input fluid">
          <div class="ui label">Status</div>
          <input type="text" readonly :value="ticket.status" />
        </div>
      </div>
      <div class="column">
        <div class="ui labeled input fluid">
          <div class="ui label">Folder</div>
          <input type="text" readonly :value="ticket.folder || 'Inbox'" />
        </div>
      </div>
    </div>

    <div class="ui two column stackable grid">
      <div class="column">
        <div class="ui labeled input fluid">
          <div class="ui label">Assignment Type</div>
          <input type="text" readonly :value="ticket.assignmentType" />
        </div>
      </div>
      <div class="column">
        <div class="ui labeled input fluid">
          <div class="ui label">Assigned To</div>
          <input type="text" readonly :value="ticket.assignedTo" />
        </div>
      </div>
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">Linked Response</div>
      <input type="text" readonly :value="ticket.linkedResponseCode || 'None'" />
    </div>

    <div class="ui form">
      <div class="field">
        <label>Description</label>
        <textarea readonly rows="6" :value="ticket.description"></textarea>
      </div>
    </div>

    <div class="actions">
      <p class="meta">Last updated: {{ formatDate(ticket.updatedAt) }}</p>
      <RouterLink :to="{ name: 'edit-ticket', params: { id: $route.params.id } }">
        Edit ticket
      </RouterLink>
      <button type="button" class="delete-link" @click="onDelete">
        Delete ticket
      </button>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'ShowTicketView',
  data() {
    return {
      ticket: {},
    }
  },
  methods: {
    formatDate(value) {
      return value ? new Date(value).toLocaleString() : 'N/A'
    },
    async onDelete() {
      const sure = window.confirm('Are you sure you want to delete this ticket?')
      if (!sure) return

      await api.deleteTicket(this.$route.params.id)
      this.flash('Ticket deleted successfully!', 'success')
      this.$router.push('/tickets')
    },
  },
  async mounted() {
    this.ticket = await api.getTicket(this.$route.params.id)
  },
}
</script>

<style scoped>
.meta {
  margin-top: 16px;
  color: #64748b;
}

.actions a {
  display: inline-block;
  margin-top: 8px;
  text-decoration: underline;
}

.delete-link {
  display: inline-block;
  margin-top: 8px;
  margin-left: 16px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #b91c1c;
  text-decoration: underline;
  cursor: pointer;
}
</style>
