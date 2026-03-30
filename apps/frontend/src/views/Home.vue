<template>
  <div class="home-page">
    <div class="hero">
      <h1 class="title">AI编程平台</h1>
      <p class="subtitle">智能化代码生成,10000倍提升开发效率</p>

      <div class="actions">
        <t-button theme="primary" size="large" @click="handleCreateProject">
          <template #icon><add-icon /></template>
          创建项目
        </t-button>
        <t-button theme="default" size="large" @click="handleViewProjects">
          查看项目
        </t-button>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-number">{{ totalProjects }}</div>
        <div class="stat-label">总项目数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ totalCodeLines }}</div>
        <div class="stat-label">生成代码行</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ savedHours }}</div>
        <div class="stat-label">节省工时(小时)</div>
      </div>
    </div>

    <div class="features">
      <div class="feature-item">
        <div class="feature-icon">⚡</div>
        <div class="feature-title">智能代码生成</div>
        <div class="feature-desc">AI自动生成完整代码,提升10倍开发效率</div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">🎯</div>
        <div class="feature-title">企业级架构</div>
        <div class="feature-desc">Spring Boot微服务架构,规范统一</div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">🔧</div>
        <div class="feature-title">完整工具链</div>
        <div class="feature-desc">代码审查、测试生成、文档自动生成</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { AddIcon } from 'tdesign-icons-vue-next';

const router = useRouter();
const projectStore = useProjectStore();

const totalProjects = computed(() => projectStore.totalProjects);
const totalCodeLines = computed(() => totalProjects.value * 10000); // 假设每个项目1万行代码
const savedHours = computed(() => Math.floor(totalProjects.value * 20)); // 假设每个项目节省20小时

function handleCreateProject() {
  router.push('/projects/create');
}

function handleViewProjects() {
  router.push('/projects');
}

function handleFileManager() {
  router.push('/file-manager');
}

function handleEntityDesigner() {
  router.push('/entity-designer');
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero {
  text-align: center;
  padding: 60px 0;
}

.title {
  font-size: 48px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 20px;
  color: #666;
  margin-bottom: 40px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 60px 0;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
  color: #0052d9;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: #666;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 60px;
}

.feature-item {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
</style>
