import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App';
import { Toast } from './utils/swal';
import routes from '~pages';

import '@unocss/reset/tailwind.css';
import 'vuetify/styles';
import 'virtual:uno.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import '~/style.scss';

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
router.beforeEach((to, _from) => {
  if (to.path === '/login') {
    return true;
  }

  const token = localStorage.getItem('access_token');
  if (!token) {
    Toast.fire({ title: '请先登录', icon: 'warning' });
    return '/login';
  }
  return true;
});

const app = createApp(App);
app.use(router);
app.use(
  createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
    },
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#9c0c13'
          }
        }
      }
    }
  })
);

app.mount('#app');
