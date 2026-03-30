<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

interface Props {
  modelValue?: string;
  language?: string;
  theme?: string;
  readonly?: boolean;
  height?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  language: 'javascript',
  theme: 'vs',
  readonly: false,
  height: '100%',
  options: () => ({})
});

const emit = defineEmits<Emits>();

const editorContainer = ref<HTMLElement>();
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let model: monaco.editor.ITextModel | null = null;

// 配置 worker
self.MonacoEnvironment = {
  getWorker: (_workerId: string, label: string) => {
    return new editorWorker() as unknown as Worker;
  }
};

onMounted(() => {
  if (!editorContainer.value) return;

  // 创建模型
  model = monaco.editor.createModel(props.modelValue, props.language);

  // 创建编辑器
  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    readOnly: props.readonly,
    automaticLayout: true,
    minimap: { enabled: true },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    ...props.options
  });

  // 监听内容变化
  editor.onDidChangeModelContent(() => {
    const value = editor?.getValue() || '';
    emit('update:modelValue', value);
    emit('change', value);
  });
});

// 监听语言变化
watch(() => props.language, (newLanguage) => {
  if (model) {
    monaco.editor.setModelLanguage(model, newLanguage);
  }
});

// 监听主题变化
watch(() => props.theme, (newTheme) => {
  if (editor) {
    monaco.editor.setTheme(newTheme);
  }
});

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (editor && newValue !== editor.getValue()) {
    editor.setValue(newValue);
  }
});

onBeforeUnmount(() => {
  if (model) {
    model.dispose();
  }
  if (editor) {
    editor.dispose();
  }
});

// 暴露编辑器实例给父组件
defineExpose({
  editor,
  getModel: () => model,
  getValue: () => editor?.getValue() || '',
  setValue: (value: string) => editor?.setValue(value),
  format: () => editor?.getAction('editor.action.formatDocument')?.run()
});
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: v-bind('props.height');
  min-height: 300px;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
  overflow: hidden;
}
</style>
