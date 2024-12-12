<script setup>
  import { defineEmits, defineProps, onMounted } from "vue";

  defineProps(["props", "currentTabId"]);
  const emits = defineEmits(["onMountedMe"]);

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
    emits("onMountedMe", tabData, "top");
  });
</script>

<template>
  <div v-for="key in Object.keys(tabData)" :key="key" :class="currentTabId == key ? 'main-content' : 'unselected-content'">
    <div>{{ tabData[key].text }}</div>
  </div>
</template>