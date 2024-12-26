<script setup>
  import { defineEmits, defineOptions, defineProps, onMounted } from "vue";

  defineOptions({name: "Hoge"});
  defineProps(["props", "currentTabId", "isFirstVisit", "config", "configWatcher", "step"]);
  const emits = defineEmits(["updateMe", "updateStep", "updateConfig", "onClickedLink"]);

  const tabData = {
    top : {
      text: "トップ",
      // cmp: ReadMeCaution,
    },
    caution : {
      text: "注意",
      // cmp: ReadMeCaution,
    }
  };

  onMounted(()=>{
    emits("updateMe", tabData, "top");
  });
</script>

<template>
  <div v-for="key in Object.keys(tabData)" :key="key" :class="currentTabId == key ? 'main-content' : 'unselected-content'">
    <div>{{ tabData[key].text }}</div>
  </div>
</template>