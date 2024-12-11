<template>
  <div>
    <h1>リリースノート {{ appData.name }} ver.{{ appData.version }}</h1>
  </div>
</template>

<script setup>
  const appData = window.appData;
</script>