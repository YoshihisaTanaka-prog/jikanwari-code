<template>
  <div>
    <input
      type="text"
      v-model="teacherName"
      :list="['', null, undefined].includes(teacherName) ? 'teacher-list-' + uid : ''"
      autocomplete="off"
      placeholder="教師名（フルネーム)"
      @focusout="edited"
      @input="inputed"
    />
    <datalist :id="'teacher-list-' + uid">
      <template v-for="(teacherArray, index) in predictedTeachers" :key="`teacher-list-${uid}-${index}`">
        <option v-for="teacher in teacherArray" :key="`teacher-list-${uid}-${teacher.id}`" :value="teacher.name">{{ accuracyArray[Math.min(index, 2)] }}</option>
      </template>
    </datalist>
    &nbsp;&nbsp;
    <button :disabled="!didEdit">{{ btnText }}</button>
  </div>
</template>

<style scoped>
  div {
    display: inline-block;
  }
  option {
    font-size: 0.7em;
  }
</style>

<script setup>
  import { defineEmits, defineProps, ref, watch } from 'vue';
  
  const props = defineProps(["name", "teachers", "teacherId", "btnText", "watcher", "isNeedToReset"]);
  const emits = defineEmits(["editedTeacher"]);

  const teacherName = ref(props.name);
  const predictedTeachers = ref(props.teachers);

  const didEdit = ref(false);
  watch(()=>props.watcher, () => {
    teacherName.value = props.name;
    predictedTeachers.value = props.teachers
    didEdit.value = false
  });

  watch(()=>[props.watcher, teacherName.value], ([newWatcher], [oldWatcher]) => {
    if(oldWatcher == newWatcher){
      if(["", null, undefined, props.name].includes(teacherName.value)){
        setTimeout(() => {
          didEdit.value = false;
        }, 50);
      } else {
        didEdit.value = true;
      }
    }
  })

  const inputed = function(){
    didEdit.value = true;
  }

  const accuracyArray = ["確度：高", "確度：中", "確度：低"];

  const uid = window.uid.get();

  const edited = ()=>{
    if(!["", null, undefined, props.name].includes(teacherName.value)){
      emits("editedTeacher", props.teacherId || "", teacherName.value);
      didEdit.value = false;
      if(props.isNeedToReset){
        teacherName.value = "";
      }
    }
  }

</script>