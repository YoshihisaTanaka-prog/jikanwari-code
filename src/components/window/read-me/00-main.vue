<script setup>
  import { defineProps, ref } from 'vue';
  import TabItem from "../../TabItem.vue";

  import ReadMeCaution from "./read-me-caution.vue";
  import releaseNote from './release-note.vue';

  const props = defineProps(["props"]);

  const currentTabId = ref("top");
  if(props.props.didUpdate){
    currentTabId.value = "releaseNote";
  }
  const tabData = {
    top : {
      text: "トップ",
      cmp: ReadMeCaution,
    },
    releaseNote: {
      text: "リリースノート",
      cmp: releaseNote
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
  <div v-for="key in Object.keys(tabData)" :key="key" :class="currentTabId == key ? 'content' : 'unselected-content content'">
    <component :is="tabData[key].cmp" />
  </div>
</template>