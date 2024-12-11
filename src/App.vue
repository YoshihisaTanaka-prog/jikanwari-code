<script setup>
  import { ref } from "vue";
  import TabItem from "./components/TabItem.vue";

  import Top from "./components/window/top/00-main.vue";
  import ReadMe from "./components/window/read-me/00-main.vue";
  import License from "./components/window/license/00-main.vue";

  const currentTabId = ref("");

  const step = ref(0);
  const drawTabList = [
    ["top", "readMe", "license"],
    ["top", "readMe", "license"],
  ];
  const tabData = {
    top : {
      text: "トップ",
      cmp: Top,
      props: {}
    },
    readMe : {
      text: "説明書",
      cmp: ReadMe,
      props: {
        didUpdate: false
      }
    },
    license : {
      text: "ライセンス",
      cmp: License,
      props: {}
    }
  };

  const savedVersion = localStorage.getItem("version");
  if(localStorage.getItem("version") == window.appData.version){
    currentTabId.value = "top";
  } else {
    localStorage.setItem("version", window.appData.version);
    tabData.readMe.props.didUpdate = !(savedVersion == null);
    currentTabId.value = "readMe";
  }

  function onClickTabButton(id){
    if(currentTabId.value != id) {
      currentTabId.value = id;
    }
  }
</script>

<template>
  <header>
    <ul id="tab" class="tab">
      <TabItem v-for="tabId in drawTabList[step]" :key="tabId" :tab-id="tabId" :text="tabData[tabId].text" :is-clicked="tabId == currentTabId" @onclick="(id) => {onClickTabButton(id)}" />
    </ul>
    <hr id="tab-border" class="tab-border">
  </header>

  <main>
    <div v-for="tabId in drawTabList[step]" :key="tabId" :class="currentTabId == tabId ? 'window' : 'unselected-window window'">
      <component :is="tabData[tabId].cmp" :props="tabData[tabId].props" />
    </div>
  </main>
</template>