import { createApp } from 'vue';
import { createPinia } from 'pinia';
import TDesign from 'tdesign-vue-next';
import App from './App.vue';
import router from './router';
import 'tdesign-vue-next/es/style/index.css';
import './styles/global.css';

const app = createApp(App);

// 插件
app.use(createPinia());
app.use(router);
app.use(TDesign);

// 挂载
app.mount('#app');
