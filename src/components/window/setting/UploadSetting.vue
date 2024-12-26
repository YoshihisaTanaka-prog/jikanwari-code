<template>
  <pre>{{ JSON.stringify(config.toObject(), null, 2) }}</pre>
  <button @click="onInput">テスト</button>
</template>

<script setup>
  import { defineEmits, defineProps } from "vue";
  
  defineProps(["config", "configWatcher", "isFirstSetting"]);
  const emit = defineEmits(["onInputedAll", "updateConfig"]);

  function onInput(){
    emit("onInputedAll");
  }
</script>
