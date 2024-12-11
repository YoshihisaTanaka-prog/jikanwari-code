<template>
  <div>
    <h1>{{ title }}</h1>
    <pre class="license-remark">{{ remark1 }}</pre>
    <pre class="license-main">{{ content }}</pre>
    <pre class="license-remark">{{ remark2 }}</pre>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue';
  defineProps(["title", "content", "remark1", "remark2"]);
</script>

<style scoped>
  div {
    font-size: 1rem;
  }

  .license-remark {
    font-size: 0.7em;
  }

  .license-main {
    padding: 1em;
    border-radius: 5px;
    border: 1px solid #000;
  }
</style>