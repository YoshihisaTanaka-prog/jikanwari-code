<template>
  第{{ grade }}学年のクラス数:&nbsp;
  <input type="number" v-model="lengthModel" @change="setGrade" />
</template>

<style scoped>
  input {
    text-align: center;
  }
</style>

<script setup>
  import { defineEmits, defineProps, ref } from 'vue';

  const props = defineProps(["grade", "length"]);
  const emits = defineEmits(["setGrade"]);

  const lengthModel = ref(props.length);

  const setGrade = function(){
    emits("setGrade", props.grade, lengthModel.value);
  }
</script>