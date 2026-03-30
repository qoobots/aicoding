<template>
  <div class="project-detail-page">
    <t-layout>
      <t-header class="header">
        <div class="header-left">
          <t-button variant="text" @click="handleBack">
            <template #icon><chevron-left-icon /></template>
            返回
          </t-button>
          <h2>{{ project?.name }}</h2>
        </div>
        <div class="header-right">
          <t-button theme="primary" @click="handleGenerateCode">
            <template #icon><code-icon /></template>
            生成代码
          </t-button>
          <t-dropdown :options="actionOptions" @click="handleAction">
            <t-button variant="outline">
              <template #icon><more-icon /></template>
              更多
            </t-button>
          </t-dropdown>
        </div>
      </t-header>

      <t-layout>
        <t-aside class="aside" width="280px">
          <div class="project-info">
            <div class="info-item">
              <span class="label">项目类型:</span>
              <span class="value">{{ project?.type || project?.templateType }}</span>
            </div>
            <div class="info-item">
              <span class="label">包名:</span>
              <span class="value">{{ project?.packageName || project?.config?.packageName }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态:</span>
              <t-tag :theme="getStatusTheme(project?.status || 'active')">
                {{ getStatusText(project?.status || 'active') }}
              </t-tag>
            </div>
            <div class="info-item">
              <span class="label">创建时间:</span>
              <span class="value">{{ formatDate(project?.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="label">更新时间:</span>
              <span class="value">{{ formatDate(project?.updatedAt) }}</span>
            </div>
          </div>

          <t-divider />

          <div class="tabs">
            <t-tabs v-model="activeTab" placement="left">
              <t-tab-panel value="entities" label="实体管理" />
              <t-tab-panel value="files" label="文件管理" />
              <t-tab-panel value="settings" label="项目设置" />
            </t-tabs>
          </div>
        </t-aside>

        <t-content class="content">
          <div v-if="activeTab === 'entities'" class="tab-content">
            <div class="tab-header">
              <h3>实体管理</h3>
              <t-button size="small" @click="handleCreateEntity">
                <template #icon><add-icon /></template>
                新建实体
              </t-button>
            </div>

            <t-table
              :data="[]"
              :columns="entityColumns"
              :pagination="pagination"
              @page-change="handlePageChange"
            >
              <template #operation="{ row }">
                <t-space>
                  <t-link theme="primary" @click="handleEditEntity(row)">
                    编辑
                  </t-link>
                  <t-popconfirm
                    content="确定要删除这个实体吗？"
                    @confirm="handleDeleteEntity(row.id)"
                  >
                    <t-link theme="danger">删除</t-link>
                  </t-popconfirm>
                </t-space>
              </template>
            </t-table>
          </div>

          <div v-else-if="activeTab === 'files'" class="tab-content">
            <div class="tab-header">
              <h3>文件管理</h3>
              <t-space>
                <t-button size="small" @click="handleOpenEditor">
                  <template #icon><code-icon /></template>
                  编辑代码
                </t-button>
                <t-button size="small" @click="handleGenerateAll">
                  <template #icon><code-icon /></template>
                  全部生成
                </t-button>
                <t-button size="small" theme="primary" @click="handleExport">
                  <template #icon><download-icon /></template>
                  导出项目
                </t-button>
              </t-space>
            </div>

            <t-empty description="暂无生成文件" />
          </div>

          <div v-else-if="activeTab === 'settings'" class="tab-content">
            <div class="tab-header">
              <h3>项目设置</h3>
            </div>

            <t-form v-if="project" :data="project" label-width="120px" @submit="handleSaveSettings">
              <t-form-item label="项目名称">
                <t-input v-model="project.name" />
              </t-form-item>

              <t-form-item label="项目描述">
                <t-textarea
                  v-model="project.description"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                />
              </t-form-item>

              <t-form-item>
                <t-space>
                  <t-button theme="primary" type="submit">保存</t-button>
                  <t-button @click="handleBack">取消</t-button>
                </t-space>
              </t-form-item>
            </t-form>
            <t-empty v-else description="项目未找到" />
          </div>
        </t-content>
      </t-layout>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { MessagePlugin } from 'tdesign-vue-next';
import {
  ChevronLeftIcon,
  CodeIcon,
  MoreIcon,
  AddIcon,
  DownloadIcon,
} from 'tdesign-icons-vue-next';

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();

const activeTab = ref('entities');
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

const project = computed(() => {
  const projectId = route.params.id as string;
  // 优先从 currentProject 获取,如果没有则从 projects 列表查找
  return projectStore.currentProject?.id === projectId 
    ? projectStore.currentProject 
    : projectStore.projects.find(p => p.id === projectId);
});

const entityColumns = [
  { colKey: 'name', title: '实体名称', width: 200 },
  { colKey: 'tableName', title: '表名', width: 200 },
  { colKey: 'description', title: '描述' },
  { colKey: 'operation', title: '操作', width: 150, fixed: 'right' },
];

const actionOptions = [
  { content: '导出代码', value: 'export' },
  { content: '复制项目', value: 'copy' },
  { content: '删除项目', value: 'delete', theme: 'danger' },
];

onMounted(() => {
  // 加载项目详情
  const projectId = route.params.id as string;
  if (projectId) {
    projectStore.getProjectById(projectId);
  }
});

function handleBack() {
  router.push('/projects');
}

function handleGenerateCode() {
  MessagePlugin.success('代码生成功能开发中...');
}

function handleAction(value: string) {
  switch (value) {
    case 'export':
      MessagePlugin.success('导出功能开发中...');
      break;
    case 'copy':
      MessagePlugin.success('复制功能开发中...');
      break;
    case 'delete':
      MessagePlugin.success('删除功能开发中...');
      break;
  }
}

function handleCreateEntity() {
  router.push(`/entity-designer?projectId=${route.params.id}`);
}

function handleEditEntity(entity: any) {
  MessagePlugin.success('编辑实体功能开发中...');
}

function handleDeleteEntity(id: string) {
  MessagePlugin.success('删除实体功能开发中...');
}

function handleGenerateAll() {
  MessagePlugin.success('全部生成功能开发中...');
}

function handleExport() {
  MessagePlugin.success('导出项目功能开发中...');
}

function handleOpenEditor() {
  router.push(`/projects/${route.params.id}/editor`);
}

function handleSaveSettings() {
  MessagePlugin.success('保存成功');
}

function handlePageChange(pageInfo: any) {
  pagination.value = pageInfo;
}

function getStatusTheme(status: string) {
  const themes: Record<string, any> = {
    active: 'success',
    archived: 'warning',
    deleted: 'danger',
  };
  return themes[status] || 'default';
}

function getStatusText(status: string) {
  const texts: Record<string, string> = {
    active: '进行中',
    archived: '已归档',
    deleted: '已删除',
  };
  return texts[status] || status;
}

function formatDate(date: string | Date | undefined) {
  return date ? new Date(date).toLocaleDateString('zh-CN') : '-';
}
</script>

<style scoped>
.project-detail-page {
  height: 100%;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.aside {
  background: #fff;
  border-right: 1px solid #e7e7e7;
  padding: 24px 16px;
  overflow-y: auto;
  flex-shrink: 0;
}

.project-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f3f3;
  min-height: 40px;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-size: 14px;
  flex-shrink: 0;
}

.value {
  font-weight: 500;
  font-size: 14px;
  text-align: right;
  word-break: break-all;
  flex: 1;
  margin-left: 12px;
}

.tabs {
  margin-top: 16px;
}

.content {
  padding: 24px;
  background: #f3f3f3;
  overflow-y: auto;
  flex: 1;
}

.tab-content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.tab-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .header-left h2 {
    font-size: 18px;
  }

  .header {
    padding: 16px;
  }

  .content {
    padding: 16px;
  }
}
</style>
