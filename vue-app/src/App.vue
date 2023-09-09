<script setup>
import { ref, computed } from 'vue'
import HomePage from './components/HomePage.vue'
import HelloWorld from './components/HelloWorld.vue'
import NotFound from './components/NotFound.vue'

const routes = {
  '/': HomePage,
  '/about': HelloWorld
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location
})

const currentView = computed(() => {
  console.log(currentPath.value)
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <a href="vue/">Home</a> |
  <a href="vue/about">About</a> |
  <a href="vue/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>