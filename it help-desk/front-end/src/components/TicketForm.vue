<template>
  <form class="ui form" @submit.prevent="onSubmit">
    <p v-if="errorsPresent" class="error">Please complete all required ticket fields.</p>

    <div class="ui labeled input fluid">
      <div class="ui label">Ticket Code</div>
      <input v-model="formTicket.ticketCode" type="text" placeholder="e.g. TCK-001" />
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">Subject</div>
      <input v-model="formTicket.subject" type="text" placeholder="e.g. Cannot connect to VPN" />
    </div>

    <div class="ui two column stackable grid">
      <div class="column">
        <div class="ui labeled input fluid">
          <div class="ui label">Requester</div>
          <input v-model="formTicket.requesterName" type="text" placeholder="Requester name" />
        </div>
      </div>
      <div class="column">
        <div class="ui labeled input fluid">
          <div class="ui label">Requester Email</div>
          <input v-model="formTicket.requesterEmail" type="email" placeholder="requester@email.com" />
        </div>
      </div>
    </div>

    <div class="ui two column stackable grid">
      <div class="column">
        <div class="ui labeled input fluid">
          <div class="ui label">Category</div>
          <input v-model="formTicket.category" type="text" placeholder="e.g. Network" />
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label>Priority</label>
          <select v-model="formTicket.priority" class="ui fluid dropdown">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
    </div>

    <div class="ui two column stackable grid">
      <div class="column">
        <div class="field">
          <label>Status</label>
          <select v-model="formTicket.status" class="ui fluid dropdown">
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label>Assignment Type</label>
          <select v-model="formTicket.assignmentType" class="ui fluid dropdown">
            <option value="agent">Agent</option>
            <option value="team">Team</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="formTicket.assignmentType === 'agent'" class="field">
      <label>Assigned Agent</label>
      <select v-model="formTicket.assignedUserId" class="ui fluid dropdown">
        <option value="">Select agent</option>
        <option v-for="agentOption in agentOptions" :key="agentOption._id" :value="agentOption._id">
          {{ agentOption.name }}
        </option>
      </select>
    </div>

    <div v-else class="field">
      <label>Assigned Team</label>
      <select v-model="formTicket.assignedTo" class="ui fluid dropdown">
        <option value="">Select team</option>
        <option v-for="team in teamOptions" :key="team" :value="team">{{ team }}</option>
      </select>
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">Linked Response</div>
      <select v-model="formTicket.linkedResponseCode" class="ui fluid dropdown">
        <option value="">None</option>
        <option v-for="response in responseOptions" :key="response._id" :value="response.key">
          {{ response.key }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>Description</label>
      <textarea v-model="formTicket.description" rows="5" placeholder="Describe the issue..."></textarea>
    </div>

    <button class="positive ui button">Submit</button>
  </form>
</template>

<script>
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'TicketForm',
  props: {
    ticket: {
      type: Object,
      required: false,
      default: () => ({
        ticketCode: '',
        subject: '',
        requesterName: '',
        requesterEmail: '',
        category: '',
        priority: 'Medium',
        status: 'Open',
        folder: 'Inbox',
        assignmentType: 'agent',
        assignedUserId: '',
        assignedTo: '',
        linkedResponseCode: '',
        description: '',
      }),
    },
  },
  emits: ['createOrUpdate'],
  data() {
    return {
      errorsPresent: false,
      agentOptions: [],
      responseOptions: [],
      teamOptions: [],
      formTicket: {
        ticketCode: '',
        subject: '',
        requesterName: '',
        requesterEmail: '',
        category: '',
        priority: 'Medium',
        status: 'Open',
        folder: 'Inbox',
        assignmentType: 'agent',
        assignedUserId: '',
        assignedTo: '',
        linkedResponseCode: '',
        description: '',
      },
    }
  },
  watch: {
    ticket: {
      immediate: true,
      deep: true,
      handler(newTicket) {
        this.formTicket = {
          ...(newTicket || {}),
          ticketCode: newTicket?.ticketCode || '',
          subject: newTicket?.subject || '',
          requesterName: newTicket?.requesterName || '',
          requesterEmail: newTicket?.requesterEmail || '',
          category: newTicket?.category || '',
          priority: newTicket?.priority || 'Medium',
          status: newTicket?.status || 'Open',
          folder: newTicket?.folder || 'Inbox',
          assignmentType: newTicket?.assignmentType || 'agent',
          assignedUserId: newTicket?.assignedUserId || '',
          assignedTo: newTicket?.assignedTo || '',
          linkedResponseCode: newTicket?.linkedResponseCode || '',
          description: newTicket?.description || '',
        }
      },
    },
    'formTicket.assignmentType'(value) {
      if (value === 'agent') {
        this.formTicket.assignedTo = ''
      } else {
        this.formTicket.assignedUserId = ''
      }
    },
  },
  async mounted() {
    const [users, teams, responses] = await Promise.all([api.getUsers(), api.getTeams(), api.getWords()])
    this.agentOptions = users
    this.teamOptions = teams.map((team) => team.name)
    this.responseOptions = responses
    if (
      this.formTicket.assignmentType === 'agent'
      && !this.formTicket.assignedUserId
      && this.formTicket.assignedTo
    ) {
      const matchedAgent = this.agentOptions.find((agentOption) => agentOption.name === this.formTicket.assignedTo)
      if (matchedAgent) {
        this.formTicket.assignedUserId = matchedAgent._id
      }
    }
  },
  methods: {
    onSubmit() {
      const missingBase = (
        this.formTicket.ticketCode.trim() === ''
        || this.formTicket.subject.trim() === ''
        || this.formTicket.requesterName.trim() === ''
        || this.formTicket.requesterEmail.trim() === ''
        || this.formTicket.category.trim() === ''
        || this.formTicket.description.trim() === ''
      )

      const missingAssignment = (
        (this.formTicket.assignmentType === 'agent' && this.formTicket.assignedUserId === '')
        || (this.formTicket.assignmentType === 'team' && this.formTicket.assignedTo.trim() === '')
      )

      if (missingBase || missingAssignment) {
        this.errorsPresent = true
        return
      }

      const assignedAgent = this.agentOptions.find((agentOption) => agentOption._id === this.formTicket.assignedUserId)
      const assignedTo = this.formTicket.assignmentType === 'agent'
        ? assignedAgent?.name || 'Unassigned'
        : this.formTicket.assignedTo.trim()

      this.errorsPresent = false
      this.$emit('createOrUpdate', {
        ...this.formTicket,
        ticketCode: this.formTicket.ticketCode.trim().toUpperCase(),
        subject: this.formTicket.subject.trim(),
        requesterName: this.formTicket.requesterName.trim(),
        requesterEmail: this.formTicket.requesterEmail.trim().toLowerCase(),
        category: this.formTicket.category.trim(),
        assignedTo,
        linkedResponseCode: this.formTicket.linkedResponseCode.trim().toUpperCase(),
        description: this.formTicket.description.trim(),
      })
    },
  },
}
</script>

<style scoped>
.error {
  color: #9f3a38;
  margin-bottom: 12px;
}

textarea {
  min-height: 120px;
}
</style>
