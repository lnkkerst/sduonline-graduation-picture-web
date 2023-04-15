import { useStorage } from '@vueuse/core';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VCheckbox,
  VDialog
} from 'vuetify/components';

export default defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: { type: Boolean, default: false }
  },
  emits: {
    'update:modelValue': function (_value: boolean) {
      return true;
    }
  },
  setup(props, { emit }) {
    const nerverShow = useStorage('note-dialog-never-show', false);
    const second = ref(5);
    let timer = NaN;
    const content = `
1. 本次活动仅限于毕业生参加，非毕业生无法参与报名。
2. 多人拍摄预约为共同拍摄，不进行个人单独拍摄限制，人数在五人以内。
3. 您的照片将有机会发布于学生在线官方公众号中，感谢支持！
`;

    onMounted(() => {
      timer = setInterval(() => {
        second.value -= 1;
        if (second.value < 0.5) {
          clearInterval(timer);
          timer = NaN;
        }
      }, 1000) as unknown as number;
    });

    onUnmounted(() => {
      if (!isNaN(timer)) {
        clearInterval(timer);
      }
    });

    return () => (
      <VDialog
        modelValue={props.modelValue}
        onUpdate:modelValue={e => emit('update:modelValue', e)}
        persistent
      >
        <VCard w="8/10" mx="auto" min-w="240px">
          <VCardTitle>用户须知</VCardTitle>
          <VCardText prose max-w="full">
            {content
              .trim()
              .split('\n')
              .map(text => (
                <p key={text}>{text}</p>
              ))}
          </VCardText>
          <div flex>
            <div grow></div>
            <VCheckbox
              label="不再提示"
              color="primary"
              v-model={nerverShow.value}
              hideDetails
            ></VCheckbox>
          </div>
          <VCardActions>
            <VBtn
              disabled={second.value > 0}
              color="primary"
              block
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                emit('update:modelValue', false);
              }}
            >
              {second.value > 0 ? `请阅读${second.value}秒` : '确认'}
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    );
  }
});
