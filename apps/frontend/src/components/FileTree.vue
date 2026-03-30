<template>
  <div class="file-tree">
    <div class="tree-header">
      <h3>文件树</h3>
      <t-button size="small" variant="text" @click="handleRefresh">
        <template #icon><refresh-icon /></template>
        刷新
      </t-button>
    </div>
    <t-tree
      :data="treeData"
      :active-multiple="false"
      :expand-level="2"
      hover
      activable
      @active="handleNodeClick"
      @expand="handleNodeExpand"
    >
      <template #node="{ node }">
        <div class="tree-node">
          <component :is="getFileIcon(node)" class="node-icon" />
          <span class="node-label">{{ node.label }}</span>
        </div>
      </template>
    </t-tree>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import {
  FolderIcon,
  FolderOpenedIcon,
  FileIcon,
  JavaIcon,
  XmlIcon,
  YamlIcon,
  PropertiesIcon,
  RefreshIcon,
} from 'tdesign-icons-vue-next';

export interface FileNode {
  id: string;
  label: string;
  value: string;
  path: string;
  type: 'file' | 'folder';
  language?: string;
  children?: FileNode[];
}

interface Props {
  data?: FileNode[];
}

interface Emits {
  (e: 'select', node: FileNode): void;
  (e: 'expand', node: FileNode): void;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => []
});

const emit = defineEmits<Emits>();

const treeData = computed(() => {
  return transformToTreeData(props.data);
});

function transformToTreeData(nodes: FileNode[]) {
  return nodes.map(node => ({
    ...node,
    children: node.children ? transformToTreeData(node.children) : undefined
  }));
}

function getFileIcon(node: any) {
  if (node.type === 'folder') {
    return node.expanded ? FolderOpenedIcon : FolderIcon;
  }

  const ext = node.label.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'java':
      return JavaIcon;
    case 'xml':
      return XmlIcon;
    case 'yml':
    case 'yaml':
      return YamlIcon;
    case 'properties':
      return PropertiesIcon;
    default:
      return FileIcon;
  }
}

function handleNodeClick(value: string, context: any) {
  const node = findNode(props.data, value);
  if (node && node.type === 'file') {
    emit('select', node);
  }
}

function handleNodeExpand(value: string, context: any) {
  const node = findNode(props.data, value);
  if (node) {
    emit('expand', node);
  }
}

function findNode(nodes: FileNode[], value: string): FileNode | null {
  for (const node of nodes) {
    if (node.value === value) {
      return node;
    }
    if (node.children) {
      const found = findNode(node.children, value);
      if (found) return found;
    }
  }
  return null;
}

function handleRefresh() {
  // 刷新文件树
  console.log('Refresh file tree');
}

defineExpose({
  refresh: handleRefresh
});
</script>

<style scoped>
.file-tree {
  height: 100%;
  background: #fff;
  border-right: 1px solid #e7e7e7;
  display: flex;
  flex-direction: column;
}

.tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f8f8;
  border-bottom: 1px solid #e7e7e7;
}

.tree-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-icon {
  flex-shrink: 0;
  color: #666;
}

.node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
