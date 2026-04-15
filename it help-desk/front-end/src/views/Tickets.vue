<template>
  <div class="tickets-page">
    <div class="page-header">
      <div>
        <h1>Support Tickets</h1>
      </div>
      <RouterLink class="ui primary button action-button" :to="{ name: 'new-ticket' }">New Ticket</RouterLink>
    </div>

    <div class="ui two column stackable grid top-filters">
      <div class="column">
        <div class="ui fluid input">
          <input v-model="searchTerm" type="text" placeholder="Search tickets..." />
        </div>
      </div>
      <div class="column">
        <select v-model="selectedStatus" class="ui fluid dropdown">
          <option value="">All statuses</option>
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
    </div>

    <div class="content-grid">
      <div class="sidebar-column">
        <div class="ui segment sidebar-panel">
          <div class="panel-block">
            <div class="panel-title">Views</div>
            <button
              v-for="view in viewOptions"
              :key="view.key"
              type="button"
              class="panel-link"
              :class="{ active: activeView === view.key }"
              @click="activeView = view.key"
            >
              <span>{{ view.label }}</span>
              <span class="count">{{ view.count }}</span>
            </button>
          </div>

          <div class="panel-block">
            <div class="panel-title">Status</div>
            <button
              v-for="status in statusSidebarOptions"
              :key="status.key"
              type="button"
              class="panel-link"
              :class="{ active: activeStatus === status.key }"
              @click="activeStatus = status.key"
            >
              <span>{{ status.label }}</span>
              <span class="count">{{ status.count }}</span>
            </button>
          </div>

          <div class="panel-block">
            <div class="panel-title">Folders</div>
            <button
              v-for="folder in folderOptions"
              :key="folder.key"
              type="button"
              class="panel-link"
              :class="{ active: activeFolder === folder.key }"
              @click="activeFolder = folder.key"
            >
              <span>{{ folder.label }}</span>
              <span class="count">{{ folder.count }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="content-column">
        <div class="list-panel">
          <div class="list-header">
            <div>
              <h2>Ticket List</h2>
              <span>{{ filteredTickets.length }} ticket(s) found</span>
            </div>
          </div>

          <div class="table-wrap">
            <table class="ui celled compact table tickets-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Folder</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ticket in filteredTickets" :key="ticket._id">
                  <td>
                    <RouterLink :to="{ name: 'show-ticket', params: { id: ticket._id } }">
                      {{ ticket.ticketCode }} - {{ ticket.subject }}
                    </RouterLink>
                  </td>
                  <td>{{ ticket.assignedTo || 'Unassigned' }}</td>
                  <td><span class="status-pill">{{ ticket.status }}</span></td>
                  <td><span class="priority-pill" :class="priorityClass(ticket.priority)">{{ ticket.priority }}</span></td>
                  <td>{{ ticket.folder || 'Inbox' }}</td>
                  <td>{{ formatDate(ticket.updatedAt) }}</td>
                  <td class="actions-cell">
                    <div class="action-menu-shell">
                      <button class="menu-trigger" type="button" @click="toggleMenu($event, ticket._id)">...</button>
                      <div
                        v-if="openMenuId === ticket._id"
                        class="action-menu"
                        :style="openMenuStyle"
                      >
                        <div class="menu-section">
                          <div class="menu-title">Set Priority</div>
                          <button type="button" class="menu-item" @click="quickUpdate(ticket, { priority: 'Low' })">Low</button>
                          <button type="button" class="menu-item" @click="quickUpdate(ticket, { priority: 'Medium' })">Medium</button>
                          <button type="button" class="menu-item" @click="quickUpdate(ticket, { priority: 'High' })">High</button>
                        </div>

                        <div class="menu-section">
                          <div class="menu-title">Set Status</div>
                          <button type="button" class="menu-item" @click="quickUpdate(ticket, { status: 'Open' })">Open</button>
                          <button type="button" class="menu-item" @click="quickUpdate(ticket, { status: 'Pending' })">Pending</button>
                          <button type="button" class="menu-item" @click="quickUpdate(ticket, { status: 'Resolved' })">Resolved</button>
                          <button type="button" class="menu-item" @click="quickUpdate(ticket, { status: 'Closed' })">Closed</button>
                        </div>

                        <div class="menu-section">
                          <div class="menu-title">Move</div>
                          <button type="button" class="menu-item" @click="quickUpdate(ticket, { folder: 'Inbox' })">Inbox</button>
                          <button type="button" class="menu-item" @click="quickUpdate(ticket, { folder: 'Archive' })">Archive</button>
                          <button type="button" class="menu-item" @click="quickUpdate(ticket, { folder: 'Spam' })">Spam</button>
                          <button type="button" class="menu-item danger" @click="quickUpdate(ticket, { folder: 'Trash' })">Trash</button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="filteredTickets.length === 0" class="empty-copy">No tickets match the current filters.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers/helpers'
import { sessionState } from '../helpers/session'

export default {
  name: 'TicketsView',
  data() {
    return {
      sessionState,
      tickets: [],
      searchTerm: '',
      selectedStatus: '',
      activeView: 'all',
      activeStatus: 'all',
      activeFolder: 'all',
      openMenuId: null,
      openMenuStyle: {},
    }
  },
  computed: {
    statusOptions() {
      return ['Open', 'Pending', 'Resolved', 'Closed']
    },
    filteredTickets() {
      const term = this.searchTerm.trim().toLowerCase()

      return this.tickets.filter((ticket) => {
        const folder = ticket.folder || 'Inbox'
        const assignedTo = ticket.assignedTo || 'Unassigned'

        const matchesSearch = !term
          || ticket.ticketCode?.toLowerCase().includes(term)
          || ticket.subject?.toLowerCase().includes(term)
          || ticket.requesterName?.toLowerCase().includes(term)
          || assignedTo.toLowerCase().includes(term)

        const matchesTopStatus = !this.selectedStatus || ticket.status === this.selectedStatus
        const matchesSidebarStatus = this.activeStatus === 'all' || ticket.status === this.activeStatus
        const matchesFolder = this.activeFolder === 'all' || folder === this.activeFolder

        let matchesView = true
        if (this.activeView === 'mine') {
          matchesView = assignedTo === this.sessionState.user?.name
        } else if (this.activeView === 'unassigned') {
          matchesView = assignedTo === 'Unassigned'
        } else if (this.activeView === 'solved') {
          matchesView = ticket.status === 'Resolved' || ticket.status === 'Closed'
        }

        return matchesSearch && matchesTopStatus && matchesSidebarStatus && matchesFolder && matchesView
      })
    },
    viewOptions() {
      return [
        { key: 'all', label: 'All recent tickets', count: this.tickets.length },
        { key: 'mine', label: 'My tickets', count: this.countBy((ticket) => (ticket.assignedTo || 'Unassigned') === this.sessionState.user?.name) },
        { key: 'unassigned', label: 'Unassigned', count: this.countBy((ticket) => (ticket.assignedTo || 'Unassigned') === 'Unassigned') },
        { key: 'solved', label: 'Solved', count: this.countBy((ticket) => ticket.status === 'Resolved' || ticket.status === 'Closed') },
      ]
    },
    statusSidebarOptions() {
      return [
        { key: 'all', label: 'All', count: this.tickets.length },
        { key: 'Open', label: 'Open', count: this.countBy((ticket) => ticket.status === 'Open') },
        { key: 'Pending', label: 'Pending', count: this.countBy((ticket) => ticket.status === 'Pending') },
        { key: 'Resolved', label: 'Resolved', count: this.countBy((ticket) => ticket.status === 'Resolved') },
        { key: 'Closed', label: 'Closed', count: this.countBy((ticket) => ticket.status === 'Closed') },
      ]
    },
    folderOptions() {
      return [
        { key: 'all', label: 'All', count: this.tickets.length },
        { key: 'Inbox', label: 'Inbox', count: this.countBy((ticket) => (ticket.folder || 'Inbox') === 'Inbox') },
        { key: 'Archive', label: 'Archive', count: this.countBy((ticket) => (ticket.folder || 'Inbox') === 'Archive') },
        { key: 'Spam', label: 'Spam', count: this.countBy((ticket) => (ticket.folder || 'Inbox') === 'Spam') },
        { key: 'Trash', label: 'Trash', count: this.countBy((ticket) => (ticket.folder || 'Inbox') === 'Trash') },
      ]
    },
  },
  mounted() {
    document.addEventListener('click', this.handleDocumentClick)
    this.loadTickets()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleDocumentClick)
  },
  methods: {
    async loadTickets() {
      this.tickets = await api.getTickets()
    },
    countBy(predicate) {
      return this.tickets.filter(predicate).length
    },
    formatDate(value) {
      return value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    priorityClass(priority) {
      return {
        high: priority === 'High',
        medium: priority === 'Medium',
        low: priority === 'Low',
      }
    },
    toggleMenu(event, ticketId) {
      if (this.openMenuId === ticketId) {
        this.openMenuId = null
        this.openMenuStyle = {}
        return
      }

      const rect = event.currentTarget.getBoundingClientRect()
      this.openMenuId = ticketId
      this.openMenuStyle = {
        position: 'fixed',
        top: `${rect.bottom + 6}px`,
        left: `${Math.max(16, rect.right - 180)}px`,
      }
    },
    handleDocumentClick(event) {
      if (!this.openMenuId) return

      if (!event.target.closest('.action-menu-shell')) {
        this.openMenuId = null
        this.openMenuStyle = {}
      }
    },
    async quickUpdate(ticket, changes) {
      const updatedTicket = {
        ...ticket,
        ...changes,
      }

      await api.updateTicket(updatedTicket)
      this.openMenuId = null
      this.flash('Ticket updated successfully!', 'success')
      await this.loadTickets()
    },
  },
}
</script>

<style scoped>
.tickets-page {
  display: grid;
  gap: 20px;
}

.page-header,
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.action-button {
  white-space: nowrap;
  min-width: 140px;
}

.top-filters {
  margin-bottom: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.sidebar-panel,
.list-panel {
  margin: 0;
}

.list-panel {
  padding: 0;
  width: 100%;
}

.panel-block + .panel-block {
  margin-top: 22px;
}

.panel-title {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
}

.panel-link {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: 0;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
}

.panel-link.active {
  background: #eef2f7;
  font-weight: 600;
}

.count {
  color: #64748b;
  font-size: 12px;
}

.list-header h2 {
  margin: 0;
}

.list-header span,
.empty-copy {
  color: #64748b;
}

.tickets-table td {
  vertical-align: top;
}

.table-wrap {
  width: 100%;
}

.tickets-table {
  width: 100%;
  table-layout: fixed;
}

.tickets-table th {
  white-space: nowrap;
}

.tickets-table th:nth-child(1),
.tickets-table td:nth-child(1) {
  width: 36%;
}

.tickets-table th:nth-child(2),
.tickets-table td:nth-child(2) {
  width: 20%;
}

.tickets-table th:nth-child(3),
.tickets-table td:nth-child(3),
.tickets-table th:nth-child(4),
.tickets-table td:nth-child(4),
.tickets-table th:nth-child(5),
.tickets-table td:nth-child(5),
.tickets-table th:nth-child(6),
.tickets-table td:nth-child(6),
.tickets-table th:nth-child(7),
.tickets-table td:nth-child(7) {
  white-space: nowrap;
}

.tickets-table td:nth-child(1) a,
.tickets-table td:nth-child(2) {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.status-pill,
.priority-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status-pill {
  background: #e0ecff;
  color: #1d4ed8;
}

.priority-pill {
  background: #f3f4f6;
  color: #111827;
}

.priority-pill.high {
  background: #fee2e2;
  color: #b91c1c;
}

.priority-pill.medium {
  background: #fef3c7;
  color: #92400e;
}

.priority-pill.low {
  background: #dcfce7;
  color: #166534;
}

.actions-cell {
  position: relative;
}

.action-menu-shell {
  display: inline-block;
}

.menu-trigger {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 6px;
}

.menu-trigger:hover {
  background: #f1f5f9;
}

.action-menu {
  width: 180px;
  background: #fff;
  border: 1px solid #dbe4f0;
  border-radius: 10px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.14);
  z-index: 10;
  overflow: hidden;
}

.menu-section + .menu-section {
  border-top: 1px solid #e5e7eb;
}

.menu-title {
  padding: 10px 12px 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
}

.menu-item {
  width: 100%;
  border: 0;
  background: transparent;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  display: block;
}

.menu-item:hover {
  background: #f8fafc;
}

.menu-item.danger {
  color: #b91c1c;
}

@media (max-width: 960px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
