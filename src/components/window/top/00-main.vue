<script setup>
  import { defineProps, ref } from "vue";
  import TabItem from "../../TabItem.vue";

  defineProps(["props"]);

  const currentTabId = ref("caution");
  const tabData = {
    "caution" : {
      text: "注意",
      // cmp: ReadMeCaution,
    }
  };

  function onClickTabButton(id){
    if(currentTabId.value != id) {
      currentTabId.value = id;
    }
  }
</script>

<template>
  <ul class="tab">
    <TabItem v-for="tabId in Object.keys(tabData)" :key="tabId" :tab-id="tabId" :text="tabData[tabId].text" :is-clicked="tabId == currentTabId" @onclick="(id) => {onClickTabButton(id)}" />
  </ul>
  <hr class="tab-border">
  <div v-for="key in Object.keys(tabData)" :key="key" :class="currentTabId == key ? 'content' : 'unselected-cntent content'">
    <!-- <component :is="tabData[key].cmp" /> -->
  </div>
</template>