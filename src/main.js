import './assets/main.css';

import { createApp } from 'vue'
import packageJson   from '../package.json';
import App           from './App.vue'

// localStorage.setItem("config", "");

window.appData = {version : packageJson.version, name: packageJson.displayName, releasenotePage: packageJson.releasenotePage};

window.uid = {
  used: [],
  get: function(length=10){
    const getRandomInt = function(n) {
      return Math.floor(Math.random() * n);
    }
    const unit = function(){
      let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let retunUid = chars[getRandomInt(chars.length)];
      chars += "0123456789";
      for(let i=1; i<length; i++){
        retunUid += chars[getRandomInt(chars.length)];
      }
      return retunUid;
    }

    let retunUid = unit();
    while(window.uid.used.includes(retunUid)){
      retunUid = unit();
    }
    window.uid.used.push(retunUid);
    return retunUid;
  }
};

createApp(App).mount('#app');