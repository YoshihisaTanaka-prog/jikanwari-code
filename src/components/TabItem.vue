<script setup>
  import { defineEmits, defineProps } from 'vue';
  
  const props = defineProps(["tabId", "text", "isClicked"]);
  const $emit = defineEmits(["onclick"]);

  function clicked(){
    $emit("onclick", props.tabId);
  }
</script>

<template>
  <li>
    <button v-on:click="clicked" :class="isClicked ? 'selected-btn' : 'unselected-btn'">{{ text }}</button>
  </li>
</template>

<style scoped>
  li {
    display: inline-block;
  }
  button{
    color: #fff;
    background-color: #333;
    width: 7.5rem;
  }
  button:hover{
    background-color: #555;
  }
  .selected-btn{
    background-color: #555;
  }
  .selected-btn:hover{
    background-color: #777;
  }
</style>
