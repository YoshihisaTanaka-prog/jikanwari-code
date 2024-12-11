import './assets/main.css';

import $             from "jquery";
import { createApp } from 'vue'
import packageJson   from '../package.json';
import App           from './App.vue'

window.appData = {version : packageJson.version, name: packageJson.displayName, githubUrl: packageJson.repository.github};

const setMainContentHeight = function(){
  window.tabHeight = $("#tab").outerHeight() + $("#tab-border").outerHeight();
  window.screenHeight = $("#back-layer").outerHeight();
  $("main").outerHeight(window.screenHeight - window.tabHeight);
  $(".window").outerHeight(window.screenHeight - window.tabHeight);
  $(".content").outerHeight(window.screenHeight - window.tabHeight * 2);
  $(".tab-btn").outerHeight($("#tab").outerHeight());
};

window.addEventListener("load", ()=>{
  setTimeout(() => {
    setMainContentHeight();
  }, 50);
});

window.addEventListener("resize", setMainContentHeight);

createApp(App).mount('#app');