import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import 'semantic-ui-css/semantic.css'
import { flash } from './helpers/flash'

const app = createApp(App)

app.config.globalProperties.flash = flash

app.use(router).mount('#app')
