<template>
  <div>
    <h3 @click="updateShowingStatus">{{ isShowingDetails ? "▼" : "▶" }}&nbsp;特別教室など</h3>
    <div v-if="isShowingDetails">
      <p>
        ホームルーム以外の教室（体育館、音楽室、など）やグラウンドなどを設定します。<br />
        ダブルブッキングしていないか確認するために使います。<br />
        科目と関連付けることで、予測の精度が上がります。<br />
        名称変更および科目との関連付けはこのページでしか行えませんが、追加は他のページからもできます。
      </p>
      <div style="display: flex;">
        <div>
          <input type="text" v-model="newClassroomName" placeholder="名前を入力" />
        </div>
        <div style="margin-left: 1em;">
          <button @click="addSpecialClassroom">場所を追加</button>
        </div>
      </div>
      <ul>
        <li v-for="classroom in classrooms" :key="classroom.id">
          <input type="text" v-model="classroom.name" @change="()=>{updateSpecialClassroom(classroom.id)}" placeholder="名前を入力" />
          <ul v-if="connectingStatus[classroom.id]">
            <li v-for="subject in subjects" :key="classroom.id + '-' + subject.id + '-e'">
              <label>
                <input type="checkbox" @click="()=>{updateConnection(subject.id, classroom.id)}" :checked="subject.specialRooms.map(c =>c.id).includes(classroom.id)"/>
                {{ subject.name }}
              </label>
            </li>
            <li>
              <button @click="()=>{updateConnectingStatus(classroom.id)}">関連付け完了</button>
            </li>
          </ul>
          <div v-else>
            関連教科:&nbsp;
            <span v-for="subject in subjects.filter(subject => subject.specialRooms.map(c =>c.id).includes(classroom.id))" :key="classroom.id + '-' + subject.id + '-s'">
              ・{{ subject.name }}
            </span>
            <br />
            <button @click="()=>{updateConnectingStatus(classroom.id)}">
              {{ subjects.filter(subject => subject.specialRooms.map(c =>c.id).includes(classroom.id)) == 0 ? '教科を関連付ける': '関連付けを編集' }}
            </button>
          </div>
        </li>
      </ul>
      <HideButton @clicked-btn="updateShowingStatus()" />
    </div>
  </div>
</template>

<style scoped>
  h3 {
    width: fit-content;
  }
  h3:hover {
    background-color: #aaa;
  }
</style>

<script setup>
  import HideButton from '@/components/HideButton.vue';

  import { defineEmits, defineProps, ref } from 'vue';

  defineProps(["isElemental", "classrooms", "subjects"])

  const emits = defineEmits(["addSpecialClassroom", "updateSpecialClassroom", "updateConnection"]);
  const newClassroomName = ref("");

  const isShowingDetails = ref(false);

  const updateShowingStatus = function(){
    isShowingDetails.value = !isShowingDetails.value;
  }

  const connectingStatus = ref({});

  const addSpecialClassroom = function(){
    if (["", null, undefined].includes(newClassroomName.value)){
      alert("場所名を入力してください");
    } else {
      emits("addSpecialClassroom", newClassroomName.value);
      newClassroomName.value = '';
    }
  };

  const updateSpecialClassroom = function(id, name){
    emits("updateSpecialClassroom", id, name);
  }

  const updateConnection = function(subjectId, classroomId){
    emits("updateConnection", subjectId, classroomId);
  }

  const updateConnectingStatus = function(classroomId){
    if(connectingStatus.value[classroomId]){
      connectingStatus.value[classroomId] = false;
    } else {
      for(const key of Object.keys(connectingStatus.value)){
        connectingStatus.value[key] = false;
      }
      connectingStatus.value[classroomId] = true;
    }
  }
</script>