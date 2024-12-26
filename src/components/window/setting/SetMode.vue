<template>
  <ul>
    <li>
      <button @click="()=>{setMode('elemental')}">小学校モード</button>
      <span v-if="currentMode == 'elemental'">（選択中）</span>
    </li>
    <li>
      <button @click="()=>{setMode('juniorHigh')}">中学校モード</button>
      <span v-if="currentMode == 'juniorHigh'">（選択中）</span>
    </li>
    <li>
      <button @click="()=>{setMode('high')}">高校モード</button>
      <span v-if="currentMode == 'high'">（選択中）</span>
    </li>
  </ul>
</template>

<style scoped>
  button {
    font-size: 2rem;
    width:14rem;
    text-align: left;
  }
  ul {
    padding-inline: 0;
    padding-block: 4em;
    list-style: none;
  }
  li {
    margin-block: 0.7rem;
  }
</style>

<script setup>
  import { defineEmits, defineProps, ref, watch } from 'vue';

  const props = defineProps(["config", "configWatcher", "isFirstSetting"]);
  const emit = defineEmits(['onInputedAll', "updateConfig"]);
  
  const currentMode = ref(props.config.mode);
  watch(()=>props.configWatcher, ()=>{
    currentMode.value = props.config.mode;
  })

  const setMode = function(mode){
    if(mode != currentMode.value){
      let modeText = ""
      if(mode == "elemental"){
        modeText = "小学校";
      }
      if(mode == "juniorHigh"){
        modeText = "中学校";
      }
      if(mode == "high"){
        modeText = "高校";
      }
      const result = confirm(`${modeText}モードにしますか？${"\n"}※ モードを変更すると、データは失われます。※`);
      if(result){
        emit("updateConfig", mode);
        emit("onInputedAll");
      }
    }
  }
</script>