<template>
  <p>
    <button @click="emit('clickedBtn')">↑&nbsp;Hide</button>
  </p>
</template>

<style scoped>
  p {
    width: 100%;
    text-align: center;
  }
  button {
    border: none;
  }
</style>

<script setup>
  import { defineEmits } from 'vue';
  const emit = defineEmits(['clickedBtn']);
</script>