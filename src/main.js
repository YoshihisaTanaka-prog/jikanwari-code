import './assets/main.css';

import { createApp } from 'vue'
import packageJson   from '../package.json';
import App           from './App.vue'

window.appData = {version : packageJson.version, name: packageJson.displayName, releasenotePage: packageJson.releasenotePage};

createApp(App).mount('#app');