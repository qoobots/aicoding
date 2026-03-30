<template>
  <t-layout class="app-layout">
    <!-- 头部 -->
    <t-header class="app-header">
      <div class="header-left">
        <div class="logo">
          <img src="/vite.svg" alt="Logo" />
          <span>AI编程平台</span>
        </div>
      </div>

      <div class="header-center">
        <t-head-menu
          v-model="activeMenu"
          theme="light"
          :default-active="activeMenu"
          @change="handleMenuChange"
          class="nav-menu"
        >
          <t-menu-item value="/">
            <span class="menu-text">首页</span>
          </t-menu-item>
          <t-menu-item value="/projects">
            <span class="menu-text">项目</span>
          </t-menu-item>
          <t-menu-item value="/templates">
            <span class="menu-text">模板</span>
          </t-menu-item>
          <t-menu-item value="/database">
            <span class="menu-text">数据库</span>
          </t-menu-item>
          <t-menu-item value="/settings">
            <span class="menu-text">设置</span>
          </t-menu-item>
        </t-head-menu>
      </div>

      <div class="header-right">
        <t-button variant="text" size="medium" @click="handleCreateProject">
          <template #icon><add-icon /></template>
          新建项目
        </t-button>
      </div>
    </t-header>

    <!-- 主体内容 -->
    <t-layout class="app-main">
      <t-content class="app-content">
        <router-view />
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AddIcon } from 'tdesign-icons-vue-next';

const route = useRoute();
const router = useRouter();

const activeMenu = ref(route.path);

watch(
  () => route.path,
  newPath => {
    activeMenu.value = newPath;
  }
);

function handleMenuChange(value: string) {
  router.push(value);
}

function handleCreateProject() {
  router.push('/projects/create');
}
</script>

<style scoped>
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: #fff;
  border-bottom: 1px solid #e7e7e7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 60px;
  position: relative;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 140px;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
}

.logo img {
  width: 28px;
  height: 28px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 300px;
  height: 50px;
  /* padding: 0 16px; */
  overflow: visible;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 90px;
  flex-shrink: 0;
}

.app-main {
  flex: 1;
  overflow: hidden;
}

.app-content {
  height: 100%;
  overflow-y: auto;
  background-color: #f3f3f3;
}



.menu-text {
  display: inline-block;
  white-space: nowrap;
  overflow: visible;
}

/* 按钮样式优化 */
:deep(.header-right .t-button) {
  height: 36px;
  line-height: 1;
  padding: 0 16px;
  font-size: 14px;
}

/* 响应式优化 - 小屏幕时调整菜单间距 */
@media (max-width: 1200px) {
  .header-left {
    min-width: 120px;
  }

  :deep(.t-menu__item) {
    padding: 0 18px;
  }
}

@media (max-width: 992px) {
  .header-left {
    min-width: 100px;
  }

  .logo {
    font-size: 15px;
  }

  .logo img {
    width: 24px;
    height: 24px;
  }
}
</style>
