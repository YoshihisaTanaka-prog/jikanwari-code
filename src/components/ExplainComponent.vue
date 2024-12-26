<template>
  <div style="display: flex; margin-block: 1em;">
    <div  style="margin-right: 1em;">
      <button @click="updateShowingStatus">
        {{ isShowingDetails? '×' : '？' }}
      </button>
    </div>
    <div v-if="isShowingDetails" class="explain-detail">
      <template v-for="(line, index) in lines" :key="index">
        <template v-if="index != 0">
          <br>
        </template>
        {{ line }}
      </template>
    </div>
  </div>
</template>

<style scoped>
  button {
    font-size: 0.7rem;
    border: none;
  }
</style>

<script setup>
  import { defineProps, ref } from 'vue';
  const props = defineProps(["text"]);

  const lines = ref(props.text.split("\n").slice(1, -1));

  const isShowingDetails = ref(false);
  const updateShowingStatus = function(){
    isShowingDetails.value = !isShowingDetails.value;
  }
</script>