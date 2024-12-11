<template>
  <div>
    <h1>リリースノート {{ appData.name }} ver.{{ appData.version }}</h1>
    <div id="release-note-output"></div>
  </div>
</template>

<script setup>
  import $ from "jquery";

  const appData = window.appData;

  $.get(window.appData.releasenotePage + window.appData.version.replaceAll(".", "-") + ".html", (code)=>{
    const bodyCode = $(code).find("body").html();
    $("#release-note-output").html(bodyCode);
  });
</script>