<template>
  <div class="template-list-page">
    <t-layout>
      <t-header class="header">
        <div class="header-left">
          <h2>模板库</h2>
          <span class="subtitle">选择适合您的代码模板</span>
        </div>
        <div class="header-right">
          <t-input
            v-model="searchKeyword"
            placeholder="搜索模板..."
            clearable
            @clear="handleSearch"
            @enter="handleSearch"
          >
            <template #suffix-icon>
              <search-icon />
            </template>
          </t-input>
        </div>
      </t-header>

      <t-content class="content">
        <div class="filter-bar">
          <t-space>
            <t-select
              v-model="selectedType"
              placeholder="选择类型"
              clearable
              style="width: 150px"
              @change="handleTypeChange"
            >
              <t-option value="" label="全部类型" />
              <t-option value="spring-boot" label="Spring Boot" />
              <t-option value="spring-cloud" label="Spring Cloud" />
              <t-option value="vue3" label="Vue3" />
              <t-option value="react" label="React" />
              <t-option value="common" label="通用" />
            </t-select>
            <t-select
              v-model="selectedCategory"
              placeholder="选择分类"
              clearable
              style="width: 150px"
              @change="handleCategoryChange"
            >
              <t-option value="" label="全部分类" />
              <t-option value="entity" label="实体类" />
              <t-option value="controller" label="控制器" />
              <t-option value="service" label="服务层" />
              <t-option value="repository" label="数据层" />
              <t-option value="component" label="组件" />
              <t-option value="page" label="页面" />
              <t-option value="store" label="状态管理" />
              <t-option value="config" label="配置" />
            </t-select>
          </t-space>
        </div>

        <t-loading :loading="loading">
          <t-space direction="vertical" size="large" class="template-list">
            <t-card
              v-for="template in filteredTemplates"
              :key="template.id"
              hover-shadow
              class="template-card"
            >
              <template #header>
                <div class="card-header">
                  <h3>{{ template.displayName }}</h3>
                  <t-space>
                    <t-tag size="small" :theme="getTypeTheme(template.type)">
                      {{ getTypeText(template.type) }}
                    </t-tag>
                    <t-tag size="small" :theme="getCategoryTheme(template.category)">
                      {{ getCategoryText(template.category) }}
                    </t-tag>
                  </t-space>
                </div>
              </template>

              <p class="description">{{ template.description }}</p>

              <div class="meta">
                <span class="meta-item">
                  <user-icon />
                  {{ template.author || '系统' }}
                </span>
                <span class="meta-item">
                  <time-icon />
                  {{ formatDate(template.updatedAt) }}
                </span>
                <span class="meta-item">
                  <setting-icon />
                  v{{ template.version }}
                </span>
              </div>

              <div v-if="template.tags && template.tags.length > 0" class="tags">
                <t-tag
                  v-for="tag in template.tags"
                  :key="tag"
                  size="small"
                  variant="outline"
                >
                  {{ tag }}
                </t-tag>
              </div>

              <template #actions>
                <t-button theme="primary" @click="handleUseTemplate(template.id)">
                  使用模板
                </t-button>
                <t-button variant="text" @click="handlePreviewTemplate(template)">
                  预览
                </t-button>
              </template>
            </t-card>

            <t-empty v-if="filteredTemplates.length === 0" description="暂无模板" />
          </t-space>
        </t-loading>
      </t-content>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next';
import {
  SearchIcon,
  UserIcon,
  TimeIcon,
  SettingIcon,
} from 'tdesign-icons-vue-next';
import { templateService, type Template } from '@/services/template.service';
import MonacoEditor from '@/components/MonacoEditor.vue';

const router = useRouter();

const searchKeyword = ref('');
const selectedType = ref('');
const selectedCategory = ref('');
const templates = ref<Template[]>([]);
const loading = ref(false);
const selectedTemplate = ref<Template | null>(null);

onMounted(() => {
  loadTemplates();
});

async function loadTemplates() {
  loading.value = true;
  try {
    const params: any = { status: 'active', pageSize: 100 };
    if (selectedType.value) params.type = selectedType.value;
    if (selectedCategory.value) params.category = selectedCategory.value;

    const result = await templateService.getAll(params);
    templates.value = result.list;
  } catch (error) {
    MessagePlugin.error('加载模板失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

const filteredTemplates = computed(() => {
  let result = templates.value;

  if (searchKeyword.value) {
    result = result.filter(template =>
      template.displayName.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      template.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  }

  if (selectedType.value) {
    result = result.filter(template => template.type === selectedType.value);
  }

  if (selectedCategory.value) {
    result = result.filter(template => template.category === selectedCategory.value);
  }

  return result;
});

function handleSearch() {
  // 搜索逻辑已在 computed 中实现
}

async function handleTypeChange() {
  await loadTemplates();
}

async function handleCategoryChange() {
  await loadTemplates();
}

function getTypeTheme(type: string) {
  const themes: Record<string, any> = {
    'spring-boot': 'primary',
    'spring-cloud': 'success',
    'vue3': 'warning',
    'react': 'danger',
    'common': 'default',
  };
  return themes[type] || 'default';
}

function handleUseTemplate(id: string) {
  router.push(`/projects/create?template=${id}`);
}

function handlePreviewTemplate(template: Template) {
  const dialog = DialogPlugin({
    header: `预览模板: ${template.displayName}`,
    width: '80%',
    footer: false,
    body: () => {
      return h(MonacoEditor, {
        value: template.content,
        language: getLanguageForType(template.type),
        readonly: true,
        height: '600px',
      });
    },
  });
}

function getLanguageForType(type: string): string {
  const langMap: Record<string, string> = {
    'spring-boot': 'java',
    'spring-cloud': 'java',
    'vue3': 'typescript',
    'react': 'typescript',
    'common': 'text',
  };
  return langMap[type] || 'text';
}

function getCategoryTheme(category: string) {
  const themes: Record<string, any> = {
    'entity': 'primary',
    'controller': 'success',
    'service': 'warning',
    'repository': 'danger',
    'component': 'primary',
    'page': 'success',
    'store': 'warning',
    'config': 'default',
  };
  return themes[category] || 'default';
}

function getCategoryText(category: string) {
  const texts: Record<string, string> = {
    'entity': '实体类',
    'controller': '控制器',
    'service': '服务层',
    'repository': '数据层',
    'component': '组件',
    'page': '页面',
    'store': '状态管理',
    'config': '配置',
  };
  return texts[category] || category;
}

function getTypeText(type: string) {
  const texts: Record<string, string> = {
    'spring-boot': 'Spring Boot',
    'spring-cloud': 'Spring Cloud',
    'vue3': 'Vue3',
    'react': 'React',
    'common': '通用',
  };
  return texts[type] || type;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN');
}
</script>

<style scoped>
.template-list-page {
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
}

.header-left h2 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.header-right {
  width: 300px;
}

.content {
  padding: 24px;
  background: #f3f3f3;
}

.filter-bar {
  margin-bottom: 24px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}

.template-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.template-card {
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  flex: 1;
}

.description {
  color: #666;
  margin: 16px 0;
  min-height: 48px;
}

.meta {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  color: #999;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
