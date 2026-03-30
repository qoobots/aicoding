<template>
  <div class="project-edit-page">
    <t-layout>
      <t-header class="header">
        <div class="header-left">
          <t-button variant="text" @click="handleBack">
            <template #icon><chevron-left-icon /></template>
            返回
          </t-button>
          <h2>编辑项目</h2>
        </div>
      </t-header>

      <t-content class="content">
        <t-card v-if="project">
          <t-form :data="formData" label-width="120px" @submit="handleSubmit">
            <t-form-item label="项目名称" name="name">
              <t-input v-model="formData.name" placeholder="请输入项目名称" />
            </t-form-item>

            <t-form-item label="项目描述" name="description">
              <t-textarea
                v-model="formData.description"
                placeholder="请输入项目描述"
                :autosize="{ minRows: 3, maxRows: 6 }"
              />
            </t-form-item>

            <t-form-item label="项目类型" name="type">
              <t-select v-model="formData.type" placeholder="请选择项目类型">
                <t-option value="spring-boot" label="Spring Boot" />
                <t-option value="spring-cloud" label="Spring Cloud" />
                <t-option value="vue3" label="Vue 3" />
                <t-option value="react" label="React" />
              </t-select>
            </t-form-item>

            <t-form-item label="包名" name="packageName">
              <t-input v-model="formData.packageName" placeholder="请输入包名" />
            </t-form-item>

            <t-form-item label="端口" name="port">
              <t-input-number v-model="formData.port" :min="1024" :max="65535" placeholder="请输入端口号" />
            </t-form-item>

            <t-form-item>
              <t-space>
                <t-button theme="primary" type="submit">保存</t-button>
                <t-button @click="handleBack">取消</t-button>
              </t-space>
            </t-form-item>
          </t-form>
        </t-card>
        <t-empty v-else description="项目未找到" />
      </t-content>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { MessagePlugin } from 'tdesign-vue-next';
import { ChevronLeftIcon } from 'tdesign-icons-vue-next';

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();

const project = computed(() => projectStore.currentProject);

const formData = ref({
  name: '',
  description: '',
  type: 'spring-boot' as const,
  packageName: '',
  port: 8080,
});

onMounted(async () => {
  const projectId = route.params.id as string;
  if (projectId) {
    await projectStore.getProjectById(projectId);
    if (project.value) {
      formData.value = {
        name: project.value.name,
        description: project.value.description || '',
        type: project.value.templateType as any,
        packageName: project.value.config.packageName,
        port: project.value.config.port || 8080,
      };
    }
  }
});

async function handleSubmit() {
  try {
    const projectId = route.params.id as string;
    await projectStore.updateProject(projectId, {
      name: formData.value.name,
      description: formData.value.description,
      type: formData.value.type,
      packageName: formData.value.packageName,
      config: {
        port: formData.value.port,
      },
    });
    MessagePlugin.success('保存成功');
    router.push(`/projects/${projectId}`);
  } catch (error: any) {
    MessagePlugin.error(error.message || '保存失败');
  }
}

function handleBack() {
  router.push(`/projects/${route.params.id}`);
}
</script>

<style scoped>
.project-edit-page {
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  padding: 24px;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
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
}

.content {
  padding: 24px;
  background: #f3f3f3;
}
</style>
