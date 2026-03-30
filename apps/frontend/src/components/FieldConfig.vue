<template>
  <div class="field-config">
    <div class="field-header">
      <h3>字段配置</h3>
      <t-button size="small" @click="handleAddField">
        <template #icon><add-icon /></template>
        添加字段
      </t-button>
    </div>

    <div class="field-list">
      <div
        v-for="(field, index) in fields"
        :key="index"
        class="field-item"
      >
        <div class="field-item-header">
          <span class="field-number">#{{ index + 1 }}</span>
          <t-button
            size="small"
            variant="text"
            theme="danger"
            @click="handleRemoveField(index)"
          >
            <template #icon><delete-icon /></template>
          </t-button>
        </div>

        <t-form :data="field" label-width="100px">
          <t-form-item label="字段名称">
            <t-input
              v-model="field.name"
              placeholder="例如: username"
            />
          </t-form-item>

          <t-form-item label="显示名称">
            <t-input
              v-model="field.displayName"
              placeholder="例如: 用户名"
            />
          </t-form-item>

          <t-form-item label="字段类型">
            <t-select v-model="field.type" placeholder="选择类型">
              <t-option value="string" label="字符串" />
              <t-option value="integer" label="整数" />
              <t-option value="long" label="长整数" />
              <t-option value="double" label="浮点数" />
              <t-option value="boolean" label="布尔值" />
              <t-option value="date" label="日期" />
              <t-option value="datetime" label="日期时间" />
              <t-option value="text" label="文本" />
              <t-option value="json" label="JSON" />
            </t-select>
          </t-form-item>

          <t-form-item v-if="field.type === 'string'" label="字段长度">
            <t-input-number
              v-model="field.length"
              :min="1"
              :max="255"
              placeholder="255"
            />
          </t-form-item>

          <t-form-item label="默认值">
            <t-input
              v-model="field.defaultValue"
              placeholder="默认值"
            />
          </t-form-item>

          <t-form-item label="备注">
            <t-input
              v-model="field.comment"
              placeholder="字段说明"
            />
          </t-form-item>

          <t-form-item>
            <t-space>
              <t-checkbox v-model="field.isRequired">
                必填
              </t-checkbox>
              <t-checkbox v-model="field.isUnique">
                唯一
              </t-checkbox>
            </t-space>
          </t-form-item>
        </t-form>
      </div>
    </div>

    <t-empty v-if="fields.length === 0" description="暂无字段，点击上方按钮添加" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AddIcon, DeleteIcon } from 'tdesign-icons-vue-next';

export interface Field {
  name: string;
  displayName: string;
  type: string;
  length?: number;
  isRequired: boolean;
  isUnique?: boolean;
  defaultValue?: any;
  comment?: string;
}

interface Props {
  modelValue: Field[];
}

interface Emits {
  (e: 'update:modelValue', value: Field[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const fields = ref<Field[]>(props.modelValue || []);

function handleAddField() {
  fields.value.push({
    name: '',
    displayName: '',
    type: 'string',
    length: 255,
    isRequired: false,
    isUnique: false,
  });
  emitValue();
}

function handleRemoveField(index: number) {
  fields.value.splice(index, 1);
  emitValue();
}

function emitValue() {
  emit('update:modelValue', fields.value);
}

defineExpose({
  fields,
  addField: handleAddField,
  removeField: handleRemoveField,
});
</script>

<style scoped>
.field-config {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.field-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.field-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-item {
  background: #fff;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e7e7e7;
}

.field-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.field-number {
  font-weight: 600;
  color: #0052d9;
}
</style>
