<template>
  <h3 @click="updateShowingStatus">
    {{ isShowingDetails ? "▼" : "▶" }}&nbsp;
    <span class="alert-span" v-if="showAlert">!&nbsp;</span>
    {{ title }}
  </h3>
  <template v-if="isShowingDetails">
    <ul>
      <li v-for="(subject, index) in subjects" :key="subject.id">
        <hr v-if="index == 0" />
        <template v-if="assignments.find(a => a.subject.id == subject.id)">
          <HighSchoolUnit
            :teachers="config.teacherUtil.getListBySubject(subject.id)"
            :assignment="assignments.find(a => a.subject.id == subject.id)"
            :config-wather="configWatcher"
            @edited-teacher="editTeacher"
            @assign-teacher="assignTeacher"
            @unassign-teacher="unassignTeacher"
            @remove-subject="removeSubject"
          />
        </template>
        <div v-else>
          <h3>{{ subject.name }}</h3>
          <button @click="()=>{addSubjectToHomeroom(subject.id)}">教科を追加</button>
        </div>
        <hr>
      </li>
    </ul>
    <HideButton @clicked-btn="updateShowingStatus" />
  </template>
  <template v-else>
    <span v-for="subject in subjects" :key="subject.id">
      ・{{ subject.name }}
    </span>
  </template>
  <hr>
</template>

<style scoped>
  .alert-span{
    color: #f00;
    font-weight: bolder;
  }
  h3 {
    width: fit-content;
    display: inline-block;
    margin-right: 1em;
    margin-block: 0;
  }
  h3:hover {
    background-color: #aaa;
  }
</style>

<script setup>
  import { defineEmits, defineOptions, defineProps, ref, watch } from 'vue';

  import HighSchoolUnit from '../Unit/HighSchool.vue';
  import HideButton from '@/components/HideButton.vue';
  import TimetableConfig from '@/models/TimetableConfig';

  defineOptions({name: "AssignmentSmallGroupH"})
  const props = defineProps({
    title: {type: String, required: true},
    config: {type: TimetableConfig, required: true},
    assignments: {type: Array, required: true},
    subjects: {type: Array, required: true},
    configWatcher: {type: Boolean, required: true}
  });
  const emits = defineEmits(["editedTeacher", "assignTeacher", "unassignTeacher", "addSubjectToHomeroom", "removeSubject"]);

  const isShowingDetails = ref(false);
  const updateShowingStatus = function(){
    isShowingDetails.value = !isShowingDetails.value;
    showAlert.value = (Math.min(...props.assignments.map(a => a.teachers.length)) == 0) && !isShowingDetails.value;
  }

  const showAlert = ref(false);
  showAlert.value = (Math.min(...props.assignments.map(a => a.teachers.length)) == 0) && !isShowingDetails.value;
  watch(()=>props.configWatcher, ()=>{
    showAlert.value = (Math.min(...props.assignments.map(a => a.teachers.length)) == 0) && !isShowingDetails.value;
  });

  const editTeacher = function(...args){
    emits("editedTeacher", ...args);
  }

  const assignTeacher = function(...args){
    emits("assignTeacher", ...args);
  }

  const unassignTeacher = function(...args){
    emits("unassignTeacher", ...args);
  }

  const addSubjectToHomeroom = function(subjectId){
    emits("addSubjectToHomeroom", subjectId);
  }

  const removeSubject = function(subjectId, subjectName){
    emits("removeSubject", subjectId, subjectName);
  }
</script>