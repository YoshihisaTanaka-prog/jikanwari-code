<template>
  <h3 @click="updateShowingStatus">{{ isShowingDetails ? "▼" : "▶" }}&nbsp;各学年のクラス数</h3>
  &nbsp;&nbsp;
  {{ isFirstSetting ? `← クリックして詳細を${isShowingDetails ? '非' : ''}表示` : '' }}
  <template v-if="isShowingDetails">
    <ExplainComponent :text="explainText" />
    <div v-for="(length, grade) in gradesData" :key="grade">
      <HomeroomUnit :grade="grade" :length="length" @set-grade="setGrade" />
    </div>
    <HideButton @clicked-btn="updateShowingStatus()" />
  </template>
</template>

<style scoped>
  h3 {
    display: inline-block;
  }
  h3:hover {
    background-color: #aaa;
  }
</style>

<script setup>
  import HideButton from "@/components/HideButton.vue";
  import ExplainComponent from "@/components/ExplainComponent.vue";
  const explainText = `
各学年のクラス数を設定します。
編集はこのページでしか行えません。
  `;

  import { defineEmits, defineOptions, defineProps, ref } from "vue";

  import HomeroomUnit from "./HomeroomUnit.vue";

  defineOptions({name: "HomeroomSetting"});
  const props = defineProps(["gradesData", "isFirstSetting"]);
  const emits = defineEmits(["setGrade"]);

  // 描画調整
  const isShowingDetails = ref(props.isFirstSetting);
  const updateShowingStatus = function(){
    isShowingDetails.value = !isShowingDetails.value;
  }

  const setGrade = function(grade, num){
    emits("setGrade", grade, num);
  };
</script>