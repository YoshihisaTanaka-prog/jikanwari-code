<script setup>
  import { defineEmits, defineOptions, defineProps, onMounted } from 'vue';

  import ReadMeCaution from "./read-me-caution.vue";
  import releaseNote from './release-note.vue';

  defineOptions({name: "ReadMe"});
  const props = defineProps(["props", "currentTabId", "isFirstVisit", "config", "configWatcher", "step"]);
  const emits = defineEmits(["updateMe", "updateStep", "updateConfig", "onClickedLink"]);

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
    emits("updateMe", tabData, initialTabId);
  });
</script>

<template>
  <div v-for="key in Object.keys(tabData)" :key="key" :class="currentTabId == key ? 'main-content' : 'unselected-content'">
    <component :is="tabData[key].cmp" />
  </div>
</template>