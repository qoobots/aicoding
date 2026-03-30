<template>
  <div class="code-preview">
    <div class="preview-header">
      <div class="file-info">
        <folder-icon />
        <span class="filename">{{ filename }}</span>
        <t-tag v-if="language" size="small" theme="primary">
          {{ language }}
        </t-tag>
      </div>
      <t-space>
        <t-button size="small" variant="text" @click="handleCopy">
          <template #icon><copy-icon /></template>
          复制
        </t-button>
        <t-button size="small" variant="text" @click="handleDownload">
          <template #icon><download-icon /></template>
          下载
        </t-button>
        <t-button size="small" variant="text" @click="handleFormat">
          <template #icon><format-icon /></template>
          格式化
        </t-button>
      </t-space>
    </div>
    <div class="preview-body">
      <MonacoEditor
        ref="editorRef"
        v-model="code"
        :language="language"
        :options="editorOptions"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import MonacoEditor from './MonacoEditor.vue';
import {
  FolderIcon,
  CopyIcon,
  DownloadIcon,
} from 'tdesign-icons-vue-next';

interface Props {
  code?: string;
  filename?: string;
  language?: string;
  readonly?: boolean;
}

interface Emits {
  (e: 'update:code', value: string): void;
  (e: 'change', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  filename: 'Untitled.java',
  language: 'java',
  readonly: true
});

const emit = defineEmits<Emits>();

const editorRef = ref<InstanceType<typeof MonacoEditor>>();

const editorOptions = computed(() => ({
  readOnly: props.readonly,
  minimap: { enabled: false },
  lineNumbers: 'on',
  fontSize: 13,
  scrollBeyondLastLine: false,
  wordWrap: 'off',
}));

function handleChange(value: string) {
  emit('update:code', value);
  emit('change', value);
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.code);
    MessagePlugin.success('已复制到剪贴板');
  } catch (error) {
    MessagePlugin.error('复制失败');
  }
}

function handleDownload() {
  const blob = new Blob([props.code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = props.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  MessagePlugin.success('下载成功');
}

function handleFormat() {
  editorRef.value?.format();
  MessagePlugin.success('格式化完成');
}

defineExpose({
  format: () => editorRef.value?.format(),
  getValue: () => editorRef.value?.getValue() || '',
  setValue: (value: string) => editorRef.value?.setValue(value)
});
</script>

<style scoped>
.code-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f8f8;
  border-bottom: 1px solid #e7e7e7;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filename {
  font-weight: 500;
  color: #333;
}

.preview-body {
  flex: 1;
  overflow: hidden;
}
</style>
