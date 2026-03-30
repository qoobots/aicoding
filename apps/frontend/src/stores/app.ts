import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
  // 状态
  const sidebarCollapsed = ref(false);
  const theme = ref<'light' | 'dark'>('light');
  const loading = ref(false);
  const loadingMessage = ref('');

  // 计算属性
  const isDark = computed(() => theme.value === 'dark');

  // Actions
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  function setSidebarCollapsed(collapsed: boolean) {
    sidebarCollapsed.value = collapsed;
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('theme', theme.value);
  }

  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme;
    document.documentElement.setAttribute('theme', newTheme);
  }

  function startLoading(message = '加载中...') {
    loading.value = true;
    loadingMessage.value = message;
  }

  function stopLoading() {
    loading.value = false;
    loadingMessage.value = '';
  }

  return {
    sidebarCollapsed,
    theme,
    loading,
    loadingMessage,
    isDark,
    toggleSidebar,
    setSidebarCollapsed,
    toggleTheme,
    setTheme,
    startLoading,
    stopLoading,
  };
});
