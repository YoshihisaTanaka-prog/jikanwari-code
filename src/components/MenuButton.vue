<script setup>
  import { defineEmits, defineProps } from 'vue';
  
  const props = defineProps(["tabId", "text", "isClicked"]);
  const $emit = defineEmits(["onclick"]);
  
  function clicked(){
    if(!props.isClicked){
      $emit("onclick", props.tabId);
    }
  }
</script>

<template>
  <button v-on:click="clicked" :class="isClicked ? 'selected-btn menu-btn' : 'menu-btn'">{{ text }}</button>
</template>

<style scoped>
  button{
    color: #0f0;
    background-color: #333;
    width: 7.5rem;
    height: 100%;
    font-weight: bolder;
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
