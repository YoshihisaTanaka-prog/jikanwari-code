<template>
  <hr>
  <h3 @click="updateShowingStatus">
    {{ isShowingDetails ? "▼" : "▶" }}&nbsp;
    <span v-if="showAlert">!&nbsp;</span>
    {{ title }}
  </h3>
  <template v-if="isShowingDetails">
    <ul>
      <li v-for="subject in subjects" :key="subject.id">
        <hr>
        <template v-if="assignments.find(a => a.subject.id == subject.id)">
          <JuniorHighSchoolUnit
            :teachers="config.teacherUtil.getListBySubject(subject.id)"
            :assignment="assignments.find(a => a.subject.id == subject.id)"
            :config-wather="configWatcher"
            @edited-teacher="editTeacher"
            @assign-teacher="assignTeacher"
            @unassign-teacher="unassignTeacher"
          />
        </template>
        <div v-else>
          <h3>{{ subject.name }}</h3>
          <button @click="()=>{addSubjectToHomeroom(subject.id)}">教科を追加</button>
        </div>
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

  import JuniorHighSchoolUnit from '../Unit/JuniorHighSchool.vue';
  import HideButton from '@/components/HideButton.vue';
  import TimetableConfig from '@/models/TimetableConfig';

  defineOptions({name: "AssignmentGroupJH"})
  const props = defineProps({
    title: {type: String, required: true},
    config: {type: TimetableConfig, required: true},
    assignments: {type: Array, required: true},
    subjects: {type: Array, required: true},
    configWatcher: {type: Boolean, required: true}
  });
  const emits = defineEmits(["editedTeacher", "assignTeacher", "unassignTeacher", "addSubjectToHomeroom"]);

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
</script>