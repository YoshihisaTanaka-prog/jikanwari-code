<script setup>
  import $                  from "jquery"
  import { onUpdated, ref } from "vue";

  import MenuButton from "./components/MenuButton.vue";

  import Top from "./components/window/top/00-main.vue";
  import ReadMe from "./components/window/readMe/00-main.vue";
  import License from "./components/window/license/00-main.vue";

  // メニューの選択肢を定義
  const tabData = {
    top : {
      text: "トップ",
      cmp: Top
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
  const childData = ref({});
  for(const tabId of Object.keys(tabData)){
    childData.value[tabId] = {
      currentTabId: "",
      tabData: {},
      drawTabList: [],
      didSetup: false
    };
    if(tabData[tabId].props == null){
      tabData[tabId].props = {};
    }
    if(tabData[tabId].isNeedLink == null){
      tabData[tabId].isNeedLink = false;
    }
  }

  // メインメニューの選択値の管理
  const currentTabId = ref("");
  const menuSelectionLog = [];
  const savedVersion = localStorage.getItem("version");
  if(localStorage.getItem("version") == window.appData.version){
    currentTabId.value = "top";
  } else {
    localStorage.setItem("version", window.appData.version);
    tabData.readMe.props.didUpdate = !(savedVersion == null);
    currentTabId.value = "readMe";
  }
  currentTabId.value = "top";

  // メインメニューに表示する選択肢の管理
  const step = ref(0);
  const drawTabList = [
    ["top", "readMe", "license"],
    ["top", "readMe", "license"],
  ];

  // メニューの選択変更処理
  function onClickedTabButton(id){
    currentTabId.value = id;
    menuSelectionLog.push({main: id, sub: childData.value[id].currentTabId});
  }
  function onClickedSubTabButton(id){
    childData.value[currentTabId.value].currentTabId = id;
    menuSelectionLog.push({main: currentTabId.value, sub: id});
  }
  function onClickedLinkButton(toMainMenuId, toSubMenuId){
    currentTabId.value = toMainMenuId;
    childData.value[toMainMenuId].currentTabId = toSubMenuId;
  }

  // サブメニューの描画管理
  const drawSubMenu = ref(true);

  // 画面サイズ変更時の処理
  const setAndSaveLength = function(){
    window.screenHeight = $("#back-layer").outerHeight();
    window.screenWidth = $("#back-layer").outerWidth();
    window.remFontSize = Number($("#back-layer").css("font-size").slice(0, -2));
    const mainMenuHeight = $("header").outerHeight();
    $(".main-window").outerHeight(window.screenHeight - mainMenuHeight);
    const subMenuWidth = $("#window-of-select-sub-menu").outerWidth();
    $(".main-window").outerWidth(window.screenWidth - subMenuWidth);
    let maxButtonHeight = 0;
    $(".menu-btn").each(function(_, element){
      const height = $(element).outerHeight();
      if(height > maxButtonHeight){
        maxButtonHeight = height;
      }
    });
    $(".menu-btn").outerHeight(maxButtonHeight);
  };
  onUpdated(setAndSaveLength);
  window.addEventListener("resize", setAndSaveLength);

  // 初期化処理
  const onMountedChildComponent = function(tabId, childTabData, initialTabId){
    const updatedUnit = {
      didSetup: true,
      tabData: childTabData,
      currentTabId: initialTabId,
    };
    const updatedData = childData.value;
    updatedData[tabId] = updatedUnit;
    childData.value = updatedData;
  }
</script>

<style scoped>
  #draw-sub-menu-btn-div {
    font-weight: bolder;
    color: #0f0;
    padding-inline: 0.5em;
  }
  #draw-sub-menu-btn-div:hover {
    background-color: #777;
  }
  #top-right-div {
    float: right;
  }
  #download-btn {
    width: 7.5em;
    color: #000;
    background-color: #0c0;
    font-weight: bolder;
  }
  #download-btn:hover {
    background-color: #0a0;
  }
  #message-span {
    color: #0f0
  }
</style>

<template>
  <header>
    <span v-for="tabId in drawTabList[step]" :key="tabId">
      <MenuButton
        :tab-id="tabId"
        :text="tabData[tabId].text"
        :is-clicked="tabId == currentTabId"
        @onclick="(tabId)=>{onClickedTabButton(tabId)}"
      />
    </span>
    <div id="top-right-div">
      <button class="menu-btn" id="download-btn">Download</button>
    </div>
  </header>
  <main>
    <div id="window-of-select-sub-menu">
      <div id="draw-sub-menu-btn-div" v-on:click="setDrawSubMenu"><span id="draw-sub-menu-btn-icon-span">▼</span></div>
      <ul id="sub-menu-ul" v-if="drawSubMenu">
        <li v-for="tabId in Object.keys(childData[currentTabId].tabData)" :key="tabId">
          <MenuButton
            :tab-id="tabId"
            :text="childData[currentTabId].tabData[tabId].text"
            :is-clicked="tabId == childData[currentTabId].currentTabId"
            @onclick="(tabId, childTabData, initialTabId)=>{onClickedSubTabButton(tabId, childTabData, initialTabId)}"
          />
        </li>
      </ul>
    </div>
    <div v-for="tabId in drawTabList[step]" :key="tabId" :class="currentTabId == tabId ? 'main-window' : 'unselected-content'">
      <component
        v-if="tabData[tabId].isNeedLink"
        :is="tabData[tabId].cmp"
        :current-tab-id="childData[tabId].currentTabId"
        :props="tabData[tabId].props"
        @on-mounted-me="(tabData, initialTabId)=>{onMountedChildComponent(tabId, tabData, initialTabId)}"
        @on-clicked-link="(toMainMenuId, toSubMenuId)=>{onClickedLinkButton(toMainMenuId, toSubMenuId)}"
      />
      <component
        v-else
        :is="tabData[tabId].cmp"
        :current-tab-id="childData[tabId].currentTabId"
        :props="tabData[tabId].props"
        @on-mounted-me="(tabData, initialTabId)=>{onMountedChildComponent(tabId, tabData, initialTabId)}"
      />
    </div>
  </main>
</template>