<template>
  <div class="entity-designer">
    <t-card title="数据模型设计器" bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleSaveEntity">
            <template #icon><save-icon /></template>
            保存实体
          </t-button>
          <t-button @click="handleGenerateScript">
            <template #icon><code-icon /></template>
            生成SQL脚本
          </t-button>
          <t-button variant="outline" @click="handleClear">
            清空
          </t-button>
        </t-space>
      </template>

        <t-form ref="formRef" :data="entityForm" label-width="100px">
        <t-form-item label="实体名称" name="name">
          <t-input
            v-model="entityForm.name"
            placeholder="例如: User, Product, Order"
            :status="nameValidation?.status"
            :tips="nameValidation?.message"
          />
        </t-form-item>

        <t-form-item label="显示名称" name="displayName">
          <t-input
            v-model="entityForm.displayName"
            placeholder="例如: 用户, 商品, 订单"
          />
        </t-form-item>

        <t-form-item label="表名" name="tableName">
          <t-input
            v-model="entityForm.tableName"
            placeholder="例如: users, products, orders"
          />
        </t-form-item>

        <t-form-item label="包名" name="package">
          <t-input
            v-model="entityForm.package"
            placeholder="例如: com.example.entity"
          />
        </t-form-item>

        <t-form-item label="说明" name="description">
          <t-textarea
            v-model="entityForm.description"
            placeholder="实体描述说明"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </t-form-item>

        <t-divider>字段配置</t-divider>

        <field-config v-model="entityForm.fields" />

        <t-divider>关系配置</t-divider>

        <div class="relation-config">
          <t-button theme="default" size="small" @click="handleAddRelation">
            <template #icon><add-icon /></template>
            添加关系
          </t-button>

          <div v-if="entityForm.relationships && entityForm.relationships.length > 0" class="relation-list">
            <div
              v-for="(relation, index) in entityForm.relationships"
              :key="index"
              class="relation-item"
            >
              <div class="relation-header">
                <t-tag theme="primary">{{ relation.type }}</t-tag>
                <t-button
                  size="small"
                  variant="text"
                  theme="danger"
                  @click="handleRemoveRelation(index)"
                >
                  <template #icon><delete-icon /></template>
                </t-button>
              </div>

              <t-form :data="relation" label-width="80px">
                <t-form-item label="关系名称">
                  <t-input
                    v-model="relation.name"
                    placeholder="例如: roles"
                  />
                </t-form-item>

                <t-form-item label="目标实体">
                  <t-input
                    v-model="relation.targetEntity"
                    placeholder="例如: Role"
                  />
                </t-form-item>

                <t-form-item label="外键字段">
                  <t-input
                    v-model="relation.foreignKey"
                    placeholder="例如: roleId"
                  />
                </t-form-item>

                <t-form-item label="反向字段">
                  <t-input
                    v-model="relation.inverseSide"
                    placeholder="例如: users"
                  />
                </t-form-item>

                <t-form-item label="备注">
                  <t-input
                    v-model="relation.comment"
                    placeholder="关系说明"
                  />
                </t-form-item>
              </t-form>
            </div>
          </div>

          <t-empty v-else description="暂无关系配置" />
        </div>

        <t-divider>索引配置</t-divider>

        <div class="index-config">
          <t-button theme="default" size="small" @click="handleAddIndex">
            <template #icon><add-icon /></template>
            添加索引
          </t-button>

          <div v-if="entityForm.indexes && entityForm.indexes.length > 0" class="index-list">
            <div
              v-for="(index, indexIdx) in entityForm.indexes"
              :key="indexIdx"
              class="index-item"
            >
              <div class="index-header">
                <span>{{ index.name || `索引${indexIdx + 1}` }}</span>
                <t-button
                  size="small"
                  variant="text"
                  theme="danger"
                  @click="handleRemoveIndex(indexIdx)"
                >
                  <template #icon><delete-icon /></template>
                </t-button>
              </div>

              <t-form :data="index" label-width="80px">
                <t-form-item label="索引名称">
                  <t-input v-model="index.name" placeholder="例如: idx_username" />
                </t-form-item>

                <t-form-item label="索引字段">
                  <t-select
                    v-model="index.columns"
                    multiple
                    placeholder="选择字段"
                  >
                    <t-option
                      v-for="field in entityForm.fields"
                      :key="field.name"
                      :value="field.name"
                      :label="field.displayName || field.name"
                    />
                  </t-select>
                </t-form-item>

                <t-form-item>
                  <t-checkbox v-model="index.unique">
                    唯一索引
                  </t-checkbox>
                </t-form-item>

                <t-form-item label="备注">
                  <t-input
                    v-model="index.comment"
                    placeholder="索引说明"
                  />
                </t-form-item>
              </t-form>
            </div>
          </div>

          <t-empty v-else description="暂无索引配置" />
        </div>
      </t-form>
    </t-card>

    <!-- SQL脚本生成对话框 -->
    <t-dialog
      v-model:visible="scriptDialogVisible"
      header="生成SQL脚本"
      width="800px"
      :confirm-btn="null"
      :cancel-btn="null"
    >
      <t-form label-width="80px">
        <t-form-item label="数据库类型">
          <t-select v-model="scriptDbType">
            <t-option value="mysql" label="MySQL" />
            <t-option value="postgresql" label="PostgreSQL" />
            <t-option value="sqlite" label="SQLite" />
          </t-select>
        </t-form-item>
      </t-form>

      <t-card bordered>
        <t-textarea
          :value="generatedScript"
          readonly
          :autosize="{ minRows: 10, maxRows: 20 }"
        />
      </t-card>

      <template #footer>
        <t-space>
          <t-button theme="primary" @click="handleCopyScript">
            复制
          </t-button>
          <t-button theme="default" @click="handleDownloadScript">
            下载
          </t-button>
          <t-button theme="default" @click="scriptDialogVisible = false">
            关闭
          </t-button>
        </t-space>
      </template>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { AddIcon, DeleteIcon, SaveIcon, CodeIcon } from 'tdesign-icons-vue-next';
import FieldConfig from '@/components/FieldConfig.vue';

interface Field {
  name: string;
  displayName: string;
  type: string;
  length?: number;
  isRequired: boolean;
  isUnique?: boolean;
  defaultValue?: any;
  comment?: string;
}

interface Relationship {
  name: string;
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany';
  targetEntity: string;
  foreignKey?: string;
  inverseSide?: string;
  comment?: string;
}

interface Index {
  name: string;
  columns: string[];
  unique?: boolean;
  comment?: string;
}

interface EntityForm {
  name: string;
  displayName: string;
  tableName: string;
  package: string;
  description: string;
  fields: Field[];
  relationships?: Relationship[];
  indexes?: Index[];
}

const entityForm = ref<EntityForm>({
  name: '',
  displayName: '',
  tableName: '',
  package: 'com.example.entity',
  description: '',
  fields: [],
  relationships: [],
  indexes: [],
});

const scriptDialogVisible = ref(false);
const scriptDbType = ref('mysql');
const generatedScript = ref('');

const nameValidation = computed(() => {
  if (!entityForm.value.name) {
    return { status: 'error', message: '实体名称不能为空' };
  }
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(entityForm.value.name)) {
    return { status: 'error', message: '实体名称必须以大写字母开头,仅包含字母和数字' };
  }
  return { status: 'success' };
});

function handleAddRelation() {
  if (!entityForm.value.relationships) {
    entityForm.value.relationships = [];
  }
  entityForm.value.relationships.push({
    name: '',
    type: 'oneToMany',
    targetEntity: '',
    foreignKey: '',
    inverseSide: '',
    comment: '',
  });
}

function handleRemoveRelation(index: number) {
  entityForm.value.relationships?.splice(index, 1);
}

function handleAddIndex() {
  if (!entityForm.value.indexes) {
    entityForm.value.indexes = [];
  }
  entityForm.value.indexes.push({
    name: '',
    columns: [],
    unique: false,
    comment: '',
  });
}

function handleRemoveIndex(index: number) {
  entityForm.value.indexes?.splice(index, 1);
}

async function handleSaveEntity() {
  if (nameValidation.value.status === 'error') {
    MessagePlugin.error(nameValidation.value.message);
    return;
  }

  if (!entityForm.value.displayName) {
    MessagePlugin.error('显示名称不能为空');
    return;
  }

  if (!entityForm.value.package) {
    MessagePlugin.error('包名不能为空');
    return;
  }

  if (!entityForm.value.tableName) {
    entityForm.value.tableName = entityForm.value.name.toLowerCase() + 's';
  }

  try {
    const response = await fetch('http://localhost:3000/api/entities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entityForm.value),
    });

    const result = await response.json();

    if (result.code === 0) {
      MessagePlugin.success('实体保存成功');
    } else {
      MessagePlugin.error(result.message || '保存失败');
    }
  } catch (error) {
    MessagePlugin.error('网络错误,请稍后重试');
    console.error(error);
  }
}

async function handleGenerateScript() {
  if (!entityForm.value.name || entityForm.value.fields.length === 0) {
    MessagePlugin.warning('请先填写实体名称和字段信息');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/entities/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entities: [entityForm.value],
        databaseType: scriptDbType.value,
      }),
    });

    const result = await response.json();

    if (result.code === 0) {
      generatedScript.value = result.data;
      scriptDialogVisible.value = true;
    } else {
      MessagePlugin.error(result.message || '生成失败');
    }
  } catch (error) {
    MessagePlugin.error('网络错误,请稍后重试');
    console.error(error);
  }
}

function handleCopyScript() {
  navigator.clipboard.writeText(generatedScript.value);
  MessagePlugin.success('已复制到剪贴板');
}

function handleDownloadScript() {
  const blob = new Blob([generatedScript.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${entityForm.value.tableName}.sql`;
  a.click();
  URL.revokeObjectURL(url);
  MessagePlugin.success('下载成功');
}

function handleClear() {
  entityForm.value = {
    name: '',
    displayName: '',
    tableName: '',
    package: 'com.example.entity',
    description: '',
    fields: [],
    relationships: [],
    indexes: [],
  };
  MessagePlugin.success('已清空');
}
</script>

<style scoped>
.entity-designer {
  padding: 24px;
}

.relation-config,
.index-config {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.relation-list,
.index-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.relation-item,
.index-item {
  background: #fff;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e7e7e7;
}

.relation-header,
.index-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 600;
}
</style>
