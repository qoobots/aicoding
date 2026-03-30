<template>
  <div class="project-list-page">
    <t-layout>
      <t-header class="header">
        <div class="header-left">
          <h2>项目列表</h2>
          <span class="subtitle">管理您的所有项目</span>
        </div>
        <div class="header-right">
          <t-button theme="primary" @click="handleCreateProject">
            <template #icon><add-icon /></template>
            新建项目
          </t-button>
        </div>
      </t-header>

      <t-content class="content">
        <div class="search-bar">
          <t-input
            v-model="searchKeyword"
            placeholder="搜索项目名称..."
            clearable
            @clear="handleSearch"
            @enter="handleSearch"
          >
            <template #suffix-icon>
              <search-icon />
            </template>
          </t-input>
        </div>

        <t-space direction="vertical" size="large" class="project-list">
          <t-card
            v-for="project in filteredProjects"
            :key="project.id"
            hover-shadow
            class="project-card"
          >
            <template #header>
              <div class="card-header">
                <h3>{{ project.name }}</h3>
                <t-tag :theme="getStatusTheme(project.status)">
                  {{ getStatusText(project.status) }}
                </t-tag>
              </div>
            </template>

            <p class="description">{{ project.description }}</p>

            <div class="meta">
              <span class="meta-item">
                <calendar-icon />
                {{ formatDate(project.createdAt) }}
              </span>
              <span class="meta-item">
                <time-icon />
                {{ formatDate(project.updatedAt) }}
              </span>
            </div>

            <div class="card-actions">
              <t-space size="small">
                <t-button size="small" variant="text" @click="handleOpenProject(project.id)">
                  打开
                </t-button>
                <t-button size="small" variant="text" @click="handleEditProject(project.id)">
                  编辑
                </t-button>
                <t-popconfirm
                  content="确定要删除这个项目吗？"
                  @confirm="handleDeleteProject(project.id)"
                >
                  <t-button size="small" variant="text" theme="danger">
                    删除
                  </t-button>
                </t-popconfirm>
              </t-space>
            </div>
          </t-card>

          <t-empty v-if="filteredProjects.length === 0" description="暂无项目" />
        </t-space>
      </t-content>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import {
  AddIcon,
  SearchIcon,
  CalendarIcon,
  TimeIcon,
} from 'tdesign-icons-vue-next';

const router = useRouter();
const projectStore = useProjectStore();

const searchKeyword = ref('');

// 页面加载时获取项目列表
onMounted(() => {
  projectStore.fetchProjects();
});

const filteredProjects = computed(() => {
  if (!searchKeyword.value) {
    return projectStore.projects;
  }
  return projectStore.projects.filter(project =>
    project.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

function handleCreateProject() {
  router.push('/projects/create');
}

function handleOpenProject(id: string) {
  router.push(`/projects/${id}`);
}

function handleEditProject(id: string) {
  router.push(`/projects/${id}/edit`);
}

function handleDeleteProject(id: string) {
  projectStore.deleteProject(id);
}

function handleSearch() {
  // 搜索逻辑已在 computed 中实现
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

function formatDate(date: string | Date) {
  return date ? new Date(date).toLocaleDateString('zh-CN') : '-';
}
</script>

<style scoped>
.project-list-page {
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

.content {
  padding: 24px;
  background: #f3f3f3;
}

.search-bar {
  margin-bottom: 24px;
}

.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.project-card {
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

.card-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
