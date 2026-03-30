<template>
  <div class="template-editor-page">
    <t-layout>
      <!-- 顶部操作栏 -->
      <t-header class="header">
        <t-space size="medium">
          <t-button variant="outline" @click="goBack">
            <template #icon><chevron-left-icon /></template>
            返回
          </t-button>
          <t-divider layout="vertical" />
          <span class="template-title">{{ templateTitle }}</span>
          <t-divider layout="vertical" />
          <t-button theme="primary" @click="saveTemplate">
            <template #icon><save-icon /></template>
            保存模板
          </t-button>
          <t-button variant="outline" @click="previewCode">
            <template #icon><play-circle-icon /></template>
            预览生成代码
          </t-button>
          <t-button variant="outline" @click="copyCode">
            <template #icon><copy-icon /></template>
            复制代码
          </t-button>
        </t-space>
      </t-header>

      <!-- 主内容区：左右分栏 -->
      <t-content class="content">
        <div class="editor-container">
          <!-- 左侧：模板编辑器 -->
          <div class="editor-section left">
            <div class="editor-header">
              <h3>模板代码</h3>
              <span class="editor-hint">使用 {{ templateEngine }} 模板语法</span>
            </div>
            <div ref="templateEditorRef" class="monaco-editor"></div>
          </div>

          <!-- 中间分割线 -->
          <div class="divider">
            <div class="divider-line"></div>
            <t-button size="small" variant="text" @click="swapPanels">
              <swap-icon />
            </t-button>
          </div>

          <!-- 右侧：生成的代码预览 -->
          <div class="editor-section right">
            <div class="editor-header">
              <h3>生成的代码</h3>
              <span class="editor-hint">基于当前表配置生成</span>
            </div>
            <div ref="generatedEditorRef" class="monaco-editor"></div>
          </div>
        </div>
      </t-content>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import * as monaco from 'monaco-editor';
import {
  ChevronLeftIcon,
  SaveIcon,
  PlayCircleIcon,
  CopyIcon,
  SwapIcon,
} from 'tdesign-icons-vue-next';

const route = useRoute();
const router = useRouter();

const templateType = ref(route.params.type as string);
const templateCode = ref('');
const generatedCode = ref('');
const templateEditorRef = ref<HTMLElement>();
const generatedEditorRef = ref<HTMLElement>();

// Monaco Editor 实例
let templateEditor: monaco.editor.IStandaloneCodeEditor | null = null;
let generatedEditor: monaco.editor.IStandaloneCodeEditor | null = null;

// 模板引擎类型
const templateEngine = computed(() => {
  return 'Handlebars';
});

// 根据模板类型推断编程语言
function getLanguageForTemplate(type: string): string {
  const javaTypes = ['entity', 'mapper', 'mapperXml', 'service', 'serviceImpl', 'controller', 'dto', 'requestDto', 'vo', 'common', 'test'];
  const vueTypes = ['vueEntity', 'vueCreate', 'vueEdit', 'vueDetail', 'vueList'];

  if (javaTypes.includes(type)) {
    return type === 'mapperXml' ? 'xml' : 'java';
  } else if (vueTypes.includes(type)) {
    return 'typescript';
  }
  return 'plaintext';
}

// 模板 API
const templateService = {
  // 获取模板内容
  async getTemplate(type: string) {
    try {
      const response = await fetch(`/api/code-generator/templates/${type}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `获取模板失败 (${response.status})`);
      }
      const data = await response.json();
      // API 响应格式: { code: 0, data: { content: "..." }, timestamp: ... }
      return data.data?.content || '';
    } catch (error) {
      console.error('获取模板失败:', error);
      return '';
    }
  },

  // 保存模板
  async saveTemplate(type: string, content: string) {
    try {
      const response = await fetch(`/api/code-generator/templates/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `保存模板失败 (${response.status})`);
      }
      return true;
    } catch (error) {
      console.error('保存模板失败:', error);
      return false;
    }
  },

  // 预览生成代码
  async previewCode(type: string, tableName: string, packageName: string) {
    try {
      const response = await fetch(`/api/code-generator/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, tableName, packageName }),
      });
      if (!response.ok) {
        throw new Error('预览代码失败');
      }
      const data = await response.json();
      return data.content || '';
    } catch (error) {
      console.error('预览代码失败:', error);
      return '';
    }
  },
};

// 模板标题映射
const templateTitleMap: Record<string, string> = {
  entity: '实体类模板',
  mapper: 'Mapper 接口模板',
  mapperXml: 'Mapper XML 映射文件模板',
  service: 'Service 接口模板',
  serviceImpl: 'Service 实现类模板',
  controller: 'Controller 控制器模板',
  dto: 'DTO 模板',
  requestDto: 'RequestDTO 模板',
  vo: 'VO 模板',
  common: 'Common 公共类模板',
  test: '单元测试类模板',
  vueEntity: 'Vue 实体类模板',
  vueCreate: 'Vue 新增页面模板',
  vueEdit: 'Vue 编辑页面模板',
  vueDetail: 'Vue 详情页面模板',
  vueList: 'Vue 列表页面模板',
};

const templateTitle = computed(() => {
  return templateTitleMap[templateType.value] || '未知模板';
});

// 默认模板代码（作为备用，如果后端没有模板时使用）
const defaultTemplates: Record<string, string> = {
  entity: 'package ${packageName};\n\npublic class ${className} {\n}',
  mapper: 'package ${packageName};\n\npublic interface ${className} {\n}',
  service: 'package ${packageName};\n\npublic interface ${className} {\n}',
  controller: 'package ${packageName};\n\n@RestController\npublic class ${className} {\n}',
};

// 加载模板
onMounted(async () => {
  await loadTemplate();
  await nextTick();
  initMonacoEditors();
});

// 初始化 Monaco Editor
function initMonacoEditors() {
  const language = getLanguageForTemplate(templateType.value);

  // 初始化模板编辑器
  if (templateEditorRef.value) {
    templateEditor = monaco.editor.create(templateEditorRef.value, {
      value: templateCode.value,
      language: language,
      theme: 'vs',
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
      },
    });

    // 监听内容变化
    templateEditor.onDidChangeModelContent(() => {
      templateCode.value = templateEditor?.getValue() || '';
    });
  }

  // 初始化生成代码编辑器
  if (generatedEditorRef.value) {
    generatedEditor = monaco.editor.create(generatedEditorRef.value, {
      value: generatedCode.value,
      language: language,
      theme: 'vs',
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      readOnly: true,
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
      },
    });
  }
}

async function loadTemplate() {
  console.log('=== 加载模板开始 ===');
  console.log('模板类型:', templateType.value);

  // 先尝试从后端 API 加载模板
  const templateFromApi = await templateService.getTemplate(templateType.value);
  console.log('从 API 获取的模板长度:', templateFromApi?.length || 0);

  if (templateFromApi) {
    templateCode.value = templateFromApi;
    console.log('使用 API 返回的模板');
    console.log('=== 加载模板结束 ===');
    return;
  }

  // 如果 API 没有返回，则使用默认模板
  console.log('API 未返回模板，使用默认模板');
  templateCode.value = defaultTemplates[templateType.value] || '';
  console.log('默认模板长度:', templateCode.value?.length || 0);
  console.log('=== 加载模板结束 ===');
}

// 返回
function goBack() {
  router.back();
}

// 保存模板
async function saveTemplate() {
  console.log('=== 保存模板开始 ===');
  console.log('模板类型:', templateType.value);
  console.log('模板内容长度:', templateCode.value?.length || 0);

  try {
    const success = await templateService.saveTemplate(templateType.value, templateCode.value);
    console.log('保存结果:', success);

    if (success) {
      MessagePlugin.success('模板已保存');
    } else {
      MessagePlugin.error('保存模板失败');
    }
  } catch (error) {
    console.error('保存模板异常:', error);
    MessagePlugin.error('保存模板失败: ' + error.message);
  }
  console.log('=== 保存模板结束 ===');
}

// 预览生成代码
async function previewCode() {
  // 使用默认的测试数据
  const tableName = 't_user';
  const packageName = 'com.example.entity';

  MessagePlugin.loading('正在生成代码...', 0);
  try {
    const code = await templateService.previewCode(templateType.value, tableName, packageName);
    generatedCode.value = code || '// 代码生成失败，请检查后端服务';

    // 更新生成代码编辑器的内容
    if (generatedEditor) {
      generatedEditor.setValue(generatedCode.value);
    }

    MessagePlugin.success('代码生成预览完成');
  } catch (error) {
    MessagePlugin.error('代码生成预览失败');
    generatedCode.value = '// 代码生成失败，请检查后端服务';
    if (generatedEditor) {
      generatedEditor.setValue(generatedCode.value);
    }
  } finally {
    MessagePlugin.closeAll();
  }
}

// 复制代码
function copyCode() {
  if (!generatedCode.value) {
    MessagePlugin.warning('请先生成代码');
    return;
  }

  navigator.clipboard.writeText(generatedCode.value).then(() => {
    MessagePlugin.success('代码已复制到剪贴板');
  }).catch(() => {
    MessagePlugin.error('复制失败');
  });
}

// 交换左右面板
function swapPanels() {
  const temp = templateCode.value;
  templateCode.value = generatedCode.value;
  generatedCode.value = temp;

  // 更新编辑器内容
  if (templateEditor && generatedEditor) {
    templateEditor.setValue(templateCode.value);
    generatedEditor.setValue(generatedCode.value);
  }
}

// 组件销毁时清理编辑器
onBeforeUnmount(() => {
  if (templateEditor) {
    templateEditor.dispose();
    templateEditor = null;
  }
  if (generatedEditor) {
    generatedEditor.dispose();
    generatedEditor = null;
  }
});
</script>

<style scoped>
.template-editor-page {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
  padding: 16px 24px;
  display: flex;
  align-items: center;
}

.template-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.content {
  background: #f3f3f3;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
  padding: 24px;
}

.editor-container {
  display: flex;
  height: 100%;
  gap: 16px;
  min-height: 0;
}

.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
}

.editor-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e7e7e7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.editor-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.editor-hint {
  font-size: 12px;
  color: #999;
}

.monaco-editor {
  flex: 1;
  width: 100%;
  min-height: 0;
}

.divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
}

.divider-line {
  flex: 1;
  width: 1px;
  background: #e7e7e7;
  min-height: 0;
}
</style>
