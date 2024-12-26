<template>
  <ul>
    <li v-for="(contentInfo, i) in contentInfoArray" :key="i">
      <h3>{{ contentInfo.title }}</h3>
      <button v-if="!contentInfo.fixToShow" v-on:click="()=>{onclickDetail(i)}">詳細{{ showingStatusArray[i] ? "非" : "" }}表示</button>
      <div v-if="showingStatusArray[i]">
        <p>{{ contentInfo.initialPlain }}</p>
        <div v-for="(loopUnit, j) in contentInfo.loopArray" :key="j">
          <ul>
            <li v-for="(unit, k) in loopUnit.array" :key="k">
              <span v-if="typeof unit == 'string'">{{ unit }}</span>
            </li>
          </ul>
          <p v-if="loopUnit.plain">{{ loopUnit.plain }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
  p {
    white-space: pre-wrap;
    padding: 0;
  }
  ul {
    margin: 0;
    padding-inline: 2em;
  }
</style>

<script setup>
  import { ref } from "vue";
  const contentInfoArray = [
    {
      title: "本サービスは現時点でデモ版となっております。",
      initialPlain: "ブラウザ上のJavaScript「のみ」で動作しており、\nデータ損失のリスクの観点から、ブラウザソフトへの重要データの保存は不採用としているため、",
      loopArray: [
        {
          array: [
            "クラウド上に入力データを保存したり、クラウドから入力データを取得したりする仕組みがありません。",
            "PC内のデータへの自動アクセスができません。"
          ],
          plain: "\nしたがって、以下の機能が制限されています。"
        },
        {
          array: ["自動データ保存機能", "保存したデータの自動読み込み機能"],
          plain: "データの保存は画面右上「Download」ボタンをクリックして毎回ファイルをダウンロードしてください。\n保存したデータを再度編集したい場合は保存したファイルをアップロードしてください。\n（編集後はアップロードしたファイルとは別の新しいファイルが保存されます。）"
        }
      ],
      fixToShow: true
    },
    {
      title: "業務利用について。",
      initialPlain : "本サービスはMITライセンスの下で公開されております。\n無料で業務利用可となっておりますが、損害が発生ても責任は負いません。\n詳細は画面上部「ライセンス」ボタンを押すことで読むことができます。",
      loopArray: []
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