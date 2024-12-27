<template>
  <p>
    <button
      v-for="(_, grade) in gradesData"
      :key="grade"
      :class="grade == currentGrade ? 'selected-btn' : ''"
      @click="()=>{selectGrade(grade)}"
    >
      {{ grade }}年生
    </button>
  </p>
  <div
    v-for="(_, grade) in gradesData"
    :key="grade"
    :class="grade == currentGrade ? '' : 'hidden'"
  >
    <table>
      <tbody>
        <PostAndNameAndSubject
          :mode="'head'"
          :position="'学年主任'"
          :teacher="config.teacherUtil.getChargersOfHomeroom(grade, 0).head"
          :teachers="config.teacherUtil.getListByHomeroom({grade})"
          :subjects="subjects"
          :is-elemental="false"
          :btn-text="config.teacherUtil.getChargersOfHomeroom(grade, 0).head ? '変更' : '確定'"
          :config-watcher="configWatcher"
          @edited-teacher="editTeacher"
          @edited-subject="editSubject"
        />
      </tbody>
    </table>
    <template v-if="config.teacherUtil.getChargersOfHomeroom(grade, 0).head?.subjects.length || 0 != 0">
      <p>
        <button 
          v-for="classNumber in gradesData[grade]"
          :key="classNumber"
          :class="classNumber == currentClassNum ? 'selected-btn' : ''"
          @click="()=>{selectClassNum(classNumber)}"
        >
          {{ classNumber }}組
        </button>
      </p>
      <div v-for="classNumber in gradesData[grade]"
        :key="classNumber"
        :class="classNumber == currentClassNum ? '' : 'hidden'"
        @click="()=>{selectClassNum(classNumber)}"
      >
        <table>
          <tbody>
            <PostAndNameAndSubject
              :mode="'main'"
              :position="'担任'"
              :teacher="config.teacherUtil.getChargersOfHomeroom(grade, classNumber).main"
              :teachers="config.teacherUtil.getListByHomeroom({grade, classNumber})"
              :subjects="subjects"
              :is-elemental="false"
              :btn-text="config.teacherUtil.getChargersOfHomeroom(grade, classNumber).main ? '変更' : '確定'"
              :config-watcher="configWatcher"
              :is-need-under-line="true"
              @edited-teacher="editTeacher"
              @edited-subject="editSubject"
            />
            <PostAndNameAndSubject
              :mode="'assistant'"
              :position="'副担任'"
              :teacher="config.teacherUtil.getChargersOfHomeroom(grade, classNumber).assistant"
              :teachers="config.teacherUtil.getListByHomeroom({grade, classNumber})"
              :subjects="subjects"
              :is-elemental="false"
              :btn-text="config.teacherUtil.getChargersOfHomeroom(grade, classNumber).assistant ? '変更' : '確定'"
              :config-watcher="configWatcher"
              @edited-teacher="editTeacher"
              @edited-subject="editSubject"
            />
          </tbody>
        </table>
        <template v-if="
          (config.teacherUtil.getChargersOfHomeroom(grade, classNumber).main?.subjects.length || 0 != 0)
          &&
          (config.teacherUtil.getChargersOfHomeroom(grade, classNumber).assistant?.subjects.length || 0 != 0)
        ">
          <template v-for="(unit, index) in [{kw: ['main'], title: '主要教科'}, {kw: ['sub', 'pe'], title: '副教科'}, {kw: ['other'], title: 'その他'}]" :key="index">
            <JuniorHighSchoolAssignmetGroup
              :title="unit.title"
              :assignments="config.assignmentUtil.getListByHomeroom({grade, classNumber}).filter(a => unit.kw.includes(a.subject.genre))"
              :config="config"
              :config-watcher="configWatcher"
              :subjects="subjects.filter(s => unit.kw.includes(s.genre))"
              @edited-teacher="editTeacher"
              @assign-teacher="assignTeacher"
              @unassign-teacher="unassignTeacher"
              @add-subject-to-homeroom="addSubjectToHomeroom"
            />
          </template>
        </template>
      </div>
    </template>
  </div>
  <button v-if="isFirstSetting && didInputAll">入力完了</button>
</template>

<style scoped>
  button{
    color: #0f0;
    background-color: #333;
    width: 7.5rem;
    height: 100%;
    font-weight: bolder;
    border: 1px solid #000;
    border-radius: 0;
  }
  button:hover{
    background-color: #555;
  }
  .selected-btn{
    background-color: #555;
  }
  .selected-btn:hover{
    background-color: #777;
  }
  h3 {
    display: inline-block;
    padding-right: 1em;
  }
  .hidden {
    display: none;
  }
</style>

<script setup>
  import { defineEmits, defineOptions, defineProps, ref, watch } from 'vue';

  import TimetableConfig from '@/models/TimeTableConfig/config.js';
  import PostAndNameAndSubject from './teacher/PostAndNameAndSubject.vue';
  import JuniorHighSchoolAssignmetGroup from './UnitGroup/JuniorHighSchool.vue';

  defineOptions({name: "AssignmentJH"});
  const props = defineProps({
    config: {type: TimetableConfig, required: true},
    configWatcher: {type: Boolean, required: true},
    isFirstSetting: {type: Boolean, required: true}
  });
  const emit = defineEmits(["onInputedAll", "updateConfig"]);

  const gradesData = ref(props.config.gradesUtil.getData());
  const subjects = ref(props.config.subjectUtil.getList());
  
  watch(()=>props.configWatcher, ()=>{
    gradesData.value = props.config.gradesUtil.getData();
    subjects.value = props.config.subjectUtil.getList();
  });

  const currentGrade = ref(null);
  const currentClassNum = ref(null);
  
  // 中学のみ必要
  const setAssignments = function(config){
    const chargers = Object.values(config.teacherUtil.getChargersOfHomeroom(currentGrade.value, currentClassNum.value));
    const ignoreConditions = [
      [null, undefined].includes(currentClassNum.value),
      config.assignmentUtil.getListByHomeroom({grade: currentGrade.value, classNumber: currentClassNum.value}).lenght > 0,
      chargers.map(c => c?.subjects.length || 0).includes(0)
    ];
    if(ignoreConditions.every(bool => bool === false)){
      config.homeroomUtil.setByNumber(currentGrade.value, currentClassNum.value).addSubjects(subjects.value.map(s => s.id), chargers.map(c => c.id));
    }
  }

  const editTeacher = function(mode, teacherId, teacherName){
    const config = props.config;
    if(teacherId == ""){
      const newTeacherId = config.teacherUtil.add(teacherName).id;
      if(mode == "head"){
        config.teacherUtil.setId(newTeacherId).setHead(currentGrade.value);
      }
      if(currentClassNum.value && ["head", "main", "assistant"].includes(mode)){
        if(mode == "main"){
          config.teacherUtil.setId(newTeacherId).setToClassroomAsMain(currentGrade.value, currentClassNum.value);
        } else if(mode == "assistant"){
          config.teacherUtil.setId(newTeacherId).setToClassroomAsAssistant(currentGrade.value, currentClassNum.value);
        }
        setAssignments(config);
      }
    } else {
      config.teacherUtil.setId(teacherId).update(teacherName);
    }
    emit("updateConfig", config.toObject());
  };

  const editSubject = function(teacherId, oldSubjectId, newSubjectId){
    const config = props.config;
    config.teacherUtil.setId(teacherId).removeFromSubject(oldSubjectId).addToSubject(newSubjectId);
    setAssignments(config);
    emit("updateConfig", config.toObject());
  }

  const assignTeacher = function(assignmentId, teacherId, teacherName){
    if(["", null, undefined].includes(teacherId)){
      emit("updateConfig", props.config.teacherUtil.add(teacherName).assignTo(assignmentId).toObject());
    } else {
      emit("updateConfig", props.config.assignmentUtil.setId(assignmentId).addTeacher(teacherId).toObject());
    }
  }

  const unassignTeacher = function(assignmentId, teacherId){
    emit("updateConfig", props.config.assignmentUtil.setId(assignmentId).removeTeacher(teacherId).toObject());
  }

  const selectGrade = function(newGrade){
    currentGrade.value = `${newGrade}`;
    currentClassNum.value = null;
  }
  const selectClassNum = function(newClassNum){
    if(currentGrade.value){
      currentClassNum.value = `${newClassNum}`;
    } else {
      currentClassNum.value = null;
    }
  }

  const addSubjectToHomeroom = function(subjectId){
    if(currentClassNum.value){
      emit(
        "updateConfig",
        props
          .config
          .homeroomUtil
          .setByNumber(currentGrade.value, currentClassNum.value)
          .addSubject(
            subjectId,
            Object.values(
              props.config.teacherUtil.getChargersOfHomeroom(currentGrade.value, currentClassNum.value)
            ).filter(t => t!= null).map(t => t.id)
          ).toObject()
      );
    }
  }
</script>