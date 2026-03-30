import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Project } from '@shared/types';
import { projectService } from '@/services/project.service';

export const useProjectStore = defineStore('project', () => {
  // 状态
  const projects = ref<Project[]>([]);
  const currentProject = ref<Project | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 计算属性
  const activeProjects = computed(() => projects.value.filter((p) => p.status === 'active'));

  const archivedProjects = computed(() => projects.value.filter((p) => p.status === 'archived'));

  const totalProjects = computed(() => projects.value.length);

  // Actions
  async function fetchProjects() {
    loading.value = true;
    error.value = null;

    try {
      const response = await projectService.getProjects();
      projects.value = response.data.list;
    } catch (e: any) {
      error.value = e.message;
      console.error('获取项目列表失败:', e);
    } finally {
      loading.value = false;
    }
  }

  async function createProject(config: any) {
    loading.value = true;
    error.value = null;

    try {
      const response = await projectService.create(config);
      projects.value.push(response.data);
      return response.data;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateProject(id: string, data: any) {
    loading.value = true;
    error.value = null;

    try {
      const response = await projectService.update(id, data);
      const index = projects.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects.value[index] = response.data;
      }
      return response.data;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProject(id: string) {
    loading.value = true;
    error.value = null;

    try {
      await projectService.delete(id);
      projects.value = projects.value.filter((p) => p.id !== id);

      if (currentProject.value?.id === id) {
        currentProject.value = null;
      }
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function getProjectById(id: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await projectService.getById(id);
      currentProject.value = response.data;
      return response.data;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function setCurrentProject(project: Project | null) {
    currentProject.value = project;
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    activeProjects,
    archivedProjects,
    totalProjects,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    setCurrentProject,
  };
});
