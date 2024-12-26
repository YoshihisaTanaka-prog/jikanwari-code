<template>
  <div v-if="config.mode == 'elemental'">
    <ElementalSchoolAssignment />
  </div>
  <div v-if="config.mode == 'juniorHigh'">
    <JuniorHighSchoolAssignment
      :config="config"
      :config-watcher="configWatcher"
      :is-first-setting="isFirstSetting"
      @on-inputed-all="onInputedAll"
      @update-config="updateConfig"
    />
  </div>
  <div v-if="config.mode == 'high'">
    <HighSchoolAssignment
      :config="config"
      :config-watcher="configWatcher"
      :is-first-setting="isFirstSetting"
      @on-inputed-all="onInputedAll"
      @update-config="updateConfig"
    />
  </div>
</template>

<style scoped>
  div {
    width: 60vw;
  }
</style>

<script setup>
  import { defineEmits, defineOptions, defineProps } from 'vue';

  import ElementalSchoolAssignment from './ElementalSchool.vue';
  import JuniorHighSchoolAssignment from './JuniorHighSchool.vue';
  import HighSchoolAssignment from './HighSchool.vue';

  import TimetableConfig from '@/models/TimetableConfig';

  defineOptions({name: "AssignmentSetting"});
  defineProps({
    config: {type: TimetableConfig, required: true},
    configWatcher: {type: Boolean, required: true},
    isFirstSetting: {type: Boolean, required: true}
  });
  const emits = defineEmits(["onInputedAll", "updateConfig"]);

  const onInputedAll = function (...args) {
    emits("onInputedAll", ...args);
  };

  const updateConfig = function (...args) {
    emits("updateConfig", ...args);
  };
</script>