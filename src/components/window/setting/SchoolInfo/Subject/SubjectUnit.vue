<template>
  <div>
    <input
      type="text"
      v-model="subjectName"
      autocomplete="off"
      :placeholder="placeholderText"
      @focusout="edited"
      @input="inputed"
    />
    <button v-if="!['', null, undefined].includes(btnText)" :disabled="!didEdit">{{ btnText }}</button>
  </div>
</template>

<style scoped>
  button {
    margin-left: 1em;
  }
  button[disabled]{
    background-color: #afa;
    border: none;
  }
  button[disabled]:hover {
    background-color: #afa;
  }
</style>

<script setup>
  import { defineEmits, defineProps, ref, watch } from 'vue';

  const props = defineProps(["name", "placeholderText", "btnText", "isNeedToReset"]);
  const emits = defineEmits(["editedSubject"]);

  const subjectName = ref(props.name);

  const didEdit = ref(false);
  watch(()=>props.name, () => {
    subjectName.value = props.name;
    didEdit.value = false
  });

  watch(()=>subjectName.value, () => {
    if(["", null, undefined, props.name].includes(subjectName.value)){
      setTimeout(() => {
        didEdit.value = false;
      }, 50);
    } else {
      didEdit.value = true;
    }
  })

  const inputed = function(){
    didEdit.value = true;
  }

  const edited = ()=>{
    if(!["", null, undefined, props.name].includes(subjectName.value)){
      emits("editedSubject", subjectName.value);
      didEdit.value = false;
      if(props.isNeedToReset){
        subjectName.value = "";
      }
    }
  }
</script>
