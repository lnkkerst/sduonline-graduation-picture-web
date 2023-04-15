import type { AxiosError } from 'axios';
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  VBtn,
  VCard,
  VCardText,
  VCardTitle,
  VForm,
  VTextField
} from 'vuetify/components';
import { axios } from '~/utils/axios';
import { Swal, Toast } from '~/utils/swal';

export default defineComponent({
  setup() {
    const router = useRouter();

    const form = reactive({
      username: '',
      password: ''
    });
    const formEl = ref<VForm | null>(null);
    const rules = {
      username: [
        (v: string) => !!v || '学号不可为空',
        (v: string) =>
          (v.length === 12 && parseInt(v).toString() === v) || '学号格式不对',
        (v: string) =>
          import.meta.env.DEV ||
          parseInt(v.slice(0, 4)) <= 2019 ||
          '本次活动仅限19级前的毕业生参加，如有特殊情况请联系主办方'
      ],
      password: [(v: string) => !!v || '密码不可为空']
    };
    const logining = ref(false);

    async function login() {
      logining.value = true;
      await (async () => {
        if (!formEl.value) {
          return;
        }
        if (!(await formEl.value.validate().then(res => res.valid))) {
          return;
        }

        await axios
          .post('/login', { sdu_id: form.username, password: form.password })
          .then(res => res.data)
          .then(res => {
            const token = res.access_token;
            localStorage.setItem('access_token', token);
            Toast.fire({ title: '登录成功', icon: 'success' });
            router.push('/');
          })
          .catch((err: AxiosError) => {
            if (err.response?.status === 401) {
              Swal.fire({ title: '学号或密码不正确', icon: 'error' });
            } else {
              Swal.fire({ title: '未知错误', icon: 'error' });
            }
          });
      })();
      logining.value = false;
    }

    return () => (
      <div h="full" grid place-items="center">
        <VCard w="8/10" max-w="sm" p="sm">
          <VCardTitle>登录</VCardTitle>
          <VCardText>
            <VForm ref={formEl} onSubmit={e => e.preventDefault()}>
              <VTextField
                label="学号"
                v-model={form.username}
                rules={rules.username}
              ></VTextField>
              <VTextField
                label="密码"
                type="password"
                v-model={form.password}
                rules={rules.password}
              ></VTextField>
              <VBtn
                type="submit"
                color="primary"
                block
                loading={logining.value}
                onClick={login}
              >
                登录
              </VBtn>
            </VForm>
          </VCardText>
        </VCard>
      </div>
    );
  }
});
