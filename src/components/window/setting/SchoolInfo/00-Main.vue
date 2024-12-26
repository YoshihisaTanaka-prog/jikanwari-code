<template>
  <div style="width: 60vw;">
    <h2>{{ {elemental: '小学校', juniorHigh: '中学校', high: '高校'}[config.mode] }}の基本情報の設定</h2>
    <HomeRoom :grades-data="config.gradesUtil.getData()" :is-first-setting="step == 0" @set-grade="setGrade" />
    <div v-if="step == 0">
      <button @click="()=>{updateStep(1);}">
        次へ
      </button>
    </div>

    <!-- 教科の設定 -->
    <template v-if="step > 0">
      <template v-if="config.mode == 'elemental'">
        <SubjectE_JH
          :subjects="config.subjectUtil.getList()"
          :is-elemental="true"
          :is-first-setting="step == 1"
          @add-subject="addSubject"
          @update-subject="updateSubject"
         />
      </template>
      <template v-if="config.mode == 'juniorHigh'">
        <SubjectE_JH
          :subjects="config.subjectUtil.getList()"
          :is-elemental="false"
          :is-first-setting="step == 1"
          @add-subject="addSubject"
          @update-subject="updateSubject"
        />
      </template>
      <template v-if="config.mode == 'high'">
        <SubjectH
          :subjects="config.subjectUtil.getList()"
          @add-subject="addSubject"
          :is-first-setting="step == 1"
          @update-subject="updateSubject"
          @add-sub-subject="addSubSubject"
        />
      </template>
      
    </template>
    <div v-if="step == 1">
      <button @click="()=>{updateStep(2);}">
        次へ
      </button>
    </div>

    <!-- 特別教室の設定 -->
    <template v-if="step > 1">
      <template v-if="config.mode == 'elemental'">
        <SpecialRoomE_JH
          :classrooms="props.config.specicalRoomUtil.getList()"
          :subjects="config.subjectUtil.getList().filter(s => s.genre != 'other')"
          :is-elemental="true"
          @add-special-classroom="addSpecialClassroom"
          @update-special-classroom="updateSpecialClassroom"
          @update-connection="updateConnection"
        />
      </template>
      <template v-if="config.mode == 'juniorHigh'">
        <SpecialRoomE_JH
          :classrooms="props.config.specicalRoomUtil.getList()"
          :subjects="config.subjectUtil.getList().filter(s => s.genre != 'other')"
          :is-elemental="false"
          @add-special-classroom="addSpecialClassroom"
          @update-special-classroom="updateSpecialClassroom"
          @update-connection="updateConnection"
        />
      </template>
      <template v-if="config.mode == 'high'">
        <SpecialRoomH
          :classrooms="props.config.specicalRoomUtil.getList()"
          :subjects="config.subjectUtil.getList().filter(s => s.genre != 'other')"
          @add-special-classroom="addSpecialClassroom"
          @update-special-classroom="updateSpecialClassroom"
          @update-connection="updateConnection"
        />
      </template>
    </template>

    <div>
      <button v-if="step == 2" @click="()=>{updateStep(3);onInputAll();}">
        入力完了
      </button>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, defineOptions, defineProps, ref, watch } from 'vue';

  import HomeRoom from './Homeroom/HomeRoom.vue';
  import SubjectE_JH from './Subject/ElementalAndJuniorHighSchool.vue';
  import SubjectH from './Subject/HighSchool.vue';
  import SpecialRoomE_JH from './SpecialRoom/ElementalAndJuniorHighSchool.vue';
  import SpecialRoomH from './SpecialRoom/HighSchool.vue';

  import TimetableConfig from '@/models/TimetableConfig';

  defineOptions({name: "SchoolInfoSetting"});
  const props = defineProps({
    config: {type: TimetableConfig, required: true},
    configWatcher: {type: Boolean, required: true},
    isFirstSetting: {type: Boolean, required: true}
  });

  const emit = defineEmits(["onInputedAll", "updateConfig"]);

  // 描画調整
  const step = ref(props.isFirstSetting ? 0 : 3);
  const updateStep = function(newStep){
    step.value = newStep;
  }

  watch(()=>props.configWatcher, ()=>{
    step.value = props.isFirstSetting ? (step.value == 3 ? 0 : step.value) : 3;
  });

  const onInputAll = function(){
    emit("onInputedAll");
  };

  const setGrade = function(grade, numOfClass){
    emit("updateConfig", props.config.gradesUtil.update(grade, numOfClass).toObject());
  };

  const addSubject = function(name, genre){
    if(props.config.mode == "high" && genre != "main"){
      emit("updateConfig", props.config.subjectUtil.add(name, genre).addSub(name).toObject());
    } else {
      emit("updateConfig", props.config.subjectUtil.add(name, genre).toObject());
    }
  }

  const addSubSubject = function(mainId, subName){
    emit("updateConfig", props.config.subjectUtil.setId(mainId).addSub(subName).toObject());
  }

  const updateSubject = function(id, name, genre){
    emit("updateConfig", props.config.subjectUtil.setId(id).update(name, genre).toObject());
  }

  const addSpecialClassroom = function(newName){
    emit("updateConfig", props.config.specicalRoomUtil.add(newName).toObject());
  };

  const updateSpecialClassroom = function(id, name){
    emit("updateConfig", props.config.specicalRoomUtil.setId(id).update(name).toObject());
  }

  const updateConnection = function(subjectId, classroomId){
    const newConfig = props.config;
    if(newConfig.subjectUtil.setId(subjectId).isIncludesSpecialClassroom(classroomId)){
      newConfig.subjectUtil.setId(subjectId).removeSpecialClassroom(classroomId);
    } else {
      newConfig.subjectUtil.setId(subjectId).addSpecialClassroom(classroomId);
    }
    emit("updateConfig", newConfig.toObject());
  }
</script>
