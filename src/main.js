import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import Toaster from '@meforma/vue-toaster'
createApp(App).use(Toaster).mount('#app')
