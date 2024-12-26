<template>
  <div style="display: inline-block; vertical-align: top;">
    <span @click="updateShowingStatus">
      {{ isShowingDetails? '▼' : '▶' }}&nbsp;
    </span>
  </div>
  <div style="display: inline-block;">
    <SubjectUnit
      :name="mainSubject.name"
      :placeholder-text="'教科名を入力'"
      :btn-text="'編集'"
      :is-need-to-reset="false"
      @edited-subject="(name)=>{updateSubject(mainSubject.id, name)}"
    />
    <label v-for="genre in genres" :key="genre.id">
      <input type="radio" :value="genre.id" v-model="currentGenre" @change="()=>{updateSubject(mainSubject.id, mainSubject.name, genre.id)}" />
      {{ genre.name }}
    </label>
  </div>
  <template v-if="isShowingDetails">
    <p style="padding-left: 1em;"><b>科目一覧</b></p>
    <ul>
      <li style="padding-bottom: 0.5em;">
        <SubjectUnit
          :name="''"
          :placeholder-text="'教目名を入力'"
          :btn-text="'教科に科目を追加'"
          :is-need-to-reset="true"
          @edited-subject="(name)=>{add(name)}"
        />
      </li>
      <li v-for="subSubject in mainSubject.subSubjects" :key="subSubject.id">
        <SubjectUnit
          :name="subSubject.name"
          :placeholder-text="'教目名を入力'"
          :btn-text="'編集'"
          :is-need-to-reset="true"
          @edited-subject="(name)=>{update(subSubject.id, name)}"
        />
      </li>
    </ul>
    <HideButton @clicked-btn="updateShowingStatus" />
  </template>
</template>

<style scoped>
  b:hover {
    background-color: #aaa;
  }
</style>

<script setup>
  import { defineEmits, defineProps, ref } from 'vue';

  import HideButton from '@/components/HideButton.vue';
  import SubjectUnit from './SubjectUnit.vue';

  const props = defineProps(["mainSubject", "genres"]);
  const emit = defineEmits(["addSubSubject", "updateSubject"]);

  const isShowingDetails = ref(false);
  const updateShowingStatus = function(){
    isShowingDetails.value = !isShowingDetails.value;
  }

  const currentGenre = ref(props.mainSubject.genre);

  const add = function(name){
    emit("addSubSubject", name);
  }

  const update = function(id, name){
    emit("updateSubject", id, name);
  };
</script>