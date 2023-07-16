<template>
  <div>
      <Navbar />

    <NuxtLayout>
      <NuxtPage class="mx-auto p-4"/>
    </NuxtLayout>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'

</script>

<style lang="postcss">
body {
  @apply min-h-screen bg-white dark:bg-gray-900 dark:text-gray-200 antialiased; 
}
</style>