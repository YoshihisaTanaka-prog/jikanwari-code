<script setup>
  import { defineEmits, defineOptions, defineProps, onMounted, ref } from "vue";

  import AssignmetSetting from "./Assignment/00-main.vue";
  import SetMode from "./SetMode.vue";
  import SchoolInfoSetting from "./SchoolInfo/00-Main.vue";
  import UploadSetting from "./UploadSetting.vue";

  import TimetableConfig from "@/models/TimetableConfig";
  
  defineOptions({name: "Setting"});
  const props = defineProps({
    props: {type: Object},
    currentTabId: {type: String},
    isFirstVisit: {type: Boolean},
    config: {type: TimetableConfig},
    configWatcher: {type: Boolean},
    step: {type: Number}
  });
  const emits = defineEmits(["updateMe", "updateStep", "updateConfig", "onClickedLink"]);

  const isInitializingSetting = ref(false);

  const tabData = {
    upload: {
      text: "アップロード",
      cmp: UploadSetting,
    },
    assignment: {
      text: "担当教師入力",
      cmp: AssignmetSetting
    },
    schoolInfo: {
      text: "学校の基本情報",
      cmp: SchoolInfoSetting,
    },
    setMode: {
      text: "小・中・高選択",
      cmp: SetMode
    }
  };

  function onInputedAll(key){
    if(isInitializingSetting.value){
      switch (key) {
        case "setMode":
          emits("updateMe", {schoolInfo: tabData.schoolInfo, setMode: tabData.setMode}, "schoolInfo");
          break;
        case "schoolInfo":
          emits("updateMe", {assignment: tabData.assignment, schoolInfo: tabData.schoolInfo, setMode: tabData.setMode}, "assignment");
          break;
        default:
          emits("updateStep", 1);
          emits("updateMe", tabData, props.currentTabId);
          break;
      }
    } else if(key == "setMode") {
      isInitializingSetting.value = true;
      emits("updateMe", {schoolInfo: tabData.schoolInfo, setMode: tabData.setMode}, "schoolInfo");
    }
  }

  onMounted(()=>{
    const args = [];
    if(props.isFirstVisit){
      args.push({setMode: tabData.setMode}, "setMode");
      isInitializingSetting.value = true;
    } else {
      args.push(tabData, "upload");
    }
    emits("updateMe", ...args);
  });
</script>

<template>
  <div>
    <div v-for="key in Object.keys(tabData)" :key="key" :class="currentTabId == key ? 'main-content' : 'unselected-content'">
      <component
        :is="tabData[key].cmp"
        :config="config"
        :config-watcher="configWatcher"
        :is-first-setting="isInitializingSetting"
        @update-config="(newConfigData)=>{emits('updateConfig', newConfigData)}"
        @on-inputed-all="()=>{onInputedAll(key)}"
      />
    </div>
  </div>
</template>