import { useStorage } from '@vueuse/core';
import { defineComponent, ref } from 'vue';
import NoteDialog from '~/components/NoteDialog';
import RegistrationForm from '~/components/RegistrationForm';

export default defineComponent({
  setup() {
    const dialog = ref(!useStorage('note-dialog-never-show', false).value);

    return () => (
      <div>
        <NoteDialog v-model={dialog.value}></NoteDialog>
        <RegistrationForm></RegistrationForm>
      </div>
    );
  }
});
