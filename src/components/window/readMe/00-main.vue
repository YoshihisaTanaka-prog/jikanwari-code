<script setup>
  import { defineProps, defineEmits, onMounted } from 'vue';

  import ReadMeCaution from "./read-me-caution.vue";
  import releaseNote from './release-note.vue';

  const props = defineProps(["props", "currentTabId"]);
  const emits = defineEmits(["onMountedMe"]);

  let initialTabId = "top";
  if(props.props.didUpdate){
    initialTabId = "releaseNote";
  }
  const tabData = {
    top : {
      text: "要点",
      cmp: ReadMeCaution,
    },
    releaseNote: {
      text: "リリースノート",
      cmp: releaseNote
    }
  };

  onMounted(()=>{
    emits("onMountedMe", tabData, initialTabId);
  });
</script>

<template>
  <div v-for="key in Object.keys(tabData)" :key="key" :class="currentTabId == key ? 'main-content' : 'unselected-content'">
    <component :is="tabData[key].cmp" />
  </div>
</template>