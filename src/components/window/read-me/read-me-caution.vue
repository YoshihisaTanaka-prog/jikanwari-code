<template>
  <ul>
    <li v-for="(contentInfo, i) in contentInfoArray" :key="i">
      <h3>{{ contentInfo.title }}</h3>
      <p>{{ contentInfo.plain1 }}</p>
      <button v-if="!contentInfo.fixToShow" v-on:click="()=>{onclickDetail(i)}">詳細{{ showingStatusArray[i] ? "非" : "" }}表示</button>
      <ul v-if="showingStatusArray[i]">
        <li v-for="(unit, j) in contentInfo.array" :key="j">
          <span v-if="typeof unit == 'string'">{{ unit }}</span>
        </li>
      </ul>
      <p>{{ contentInfo.plain2 }}</p>
    </li>
  </ul>
</template>

<style scoped>
  p {
    white-space: pre-wrap;
  }
</style>

<script setup>
  import { ref } from "vue";
  const contentInfoArray = [
    {
      title: "本サービスは現時点でデモ版となっております。",
      plain1: "ブラウザ上のJavaScript「のみ」で動作しているため\n・サーバーに保存する仕組みがありません。・PC内のデータへの自動アクセスができません。\n\nしたがって、以下の機能が制限されています。",
      array: ["端末への自動データ保存機能", "端末に保存したデータの自動読み込み機能"],
      plain2: "データ保存は毎回ファイルをダウンロードしてください。\n保存したデータを再度編集したい場合は保存したファイルをアップロードしてください。\n（編集後は新しいファイルが保存されます。）",
      fixToShow: true
    },
    {
      title: "テスト",
      plain : "テスト",
      array: ["テスト1", "テスト2", "テスト3"],
      plain2: ""
    }
  ];

  for(let i=0; i<contentInfoArray.length; i++) {
    if(contentInfoArray[i].title == null) {
      contentInfoArray[i].title = "";
    }
    if(contentInfoArray[i].plain1 == null) {
      contentInfoArray[i].plain1 = "";
    }
    if(contentInfoArray[i].array == null) {
      contentInfoArray[i].array = [];
    }
    if(contentInfoArray[i].plain2 == null) {
      contentInfoArray[i].plain2 = "";
    }
    if(contentInfoArray[i].fixToShow == null){
      contentInfoArray[i].fixToShow = false;
    }
  }

  const showingStatusArray = ref(contentInfoArray.map(x => x.fixToShow));

  const onclickDetail = function(index) {
    showingStatusArray.value[index] =!showingStatusArray.value[index];
  }
</script>