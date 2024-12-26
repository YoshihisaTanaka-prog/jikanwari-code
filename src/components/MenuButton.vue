<script setup>
  import { defineEmits, defineProps, ref } from 'vue';
  
  const props = defineProps(["mainTabId", "tabId", "text", "isClicked"]);
  const $emit = defineEmits(["onclick"]);

  const btnId = ref(`menu-${props.mainTabId == null ? props.tabTd : [props.mainTabId, props.tabId].join("-")}-btn`)
  
  function clicked(){
    if(!props.isClicked){
      $emit("onclick", props.tabId);
    }
  }
</script>

<template>
  <button :id="btnId" v-on:click="clicked" :class="isClicked ? 'selected-btn menu-btn' : 'menu-btn'">{{ text }}</button>
</template>

<style scoped>
  button{
    color: #0f0;
    background-color: #333;
    width: 7.5rem;
    height: 100%;
    border-radius: 0;
    border: 1px solid #000;
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
