import { defineComponent } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import {
  VApp,
  VAppBar,
  VAppBarTitle,
  VBtn,
  VList,
  VListItem,
  VListItemTitle,
  VMain,
  VMenu
} from 'vuetify/components';
import { mdiDotsVertical } from '@mdi/js';
import { Toast } from './utils/swal';

export default defineComponent({
  setup() {
    const router = useRouter();

    function logout() {
      localStorage.removeItem('access_token');
      Toast.fire({ title: '登出成功', icon: 'success' });
      router.push('/login');
    }

    return () => (
      <VApp>
        <VAppBar color="primary" density="comfortable">
          {{
            default: () => (
              <VAppBarTitle>
                <RouterLink to="/">毕业照报名系统</RouterLink>
              </VAppBarTitle>
            ),
            append: () => (
              <VMenu>
                {{
                  default: () => (
                    <VList>
                      <VListItem onClick={logout} value={'logout'}>
                        <VListItemTitle>登出</VListItemTitle>
                      </VListItem>
                    </VList>
                  ),
                  activator: ({ props }) => (
                    <VBtn icon={mdiDotsVertical} {...props}></VBtn>
                  )
                }}
              </VMenu>
            )
          }}
        </VAppBar>

        <VMain>
          <RouterView></RouterView>
        </VMain>
      </VApp>
    );
  }
});
