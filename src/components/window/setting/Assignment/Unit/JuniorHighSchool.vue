<template>
  <h3 @click="updateShowingStatus">
    {{ isShowingDetails ? "▼" : "▶" }}&nbsp;
    <span v-if="showAlert">!&nbsp;</span>
    {{ assignment.subject.name }}
  </h3>
  <div v-if="isShowingDetails">
    担当教師を追加
    <TeacherName :name="''" :teachers="convertesTeachers" :is-need-to-reset="true" btn-text="追加" @edited-teacher="assignTeacher" />
    <p>担当教師一覧</p>
    <ul>
      <li v-for="teacher in assignment.teachers || []" :key="teacher.id">
        <TeacherName :name="teacher.name" :teachers="convertesTeachers" :teacher-id="teacher.id" :is-need-to-reset="false" btn-text="変更"  @edited-teacher="editTeacher" />
        <div style="padding-left: 1em;">
          <button @click="()=>{unassignTeacher(assignment.id, teacher.id)}">削除</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  span{
    color: #f00;
    font-weight: bolder;
  }
  h3 {
    width: fit-content;
    margin-block: 0;
  }
  h3:hover {
    background-color: #aaa;
  }
  li {
    display: flex;
  }
</style>

<script setup>
  import { defineEmits, defineOptions, defineProps, ref, watch } from 'vue';

  import TeacherName from '../teacher/TeacherName.vue';

  defineOptions({name: "AssignmetUnitJH"});
  const props = defineProps(["teachers", "assignment", "configWather"]);
  const emits = defineEmits(["editedTeacher", "assignTeacher", "unassignTeacher"]);

  const isShowingDetails = ref(false);
  const updateShowingStatus = function(){
    isShowingDetails.value = !isShowingDetails.value;
  }

  let convertesTeachers = [
    props.teachers?.charger?.filter(t => props.assignment.teachers?.map(t => t.id).includes(t.id) == false) || [],
    props.teachers?.unset || []
  ];
  const showAlert = ref(false);
  showAlert.value = props.assignment.teachers.length == 0;

  watch(()=>props.configWather, ()=>{
    showAlert.value = props.assignment.teachers.length == 0;
    convertesTeachers = [
      props.teachers?.charger?.filter(t => props.assignment.teachers?.map(t => t.id).includes(t.id) == false) || [],
      props.teachers?.unset || [],
      props.teachers?.other || []
    ];
  });

  const editTeacher = function(...args){
    emits("editedTeacher", null, ...args);
  }

  const assignTeacher = function(...args){
    emits("assignTeacher", props.assignment.id, ...args);
  }

  const unassignTeacher = function(assignmentId, teacherId){
    emits("unassignTeacher", assignmentId, teacherId);
  }

</script>