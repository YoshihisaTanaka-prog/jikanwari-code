<template>
  <div v-for="key in Object.keys(tabData)" :key="key" :class="currentTabId == key ? 'main-content' : 'unselected-content'">
    <component :is="tabData[key].cmp" :title="licenseTitle" :content="licenseContent" :remark1="remark1" :remark2="remark2" />
  </div>
</template>

<script setup>
  import { computed, defineEmits, defineProps, onMounted } from 'vue';

  import MyLicense from './my-license.vue';

  const props = defineProps(["props", "currentTabId"]);
  const emits = defineEmits(["onMountedMe"]);

  const tabData = {
    "en" : {
      text: "English ver",
      cmp: MyLicense
    },
    "ja" : {
      text: "日本語版",
      cmp: MyLicense
    }
  };

  onMounted(()=>{
    emits("onMountedMe", tabData, "en");
  });

  const licenseRemarkObj = {
    "1": {
      "en": "Note1: The Japanese translation is for reference only; the English version has legal effect.",
      "ja": "注釈1: 日本語訳は参考用であり、法的効力を持つのは英語版です。\n\n以下は、MITライセンスの日本語訳です。法的に有効なのはオリジナルの英語版です。"
    },
    "2": {
      "en": "Note2: This is a plain text version of the MIT License.",
      "ja": "注釈2: これはMITライセンスの日本語訳です。"
    }
  }

  const licenseTitleObj = {
    "en": "MIT License",
    "ja": "MITライセンス"
  }
  const licenseContentObj = {
    en: `Copyright (c) 2024 Yoshihisa Tanaka

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
   ja: `Copyright (c) 2024 田中 義久

本ソフトウェアおよび関連する文書のファイル（以下「ソフトウェア」）の複製を取得した全ての人物に対し、
以下の条件に従うことを前提に、ソフトウェアを無制限に扱うことを無償で許可します。

これには、ソフトウェアの複製を使用、複製、改変、結合、公開、頒布、再許諾、
および/または販売する権利、およびソフトウェアを提供する人物に同様の行為を許可する権利が含まれますが、
これらに限定されません。

上記の著作権表示および本許諾表示を、ソフトウェアの全ての複製または実質的な部分に記載するものとします。

ソフトウェアは「現状有姿」で提供され、商品性、特定目的への適合性、
および権利の非侵害性に関する保証を含むがこれらに限定されず、
明示的であるか黙示的であるかを問わず、いかなる種類の保証も行われません。

著作者または著作権者は、契約、不法行為、またはその他の行為であるかを問わず、
ソフトウェアまたはソフトウェアの使用もしくはその他に取り扱いに起因または関連して生じる
いかなる請求、損害賠償、その他の責任について、一切の責任を負いません。`
  };

  const licenseTitle = computed(() => licenseTitleObj[props.currentTabId]);
  const licenseContent = computed(() => licenseContentObj[props.currentTabId]);
  const remark1 = computed(() => licenseRemarkObj[1][props.currentTabId]);
  const remark2 = computed(() => licenseRemarkObj[2][props.currentTabId]);
</script>
