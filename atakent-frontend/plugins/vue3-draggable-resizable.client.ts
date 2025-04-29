import { defineNuxtPlugin } from '#app'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Vue3DraggableResizable', Vue3DraggableResizable)
})
