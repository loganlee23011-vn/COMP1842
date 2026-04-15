<template>
  <div>
    <h1>Edit Ticket</h1>
    <TicketForm :ticket="ticket" @createOrUpdate="createOrUpdate" />
  </div>
</template>

<script>
import TicketForm from '../components/TicketForm.vue'
import { api } from '../helpers/helpers/helpers'

export default {
  name: 'EditTicketView',
  components: {
    TicketForm,
  },
  data() {
    return {
      ticket: {},
    }
  },
  async mounted() {
    this.ticket = await api.getTicket(this.$route.params.id)
  },
  methods: {
    async createOrUpdate(ticket) {
      await api.updateTicket(ticket)
      this.flash('Ticket updated successfully!', 'success')
      this.$router.push(`/tickets/${ticket._id}`)
    },
  },
}
</script>
