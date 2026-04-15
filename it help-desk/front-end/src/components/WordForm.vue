<template>
  <form action="#" class="ui form" @submit.prevent="onSubmit">
    <p v-if="errorsPresent" class="error">Please complete the issue code, response, category, and assignment fields.</p>

    <div class="ui labeled input fluid">
      <div class="ui label">
        Issue Code
      </div>
      <input v-model="formWord.key" type="text" placeholder="e.g. PWD_RESET" />
    </div>

    <div class="field">
      <label>Standard Response</label>
      <textarea
        v-model="formWord.response"
        rows="5"
        placeholder="Enter the approved helpdesk response..."
      ></textarea>
    </div>

    <div class="ui labeled input fluid">
      <div class="ui label">
        Category
      </div>
      <input v-model="formWord.category" type="text" placeholder="e.g. Accounts, Security, Billing" />
    </div>

    <div class="field">
      <label>Assignment Type</label>
      <select v-model="formWord.assignmentType" class="ui fluid dropdown">
        <option value="agent">Agent</option>
        <option value="team">Team</option>
      </select>
    </div>

    <div v-if="formWord.assignmentType === 'agent'" class="field">
      <label>Assigned Agent</label>
      <select v-model="formWord.assignedUserId" class="ui fluid dropdown">
        <option value="">Select agent</option>
        <option v-for="agentOption in agentOptions" :key="agentOption._id" :value="agentOption._id">
          {{ agentOption.name }}
        </option>
      </select>
    </div>

    <div v-else class="field">
      <label>Assigned Team</label>
      <select v-model="formWord.agent" class="ui fluid dropdown">
        <option value="">Select team</option>
        <option v-for="team in teamOptions" :key="team" :value="team">
          {{ team }}
        </option>
      </select>
    </div>

    <button class="positive ui button">Submit</button>
  </form>
</template>

<script>
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'WordForm',
  props: {
    word: {
      type: Object,
      required: false,
      default: () => ({
        key: '',
        response: '',
        category: '',
        assignmentType: 'agent',
        assignedUserId: '',
        agent: '',
      }),
    },
  },
  emits: ['createOrUpdate'],
  data() {
    return {
      errorsPresent: false,
      agentOptions: [],
      teamOptions: [],
      formWord: {
        key: '',
        response: '',
        category: '',
        assignmentType: 'agent',
        assignedUserId: '',
        agent: '',
      },
    }
  },
  watch: {
    word: {
      immediate: true,
      deep: true,
      handler(newWord) {
        const inferredType = newWord?.assignmentType
          || (newWord?.assignedUserId ? 'agent' : 'team')

        this.formWord = {
          ...(newWord || {}),
          key: newWord?.key || '',
          response: newWord?.response || '',
          category: newWord?.category || '',
          assignmentType: inferredType,
          assignedUserId: newWord?.assignedUserId || '',
          agent: newWord?.agent || '',
        }
      },
    },
    'formWord.assignmentType'(value) {
      if (value === 'agent') {
        this.formWord.agent = ''
      } else {
        this.formWord.assignedUserId = ''
      }
    },
  },
  async mounted() {
    const [users, teams] = await Promise.all([api.getUsers(), api.getTeams()])
    this.agentOptions = users
    this.teamOptions = teams.map((team) => team.name)
    if (
      this.formWord.assignmentType === 'agent'
      && !this.formWord.assignedUserId
      && this.formWord.agent
    ) {
      const matchedAgent = this.agentOptions.find((agentOption) => agentOption.name === this.formWord.agent)
      if (matchedAgent) {
        this.formWord.assignedUserId = matchedAgent._id
      }
    }
  },
  methods: {
    onSubmit() {
      const missingBase = (
        this.formWord.key.trim() === ''
        || this.formWord.response.trim() === ''
        || this.formWord.category.trim() === ''
      )

      const missingAssignment = (
        (this.formWord.assignmentType === 'agent' && this.formWord.assignedUserId === '')
        || (this.formWord.assignmentType === 'team' && this.formWord.agent.trim() === '')
      )

      if (missingBase || missingAssignment) {
        this.errorsPresent = true
        return
      }

      const selectedAgent = this.agentOptions.find((agentOption) => agentOption._id === this.formWord.assignedUserId)
      const assignmentName = this.formWord.assignmentType === 'agent'
        ? selectedAgent?.name || 'Unassigned'
        : this.formWord.agent.trim()

      this.errorsPresent = false
      this.$emit('createOrUpdate', {
        ...this.formWord,
        key: this.formWord.key.trim().toUpperCase(),
        response: this.formWord.response.trim(),
        category: this.formWord.category.trim(),
        assignmentType: this.formWord.assignmentType,
        assignedUserId: this.formWord.assignmentType === 'agent' ? this.formWord.assignedUserId : null,
        agent: assignmentName,
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
