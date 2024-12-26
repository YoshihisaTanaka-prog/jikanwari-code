<template>
  <tr>
    <td>{{ position }}:</td>
    <td>&nbsp;</td>
    <td>
      <TeacherName
        :name="teacher?.name || ''"
        :teachers="convertedTeachers"
        :teacher-id="teacher?.id || ''"
        :is-need-to-reset="false"
        :watcher="watcher"
        :btn-text="btnText"
        @edited-teacher="editedTeacher"
      />
    </td>
    <template v-if="isElemental == false && !['', null, undefined].includes(teacher?.id)">
      <template v-if="numOfChangedSubjects == 0">
        <td style="padding-left: 1em;" colspan="2">
          教科:&nbsp;
          <select v-model="newSubjectId" @change="addSubject">
            <option v-for="subject in chargeableSubjects" :key="'m-' + subject.id" :value="subject.id">{{ subject.name }}</option>
          </select>
        </td>
      </template>
      <template v-else-if="numOfChangedSubjects == 1">
        <td style="padding-left: 1em;" colspan="2">
          教科{{ didTapPlus ? 1 : '' }}:&nbsp;
          <select v-model="currentSubjectIds[0]" @change="()=>{editedSubject(0)}">
            <option v-for="subject in chargeableSubjects" :key="'m-' + subject.id" :value="subject.id">{{ subject.name }}</option>
          </select>
        </td>
      </template>
      <template v-else>
        <td style="padding-left: 1em;">
          教科1:&nbsp;
          <select v-model="currentSubjectIds[0]" @change="()=>{editedSubject(0)}">
            <option v-for="subject in chargeableSubjects" :key="'m-' + subject.id" :value="subject.id">{{ subject.name }}</option>
          </select>
        </td>
        <td style="padding-left: 0.5em;">
          <button @click="()=>{removeSubject(currentSubjectIds[0])}">ー</button>
        </td>
      </template>
    </template>
  </tr>
  <template v-if="isElemental == false && !['', null, undefined].includes(teacher?.id) && numOfChangedSubjects > 0">
    <tr v-for="index in numOfChangedSubjects - 1" :key="index">
      <td colspan="3"></td>
      <td style="padding-left: 1em;">
        教科{{ index + 1 }}:&nbsp;
        <select v-model="currentSubjectIds[index]" @change="()=>{editedSubject(index)}">
          <option v-for="subject in chargeableSubjects" :key="'m-' + subject.id" :value="subject.id">{{ subject.name }}</option>
        </select>
      </td>
      <td style="padding-left: 0.5em; text-align: center;">
        <button @click="()=>{removeSubject(currentSubjectIds[index])}">ー</button>
      </td>
    </tr>
    <tr>
      <td colspan="3"></td>
      <template v-if="didTapPlus">
        <td style="padding-left: 1em;">
          教科{{ numOfChangedSubjects + 1 }}:&nbsp;
          <select v-model="newSubjectId" @change="addSubject">
            <option v-for="subject in chargeableSubjects" :key="'m-' + subject.id" :value="subject.id">{{ subject.name }}</option>
          </select>
        </td>
        <td style="padding-left: 0.5em;">
          <button @click="tappedAddCancel">×</button>
        </td>
      </template>
      <td v-else colspan="2" align="center">
        <button @click="tappedAdd">＋</button>
      </td>
    </tr>
  </template>
  <tr v-if="isNeedUnderLine">
    <td :colspan="isElemental ? 3 : 5">
      <hr>
    </td>
  </tr>
</template>

<style scoped>
  button {
    font-size: 0.5rem;
  }
</style>

<script setup>
  import { defineEmits, defineProps, ref, watch } from 'vue';

  import TeacherName from './TeacherName.vue';

  const props = defineProps(["mode", "configWatcher", "position", "teachers", "teacher", "subjects", "isElemental", "btnText", "isNeedUnderLine"]);
  const emits = defineEmits(["editedTeacher", "editedSubject"]);

  let watcher = true;

  let chargeableSubjects = props.subjects.filter(s => s.genre != "other");

  let convertedTeachers = [
    props.teachers?.charger || [],
    [...(props.teachers?.unset || []), ...(props.teachers?.head || [])],
    props.teachers?.sameGrade || [],
    props.teachers?.other || []
  ];

  const numOfChangedSubjects = ref(props.teacher?.subjects.length || 0);
  const currentSubjectIds = ref(props.teacher?.subjects.map(s => s.id));
  let keptSubjectIds = currentSubjectIds.value;

  watch(()=>props.configWatcher, () => {
    watcher = !watcher;
    chargeableSubjects = props.subjects.filter(s => s.genre != "other");
    convertedTeachers = [
      props.teachers?.charger || [],
      props.teachers?.unset || [],
      props.teachers?.head || [],
      props.teachers?.sameGrade || [],
      props.teachers?.other || []
    ];
    numOfChangedSubjects.value = props.teacher?.subjects.length || 0;
    currentSubjectIds.value = props.teacher?.subjects.map(s => s.id);
    keptSubjectIds = currentSubjectIds.value;
  });

  const editedTeacher = function(...args){
    emits("editedTeacher", props.mode, ...args);
  };
  const editedSubject = function(index){
    emits("editedSubject", props.teacher?.id || "", keptSubjectIds[index], currentSubjectIds.value[index]);
    keptSubjectIds[index] = currentSubjectIds.value[index];
  };

  const removeSubject = function(subjectId){
    emits("editedSubject", props.teacher?.id || "", subjectId, "");
  };

  const didTapPlus = ref(false);
  const tappedAdd = function(){
    didTapPlus.value = true;
  }
  const tappedAddCancel = function(){
    didTapPlus.value = false;
  }
  const newSubjectId = ref("");
  const addSubject = function(){
    emits("editedSubject", props.teacher?.id || "", "", newSubjectId.value);
    newSubjectId.value = "";
    didTapPlus.value = false;
  };

</script>