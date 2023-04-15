import { computedAsync, useAsyncState } from '@vueuse/core';
import { computed, defineComponent, ref } from 'vue';
import {
  VBtn,
  VCard,
  VForm,
  VOverlay,
  VProgressCircular,
  VProgressLinear,
  VRadio,
  VRadioGroup,
  VSelect,
  VTextField
} from 'vuetify/components';
import axios from '~/utils/axios';
import { formatDateTime } from '~/utils/datetime';
import { Swal, Toast } from '~/utils/swal';

export default defineComponent({
  setup() {
    const form = ref<any>(undefined);
    const rules = {
      phoneNumber: [(v: string) => !!v.match(/^1\d{10}$/) || '手机号格式不正确']
    };
    const formEl = ref<VForm | null>(null);
    const {
      state: _state,
      isLoading,
      execute
    } = useAsyncState(
      () =>
        axios.get('/user').then(res => {
          const {
            sdu_id: sduId,
            name,
            signed_up: signedUp,
            gender,
            multi_person: multiPerson,
            phone_number: phoneNumber,
            time: dateTime
          } = res.data;
          let date = '';
          let time = '';
          let campus = null;
          if (dateTime) {
            campus = dateTime.campus;
            const tmp = formatDateTime(
              dateTime.start as string,
              dateTime.end as string
            );
            date = tmp.date;
            time = tmp.time;
          }

          form.value = {
            sduId,
            name,
            gender,
            signedUp,
            phoneNumber,
            multiPerson,
            dateTime: {
              id: dateTime.id,
              time,
              date,
              ori: dateTime
            },
            campus
          };
          return res.data;
        }),
      {},
      { delay: 1000, resetOnExecute: false }
    );
    const campusList = useAsyncState(
      axios.get('/campuses', { params: { limit: 100 } }).then(res => res.data),
      []
    );
    const dateTimeList = computedAsync(async () => {
      if (!form.value?.campus?.id) {
        return [];
      }
      return axios
        .get('/times', {
          params: { campus_id: form.value.campus.id }
        })
        .then(res => res.data);
    });
    const dateList = computed(() => {
      const b = new Set();
      for (const x of dateTimeList.value) {
        b.add(formatDateTime(x.start, x.end).date);
      }
      return Array.from(b.keys());
    });
    const timeList = computed(() => {
      if (!form.value?.dateTime?.date) {
        return [];
      }
      const res = [];
      for (const x of dateTimeList.value) {
        const dateTime = formatDateTime(x.start, x.end);
        if (dateTime.date === form.value.dateTime.date) {
          res.push({ id: x.id, time: dateTime.time });
        }
      }
      return res;
    });
    const submitting = ref(false);

    async function handleSignUp() {
      if (!formEl.value) {
        return;
      }
      if (!(await formEl.value.validate().then(res => res.valid))) {
        return;
      }

      submitting.value = true;
      const data = {
        signed_up: true,
        phone_number: form.value.phoneNumber,
        gender: form.value.gender,
        multi_person: form.value.multiPerson,
        time_id: form.value.dateTime.id
      };
      await axios
        .put('/user', data)
        .then(_res => {
          Toast.fire({ title: '报名/更新信息成功', icon: 'success' });
        })
        .catch(_err => {
          Swal.fire({ title: '未知原因，操作失败', icon: 'error' });
        });
      submitting.value = false;
      await execute(0);
    }
    async function handleCancelSignUp() {
      submitting.value = true;
      const data = {
        signed_up: false
      };
      await axios
        .put('/user', data)
        .then(_res => {
          Toast.fire({ title: '取消报名成功', icon: 'success' });
        })
        .catch(_err => {
          Swal.fire({ title: '未知原因，操作失败', icon: 'error' });
        });
      submitting.value = false;
      await execute(0);
    }

    return () => (
      <div>
        <VCard p="sm" mx="auto" my="xl" w="9/10" max-w="256">
          {form.value ? (
            <VForm ref={formEl}>
              <VOverlay
                modelValue={isLoading.value}
                contained
                grid
                place-items-center
              >
                <VProgressCircular
                  color="primary"
                  size="large"
                  indeterminate
                ></VProgressCircular>
              </VOverlay>

              <VTextField
                label="姓名"
                disabled
                v-model={form.value.name}
              ></VTextField>

              <VTextField
                label="学号"
                disabled
                v-model={form.value.sduId}
              ></VTextField>

              <VTextField
                label="手机号"
                v-model={form.value.phoneNumber}
                rules={rules.phoneNumber}
              ></VTextField>

              <VRadioGroup inline label="性别" v-model={form.value.gender}>
                <VRadio label="男" value="male"></VRadio>
                <VRadio label="女" value="female"></VRadio>
              </VRadioGroup>

              <VRadioGroup
                inline
                label="是否多人拍摄"
                v-model={form.value.multiPerson}
              >
                <VRadio label="是" value={true}></VRadio>
                <VRadio label="否" value={false}></VRadio>
              </VRadioGroup>

              <VSelect
                label="拍摄校区"
                v-model={form.value.campus}
                items={campusList.state.value}
                itemTitle="name"
                itemValue="id"
                returnObject
              ></VSelect>

              <VSelect
                label="拍摄日期"
                v-model={form.value.dateTime.date}
                items={dateList.value}
              ></VSelect>

              <VSelect
                label="拍摄时间"
                v-model={form.value.dateTime.id}
                items={timeList.value}
                itemTitle="time"
                itemValue="id"
              ></VSelect>

              <div grid place-items-center min-h="16">
                {submitting.value ? (
                  <VProgressLinear
                    indeterminate
                    color="primary"
                  ></VProgressLinear>
                ) : form.value.signedUp ? (
                  <div flex flex-row justify-center gap="16">
                    <VBtn color="primary" onClick={handleSignUp}>
                      修改信息
                    </VBtn>
                    <VBtn color="warning" onClick={handleCancelSignUp}>
                      取消报名
                    </VBtn>
                  </div>
                ) : (
                  <div flex flex-row justify-center>
                    <VBtn color="primary" onClick={handleSignUp}>
                      报名
                    </VBtn>
                  </div>
                )}
              </div>
            </VForm>
          ) : (
            <div py="4">
              <VProgressLinear color="primary" indeterminate></VProgressLinear>
            </div>
          )}
        </VCard>
      </div>
    );
  }
});
