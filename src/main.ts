import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App';
import routes from '~pages';

import '@unocss/reset/tailwind.css';
import 'vuetify/styles';
import 'virtual:uno.css';

const app = createApp(App);
app.use(
  createRouter({
    history: createWebHashHistory(),
    routes
  })
);
app.use(createVuetify());

app.mount('#app');
