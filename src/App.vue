<script setup>
  import { ref } from "vue";
  import TabItem from "./components/TabItem.vue";

  import Default from "./components/window/default/00-main.vue";
  import License from "./components/window/license/00-main.vue";

  const currentTabId = ref("default");
  const tabData = {
    "default" : {
      text: "メイン",
      cmp: Default,
    },
    "license" : {
      text: "ライセンス",
      cmp: License,
    }
  };

  function onClickTabButton(id){
    if(currentTabId.value != id) {
      currentTabId.value = id;
    }
  }
</script>

<template>
  <header>
    <ul id="tab">
      <TabItem v-for="tabId in Object.keys(tabData)" :key="tabId" :tab-id="tabId" :text="tabData[tabId].text" :is-clicked="tabId == currentTabId" @onclick="(id) => {onClickTabButton(id)}" />
    </ul>
    <hr>
  </header>

  <main>
    <div v-for="key in Object.keys(tabData)" :key="key" :class="currentTabId == key ? 'selected-window' : 'unselected-window'">
      <component :is="tabData[key].cmp" />
    </div>
  </main>
</template>

<style scoped>
  #tab {
    display: inline-block;
    padding-left:0;
    list-style: none;
    margin-block: 0;
    place-items: left;
    background-color: #777;
    width: 100%;
  }
  hr {
    margin: 0;
  }
  .unselected-window{
    display: none;
  }
</style>
