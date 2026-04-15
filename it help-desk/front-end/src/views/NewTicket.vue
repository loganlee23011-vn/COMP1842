<template>
  <div>
    <h1>New Ticket</h1>
    <TicketForm @createOrUpdate="createOrUpdate" />
  </div>
</template>

<script>
import TicketForm from '../components/TicketForm.vue'
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'NewTicketView',
  components: {
    TicketForm,
  },
  methods: {
    async createOrUpdate(ticket) {
      const res = await api.createTicket(ticket)
      this.flash('Ticket created!', 'success')
      this.$router.push(`/tickets/${res._id}`)
    },
  },
}
</script>
