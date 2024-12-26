<template>
  <div>
    <h3 @click="updateShowingStatus">{{ isShowingDetails ? "▼" : "▶" }}&nbsp;教科</h3>
    <div v-if="isShowingDetails">
      <ExplainComponent :text="explainText" />
      <div>
        <p><b>教科を追加</b></p>
        <SubjectUnit
          :name="newSubjectName"
          :subject-id="''"
          :placeholder-text="'教科名を入力'"
          :btn-text="null"
          :is-need-to-reset="false"
          @edited-subject="(name)=>{updateNewSubjectName(name)}"
        />
        ジャンル:&nbsp;
        <button v-for="genre in genres" :key="genre.id" style="margin-right: 1em;" @click="()=>{addSubject(genre.id)}">
          {{ genre.name }}
        </button>
      </div>
      <template v-if="![0, null, undefined].includes(subjects?.length)">
        <p><b>入力済み教科一覧</b></p>
        <ul>
          <li v-for="subject in subjects" :key="subject.id" style="vertical-align: top;">
            <SubjectGroup :main-subject="subject" :genres="genres" @add-sub-subject="(name)=>{addSubSubject(subject.id, name)}" @update-subject="updateSubject" />
          </li>
        </ul>
      </template>
      <HideButton @clicked-btn="updateShowingStatus()" />
    </div>
  </div>
</template>

<style scoped>
  h3 {
    display: inline-block;
  }
  h3:hover {
    background-color: #aaa;
  }
  label {
    margin-right: 1em;
  }
  button {
    border: none;
    border-radius: 0;
  }
  ul {
    padding-inline-start: 1em;
    list-style: none;
  }
</style>

<script setup>
  import HideButton from '@/components/HideButton.vue';
  import ExplainComponent from "@/components/ExplainComponent.vue";
  const explainText = `
各学年のクラス数を設定します。
編集はこのページでしか行えません。

教科のジャンル分けは
時間割を決める際の優先度の設定を行う目的と
教科の担当を振り分ける際の動作を変える目的で設定しました。

副教科は実施教室がホームルーム以外の可能性が高く、
実施教室のダブルブッキングが起きやすいため、
時間割を決める際に優先度を高められるようジャンル分けします。

その中でも特に、体育はホームルームを使わない可能性が高いので、
時間割を決める際の優先度を最優先にします。

また、「その他の科目」は、教科の担当教師を
各ホームルームの担任・副担任の教師に自動的に割り当てるために存在します。
  `;

  import { defineEmits, defineProps, ref } from 'vue';

  import SubjectGroup from './SubjectGroup.vue';
  import SubjectUnit from "./SubjectUnit.vue";

  import TimetableConfig from '@/models/TimetableConfig';

  defineProps(["subjects"]);
  const emits = defineEmits(["addSubject", "addSubSubject", "updateSubject"]);

  const isShowingDetails = ref(false);

  const updateShowingStatus = function(){
    isShowingDetails.value = !isShowingDetails.value;
  }

  const genres = TimetableConfig.genres;

  const newSubjectName = ref("");

  const updateNewSubjectName = function(name){
    newSubjectName.value = name;
  }

  const addSubject = function(genre){
    if(newSubjectName.value == ""){
      alert("教科名を入力してください。");
    } else{
      emits("addSubject", newSubjectName.value, genre);
      newSubjectName.value = "";
    }
  }

  const addSubSubject = function(mainId, newName){
    emits("addSubSubject", mainId, newName);
  }

  const updateSubject = function(id, name, genre){
    const args = [id, name];
    if(genre){
      args.push(genre);
    }
    emits("updateSubject", ...args);
  }

</script>