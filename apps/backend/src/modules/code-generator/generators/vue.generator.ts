import { ColumnSchema } from '@shared/types';
import { toCamelCase, dbTypeToTs } from '../utils/code-generator.utils';

/**
 * Vue 代码生成器
 */
export class VueCodeGenerator {
  /**
   * 生成 Vue 实体类型定义
   */
  static generateType(
    tableName: string,
    tableComment: string,
    columns: ColumnSchema[],
    className: string
  ): string {
    const fields = columns
      .map((col) => {
        const tsType = dbTypeToTs(col.dataType);
        const fieldName = toCamelCase(col.columnName);
        const comment = col.columnComment ? `  /** ${col.columnComment} */\n` : '';
        return `${comment}  ${fieldName}${col.isNullable ? '?' : ''}: ${tsType};`;
      })
      .join('\n');

    return `/**
 * ${tableComment || tableName}
 */
export interface ${className} {
${fields}
}`;
  }

  /**
   * 生成 Vue 列表页面
   */
  static generateListPage(
    className: string,
    tableComment: string,
    columns: ColumnSchema[],
    routePath: string
  ): string {
    const simpleName = className.replace('List.vue', '');
    const tableColumns = columns
      .filter((col) => !col.columnName.toLowerCase().endsWith('id') && !col.isPrimaryKey)
      .slice(0, 6) // 只取前6个字段
      .map((col) => {
        return `      { colKey: '${toCamelCase(col.columnName)}', title: '${col.columnComment || col.columnName}' }`;
      })
      .join(',\n');

    return `<template>
  <div class="${simpleName.toLowerCase()}-list-page">
    <t-layout>
      <t-header class="header">
        <div class="header-left">
          <h2>${tableComment || simpleName}列表</h2>
        </div>
        <div class="header-right">
          <t-button theme="primary" @click="handleCreate">
            <template #icon><add-icon /></template>
            新建
          </t-button>
        </div>
      </t-header>

      <t-content class="content">
        <!-- 搜索栏 -->
        <t-card class="search-card">
          <t-form :data="searchForm" layout="inline">
            <t-form-item label="关键词">
              <t-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable />
            </t-form-item>
            <t-form-item>
              <t-space>
                <t-button theme="primary" @click="handleSearch">查询</t-button>
                <t-button @click="handleReset">重置</t-button>
              </t-space>
            </t-form-item>
          </t-form>
        </t-card>

        <!-- 表格 -->
        <t-card>
          <t-table
            :data="tableData"
            :columns="columns"
            :pagination="pagination"
            :loading="loading"
            @page-change="handlePageChange"
          >
            <template #operation="{ row }">
              <t-space>
                <t-link theme="primary" @click="handleView(row)">查看</t-link>
                <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
                <t-popconfirm
                  content="确定要删除这条数据吗？"
                  @confirm="handleDelete(row.id)"
                >
                  <t-link theme="danger">删除</t-link>
                </t-popconfirm>
              </t-space>
            </template>
          </t-table>
        </t-card>
      </t-content>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { AddIcon } from 'tdesign-icons-vue-next';

const router = useRouter();
const loading = ref(false);
const tableData = ref([]);

const searchForm = reactive({
  keyword: '',
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const columns = [
${tableColumns},
  { colKey: 'operation', title: '操作', width: 200, fixed: 'right' },
];

onMounted(() => {
  fetchData();
});

async function fetchData() {
  loading.value = true;
  try {
    // TODO: 调用API获取数据
    // const res = await api.getList(searchForm);
    // tableData.value = res.data.list;
    // pagination.total = res.data.total;
  } catch (error) {
    MessagePlugin.error('获取数据失败');
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.current = 1;
  fetchData();
}

function handleReset() {
  searchForm.keyword = '';
  handleSearch();
}

function handleCreate() {
  router.push('${routePath}/create');
}

function handleView(row: any) {
  router.push('${routePath}/\${row.id}');
}

function handleEdit(row: any) {
  router.push('${routePath}/\${row.id}/edit');
}

async function handleDelete(id: number) {
  try {
    // TODO: 调用API删除数据
    // await api.delete(id);
    MessagePlugin.success('删除成功');
    fetchData();
  } catch (error) {
    MessagePlugin.error('删除失败');
  }
}

function handlePageChange(pageInfo: any) {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  fetchData();
}
</script>

<style scoped>
.${simpleName.toLowerCase()}-list-page {
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
}

.header-left h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.content {
  padding: 24px;
  background: #f3f3f3;
}

.search-card {
  margin-bottom: 16px;
}
</style>
`;
  }

  /**
   * 生成 Vue 新增页面
   */
  static generateCreatePage(
    className: string,
    tableComment: string,
    columns: ColumnSchema[]
  ): string {
    const simpleName = className.replace('Create.vue', '');
    const formItems = columns
      .filter((col) => !col.columnName.toLowerCase().endsWith('id') && !col.isPrimaryKey)
      .map((col) => {
        const fieldName = toCamelCase(col.columnName);
        const label = col.columnComment || col.columnName;
        return `            <t-form-item label="${label}" name="${fieldName}">
              <t-input v-model="formData.${fieldName}" placeholder="请输入${label}" />
            </t-form-item>`;
      })
      .join('\n');

    return `<template>
  <div class="${simpleName.toLowerCase()}-create-page">
    <t-layout>
      <t-header class="header">
        <div class="header-left">
          <t-button variant="text" @click="handleBack">
            <template #icon><chevron-left-icon /></template>
            返回
          </t-button>
          <h2>新建${tableComment || simpleName}</h2>
        </div>
      </t-header>

      <t-content class="content">
        <t-card>
          <t-form
            ref="formRef"
            :data="formData"
            :rules="rules"
            label-width="120px"
            @submit="handleSubmit"
          >
${formItems}

            <t-form-item>
              <t-space>
                <t-button theme="primary" type="submit">提交</t-button>
                <t-button @click="handleBack">取消</t-button>
              </t-space>
            </t-form-item>
          </t-form>
        </t-card>
      </t-content>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { ChevronLeftIcon } from 'tdesign-icons-vue-next';

const router = useRouter();
const formRef = ref();

const formData = reactive({
${columns
  .filter((col) => !col.columnName.toLowerCase().endsWith('id') && !col.isPrimaryKey)
  .map((col) => `  ${toCamelCase(col.columnName)}: '',`)
  .join('\n')}
});

const rules = {
${columns
  .filter((col) => !col.isNullable && !col.isPrimaryKey)
  .map(
    (col) =>
      `  ${toCamelCase(col.columnName)}: [{ required: true, message: '请输入${col.columnComment || col.columnName}' }],`
  )
  .join('\n')}
};

async function handleSubmit() {
  try {
    const valid = await formRef.value.validate();
    if (valid) {
      // TODO: 调用API提交数据
      // await api.create(formData);
      MessagePlugin.success('创建成功');
      router.back();
    }
  } catch (error) {
    MessagePlugin.error('请填写完整信息');
  }
}

function handleBack() {
  router.back();
}
</script>

<style scoped>
.${simpleName.toLowerCase()}-create-page {
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  padding: 16px 24px;
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
  font-size: 20px;
  font-weight: 600;
}

.content {
  padding: 24px;
  background: #f3f3f3;
}
</style>
`;
  }

  /**
   * 生成 Vue 编辑页面
   */
  static generateEditPage(
    className: string,
    tableComment: string,
    columns: ColumnSchema[],
    routePath: string
  ): string {
    const simpleName = className.replace('Edit.vue', '');
    const formItems = columns
      .filter((col) => !col.columnName.toLowerCase().endsWith('id') && !col.isPrimaryKey)
      .map((col) => {
        const fieldName = toCamelCase(col.columnName);
        const label = col.columnComment || col.columnName;
        return `            <t-form-item label="${label}" name="${fieldName}">
              <t-input v-model="formData.${fieldName}" placeholder="请输入${label}" />
            </t-form-item>`;
      })
      .join('\n');

    return `<template>
  <div class="${simpleName.toLowerCase()}-edit-page">
    <t-layout>
      <t-header class="header">
        <div class="header-left">
          <t-button variant="text" @click="handleBack">
            <template #icon><chevron-left-icon /></template>
            返回
          </t-button>
          <h2>编辑${tableComment || simpleName}</h2>
        </div>
      </t-header>

      <t-content class="content">
        <t-card v-if="!loading">
          <t-form
            ref="formRef"
            :data="formData"
            :rules="rules"
            label-width="120px"
            @submit="handleSubmit"
          >
${formItems}

            <t-form-item>
              <t-space>
                <t-button theme="primary" type="submit">提交</t-button>
                <t-button @click="handleBack">取消</t-button>
              </t-space>
            </t-form-item>
          </t-form>
        </t-card>
        <t-loading v-else loading size="large">加载中...</t-loading>
      </t-content>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { ChevronLeftIcon } from 'tdesign-icons-vue-next';

const router = useRouter();
const route = useRoute();
const formRef = ref();
const loading = ref(false);

const formData = reactive({
${columns
  .filter((col) => !col.columnName.toLowerCase().endsWith('id') && !col.isPrimaryKey)
  .map((col) => `  ${toCamelCase(col.columnName)}: '',`)
  .join('\n')}
});

const rules = {
${columns
  .filter((col) => !col.isNullable && !col.isPrimaryKey)
  .map(
    (col) =>
      `  ${toCamelCase(col.columnName)}: [{ required: true, message: '请输入${col.columnComment || col.columnName}' }],`
  )
  .join('\n')}
};

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  loading.value = true;
  try {
    const id = route.params.id;
    // TODO: 调用API获取详情数据
    // const res = await api.getById(id);
    // Object.assign(formData, res.data);
  } catch (error) {
    MessagePlugin.error('获取数据失败');
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  try {
    const valid = await formRef.value.validate();
    if (valid) {
      const id = route.params.id;
      // TODO: 调用API更新数据
      // await api.update(id, formData);
      MessagePlugin.success('更新成功');
      router.push('${routePath}');
    }
  } catch (error) {
    MessagePlugin.error('请填写完整信息');
  }
}

function handleBack() {
  router.back();
}
</script>

<style scoped>
.${simpleName.toLowerCase()}-edit-page {
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  padding: 16px 24px;
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
  font-size: 20px;
  font-weight: 600;
}

.content {
  padding: 24px;
  background: #f3f3f3;
}
</style>
`;
  }

  /**
   * 生成 Vue 详情页面
   */
  static generateDetailPage(
    className: string,
    tableComment: string,
    columns: ColumnSchema[]
  ): string {
    const simpleName = className.replace('Detail.vue', '');
    const detailItems = columns
      .map((col) => {
        return `            <div class="detail-item">
              <span class="label">${col.columnComment || col.columnName}:</span>
              <span class="value">{{ data.${toCamelCase(col.columnName)} || '-' }}</span>
            </div>`;
      })
      .join('\n');

    return `<template>
  <div class="${simpleName.toLowerCase()}-detail-page">
    <t-layout>
      <t-header class="header">
        <div class="header-left">
          <t-button variant="text" @click="handleBack">
            <template #icon><chevron-left-icon /></template>
            返回
          </t-button>
          <h2>${tableComment || simpleName}详情</h2>
        </div>
        <div class="header-right">
          <t-space>
            <t-button @click="handleEdit">编辑</t-button>
            <t-popconfirm
              content="确定要删除这条数据吗？"
              @confirm="handleDelete"
            >
              <t-button theme="danger">删除</t-button>
            </t-popconfirm>
          </t-space>
        </div>
      </t-header>

      <t-content class="content">
        <t-card v-if="!loading">
          <t-descriptions :column="2" bordered>
${detailItems}
          </t-descriptions>
        </t-card>
        <t-loading v-else loading size="large">加载中...</t-loading>
      </t-content>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { ChevronLeftIcon } from 'tdesign-icons-vue-next';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const data = reactive({});

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  loading.value = true;
  try {
    const id = route.params.id;
    // TODO: 调用API获取详情数据
    // const res = await api.getById(id);
    // Object.assign(data, res.data);
  } catch (error) {
    MessagePlugin.error('获取数据失败');
  } finally {
    loading.value = false;
  }
}

function handleEdit() {
  router.push(\`\${route.path}/edit\`);
}

async function handleDelete() {
  try {
    const id = route.params.id;
    // TODO: 调用API删除数据
    // await api.delete(id);
    MessagePlugin.success('删除成功');
    router.back();
  } catch (error) {
    MessagePlugin.error('删除失败');
  }
}

function handleBack() {
  router.back();
}
</script>

<style scoped>
.${simpleName.toLowerCase()}-detail-page {
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
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
  font-size: 20px;
  font-weight: 600;
}

.content {
  padding: 24px;
  background: #f3f3f3;
}

.detail-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  width: 150px;
  font-weight: 500;
  color: #666;
}

.value {
  flex: 1;
  color: #333;
}
</style>
`;
  }
}
