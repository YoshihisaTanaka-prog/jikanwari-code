<template>
  <hr>
  <h3 @click="updateShowingStatus">
    {{ isShowingDetails ? "▼" : "▶" }}&nbsp;
    <span v-if="showAlert">!&nbsp;</span>
    {{ title }}
  </h3>
  <template v-if="isShowingDetails">
    <ul>
      <li v-for="(subject, index) in subjects" :key="subject.id">
        <hr v-if="index == 0" />
        <HighSchoolSmall
          :title="subject.name"
          :assignments="assignments.filter(a => subject.subSubjects.map(s => s.id).includes(a.subject.id))"
          :config="config"
          :config-watcher="configWatcher"
          :subjects="subject.subSubjects"
          @edited-teacher="editTeacher"
          @assign-teacher="assignTeacher"
          @unassign-teacher="unassignTeacher"
          @add-subject-to-homeroom="addSubjectToHomeroom"
          @remove-subject="removeSubject"
        />
      </li>
    </ul>
    <HideButton @clicked-btn="updateShowingStatus" />
  </template>
</template>

<style scoped>
  span{
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

  import HighSchoolSmall from './HighSchoolSmall.vue';
  import HideButton from '@/components/HideButton.vue';
  import TimetableConfig from '@/models/TimeTableConfig/config.js';

  defineOptions({name: "AssignmentLargeGroupH"})
  const props = defineProps({
    title: {type: String, required: true},
    config: {type: TimetableConfig, required: true},
    assignments: {type: Array, required: true},
    subjects: {type: Array, required: true},
    configWatcher: {type: Boolean, required: true}
  });
  const emits = defineEmits(["editedTeacher", "assignTeacher", "unassignTeacher", "addSubjectToHomeroom", "removeSubjectFromHomeroom"]);

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
    emits("removeSubjectFromHomeroom", subjectId, subjectName);
  }
</script>