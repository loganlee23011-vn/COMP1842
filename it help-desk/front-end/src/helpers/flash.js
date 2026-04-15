import { reactive } from 'vue'

export const flashState = reactive({
  message: '',
  type: '',
  visible: false,
})

let flashTimer = null

export function flash(message, type = 'success', timeout = 3000) {
  flashState.message = message
  flashState.type = type
  flashState.visible = true

  if (flashTimer) {
    clearTimeout(flashTimer)
  }

  flashTimer = setTimeout(() => {
    flashState.visible = false
    flashState.message = ''
    flashState.type = ''
  }, timeout)
}
