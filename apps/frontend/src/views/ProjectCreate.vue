<template>
  <div class="project-create-page">
    <t-layout>
      <t-header class="header">
        <div class="header-left">
          <t-button variant="text" @click="handleBack">
            <template #icon><chevron-left-icon /></template>
            返回
          </t-button>
          <h2>创建项目</h2>
        </div>
      </t-header>

      <t-content class="content">
        <div class="form-container">
          <t-form
            ref="formRef"
            :data="formData"
            :rules="rules"
            label-width="120px"
            @submit="handleSubmit"
          >
            <t-form-item label="项目名称" name="name">
              <t-input
                v-model="formData.name"
                placeholder="请输入项目名称"
                clearable
              />
            </t-form-item>

            <t-form-item label="项目描述" name="description">
              <t-textarea
                v-model="formData.description"
                placeholder="请输入项目描述"
                :autosize="{ minRows: 3, maxRows: 6 }"
                clearable
              />
            </t-form-item>

            <t-form-item label="项目类型" name="type">
              <t-select v-model="formData.type" placeholder="请选择项目类型">
                <t-option value="spring-boot" label="Spring Boot" />
                <t-option value="spring-cloud" label="Spring Cloud" />
              </t-select>
            </t-form-item>

            <t-form-item label="包名" name="packageName">
              <t-input
                v-model="formData.packageName"
                placeholder="例如: com.example"
                clearable
              />
            </t-form-item>

            <t-form-item label="项目配置">
              <t-space direction="vertical" style="width: 100%">
                <t-checkbox v-model="formData.config.includeLombok">
                  包含 Lombok
                </t-checkbox>
                <t-checkbox v-model="formData.config.includeSwagger">
                  包含 Swagger
                </t-checkbox>
                <t-checkbox v-model="formData.config.includeMybatis">
                  包含 MyBatis
                </t-checkbox>
                <t-checkbox v-model="formData.config.includeRedis">
                  包含 Redis
                </t-checkbox>
              </t-space>
            </t-form-item>

            <t-form-item label="数据库配置" name="database">
              <t-radio-group v-model="formData.database.type">
                <t-radio value="mysql">MySQL</t-radio>
                <t-radio value="postgresql">PostgreSQL</t-radio>
                <t-radio value="sqlite">SQLite</t-radio>
              </t-radio-group>
            </t-form-item>

            <t-form-item v-if="formData.database.type !== 'sqlite'" label="数据库地址" name="database.host">
              <t-input
                v-model="formData.database.host"
                placeholder="例如: localhost"
                clearable
              />
            </t-form-item>

            <t-form-item v-if="formData.database.type !== 'sqlite'" label="数据库端口" name="database.port">
              <t-input-number
                v-model="formData.database.port"
                :min="1"
                :max="65535"
                placeholder="例如: 3306"
              />
            </t-form-item>

            <t-form-item label="数据库名称" name="database.name">
              <t-input
                v-model="formData.database.name"
                placeholder="请输入数据库名称"
                clearable
              />
            </t-form-item>

            <t-form-item>
              <t-space>
                <t-button theme="primary" type="submit" :loading="loading">
                  创建项目
                </t-button>
                <t-button theme="default" @click="handleReset">
                  重置
                </t-button>
                <t-button theme="default" @click="handleBack">
                  取消
                </t-button>
              </t-space>
            </t-form-item>
          </t-form>
        </div>
      </t-content>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { MessagePlugin } from 'tdesign-vue-next';
import { ChevronLeftIcon } from 'tdesign-icons-vue-next';

const router = useRouter();
const projectStore = useProjectStore();

const formRef = ref();
const loading = ref(false);

const formData = ref({
  name: '',
  description: '',
  type: 'spring-boot',
  packageName: '',
  config: {
    includeLombok: true,
    includeSwagger: true,
    includeMybatis: false,
    includeRedis: false,
  },
  database: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    name: '',
  },
});

const rules = {
  name: [{ required: true, message: '请输入项目名称', type: 'error' }],
  description: [{ required: true, message: '请输入项目描述', type: 'error' }],
  type: [{ required: true, message: '请选择项目类型', type: 'error' }],
  packageName: [
    { required: true, message: '请输入包名', type: 'error' },
    {
      pattern: /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/,
      message: '包名格式不正确',
    },
  ],
  'database.name': [
    { required: true, message: '请输入数据库名称', type: 'error' },
  ],
};

async function handleSubmit() {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;

  try {
    await projectStore.createProject(formData.value);
    MessagePlugin.success('项目创建成功');
    router.push('/projects');
  } catch (error) {
    MessagePlugin.error('项目创建失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function handleReset() {
  formData.value = {
    name: '',
    description: '',
    type: 'spring-boot',
    packageName: '',
    config: {
      includeLombok: true,
      includeSwagger: true,
      includeMybatis: false,
      includeRedis: false,
    },
    database: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      name: '',
    },
  };
  formRef.value?.reset();
}

function handleBack() {
  router.push('/projects');
}
</script>

<style scoped>
.project-create-page {
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
  overflow-y: auto;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
