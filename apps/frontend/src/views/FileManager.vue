<template>
  <div class="file-manager">
    <t-card title="文件管理" bordered>
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleCreateFile">
            <template #icon><add-icon /></template>
            新建文件
          </t-button>
          <t-button theme="default" @click="handleCreateFolder">
            <template #icon><folder-add-icon /></template>
            新建文件夹
          </t-button>
          <t-button theme="default" @click="handleImport">
            <template #icon><upload-icon /></template>
            导入项目
          </t-button>
          <t-button theme="default" @click="handleExport">
            <template #icon><download-icon /></template>
            导出项目
          </t-button>
        </t-space>
      </template>

      <t-form :data="searchForm" layout="inline" @submit="handleSearch">
        <t-form-item label="项目">
          <t-select v-model="searchForm.projectId" placeholder="选择项目" @change="handleProjectChange">
            <t-option v-for="project in projects" :key="project.id" :value="project.id" :label="project.name" />
          </t-select>
        </t-form-item>
        <t-form-item label="关键词">
          <t-input v-model="searchForm.keyword" placeholder="搜索文件" clearable />
        </t-form-item>
        <t-form-item>
          <t-button theme="primary" type="submit">
            <template #icon><search-icon /></template>
            搜索
          </t-button>
        </t-form-item>
      </t-form>

      <t-divider />

      <div class="file-explorer">
        <div class="file-toolbar">
          <t-breadcrumb>
            <t-breadcrumb-item
              v-for="(segment, index) in pathSegments"
              :key="index"
              @click="handleNavigateTo(index)"
            >
              {{ segment }}
            </t-breadcrumb-item>
          </t-breadcrumb>
        </div>

        <div class="file-list">
          <div
            v-for="item in currentItems"
            :key="item.id || item.name"
            class="file-item"
            :class="{ 'is-selected': selectedItem?.id === item.id }"
            @click="handleSelectItem(item)"
            @dblclick="handleItemDoubleClick(item)"
          >
            <div class="file-icon">
              <folder-icon v-if="item.type === 'folder'" size="32px" />
              <file-icon v-else size="32px" />
            </div>
            <div class="file-info">
              <div class="file-name">{{ item.name }}</div>
              <div class="file-meta">
                {{ item.type === 'folder' ? '文件夹' : getFileType(item.name) }}
                {{ item.size ? `· ${formatFileSize(item.size)}` : '' }}
              </div>
            </div>
            <div class="file-actions">
              <t-dropdown :options="getDropdownOptions(item)" @click="(e) => handleActionClick(e, item)">
                <t-button variant="text">
                  <template #icon><more-icon /></template>
                </t-button>
              </t-dropdown>
            </div>
          </div>
        </div>
      </div>

      <t-empty v-if="currentItems.length === 0" description="暂无文件" />
    </t-card>

    <!-- 文件创建对话框 -->
    <t-dialog
      v-model:visible="createFileDialogVisible"
      :header="createFileDialogType === 'file' ? '新建文件' : '新建文件夹'"
      :confirm-btn="null"
      :cancel-btn="null"
      @close="resetCreateForm"
    >
      <t-form :data="createFileForm" label-width="80px">
        <t-form-item label="名称">
          <t-input
            v-model="createFileForm.name"
            :placeholder="createFileDialogType === 'file' ? '例如: user.ts' : '例如: controllers'"
          />
        </t-form-item>
        <t-form-item v-if="createFileDialogType === 'file'" label="内容">
          <t-textarea
            v-model="createFileForm.content"
            :autosize="{ minRows: 5, maxRows: 15 }"
            placeholder="文件内容"
          />
        </t-form-item>
      </t-form>
      <template #footer>
        <t-space>
          <t-button theme="primary" @click="handleConfirmCreate">确定</t-button>
          <t-button theme="default" @click="createFileDialogVisible = false">取消</t-button>
        </t-space>
      </template>
    </t-dialog>

    <!-- 文件移动对话框 -->
    <t-dialog
      v-model:visible="moveDialogVisible"
      header="移动文件"
      :confirm-btn="null"
      :cancel-btn="null"
    >
      <t-form :data="moveForm" label-width="80px">
        <t-form-item label="目标路径">
          <t-input v-model="moveForm.newPath" placeholder="例如: /utils" />
        </t-form-item>
      </t-form>
      <template #footer>
        <t-space>
          <t-button theme="primary" @click="handleConfirmMove">确定</t-button>
          <t-button theme="default" @click="moveDialogVisible = false">取消</t-button>
        </t-space>
      </template>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next';
import {
  AddIcon,
  FolderAddIcon,
  UploadIcon,
  DownloadIcon,
  SearchIcon,
  FolderIcon,
  FileIcon,
  MoreIcon,
} from 'tdesign-icons-vue-next';

interface FileItem {
  id?: string;
  name: string;
  type: 'file' | 'folder';
  path?: string;
  size?: number;
  children?: FileItem[];
}

interface Project {
  id: string;
  name: string;
}

const projects = ref<Project[]>([]);
const fileTree = ref<FileItem>({ name: 'root', type: 'folder', children: [] });
const searchForm = ref({
  projectId: '',
  keyword: '',
});
const createFileDialogVisible = ref(false);
const createFileDialogType = ref<'file' | 'folder'>('file');
const createFileForm = ref({
  name: '',
  content: '',
});
const moveDialogVisible = ref(false);
const moveForm = ref({
  fileId: '',
  newPath: '',
});
const selectedItem = ref<FileItem | null>(null);
const currentPath = ref<string[]>([]);

const pathSegments = computed(() => ['根目录', ...currentPath.value]);

const currentItems = computed(() => {
  let items = fileTree.value.children || [];

  // 根据当前路径筛选
  for (const segment of currentPath.value) {
    const found = items.find((item) => item.name === segment);
    if (found && found.type === 'folder') {
      items = found.children || [];
    } else {
      items = [];
      break;
    }
  }

  return items;
});

onMounted(() => {
  loadProjects();
});

async function loadProjects() {
  try {
    const response = await fetch('http://localhost:3000/api/projects');
    const result = await response.json();
    if (result.code === 0) {
      projects.value = result.data.list || [];
    }
  } catch (error) {
    console.error('Failed to load projects:', error);
  }
}

async function loadFileTree(projectId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/files/tree/${projectId}`);
    const result = await response.json();
    if (result.code === 0) {
      fileTree.value = result.data;
      currentPath.value = [];
    }
  } catch (error) {
    console.error('Failed to load file tree:', error);
    MessagePlugin.error('加载文件树失败');
  }
}

function handleProjectChange(projectId: string) {
  if (projectId) {
    loadFileTree(projectId);
  }
}

function handleSearch() {
  if (!searchForm.value.projectId) {
    MessagePlugin.warning('请先选择项目');
    return;
  }

  // TODO: 实现搜索功能
  MessagePlugin.info('搜索功能开发中');
}

function handleNavigateTo(index: number) {
  currentPath.value = currentPath.value.slice(0, index);
}

function handleSelectItem(item: FileItem) {
  selectedItem.value = item;
}

function handleItemDoubleClick(item: FileItem) {
  if (item.type === 'folder') {
    currentPath.value.push(item.name);
  } else {
    MessagePlugin.info('打开文件功能开发中');
  }
}

function handleCreateFile() {
  if (!searchForm.value.projectId) {
    MessagePlugin.warning('请先选择项目');
    return;
  }
  createFileDialogType.value = 'file';
  createFileDialogVisible.value = true;
}

function handleCreateFolder() {
  if (!searchForm.value.projectId) {
    MessagePlugin.warning('请先选择项目');
    return;
  }
  createFileDialogType.value = 'folder';
  createFileDialogVisible.value = true;
}

async function handleConfirmCreate() {
  const { name, content } = createFileForm.value;

  if (!name) {
    MessagePlugin.error('名称不能为空');
    return;
  }

  try {
    const path = currentPath.value.length > 0
      ? currentPath.value.join('/') + '/' + name
      : name;

    const response = await fetch('http://localhost:3000/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: searchForm.value.projectId,
        path,
        name,
        type: createFileDialogType.value === 'folder' ? 'folder' : 'file',
        size: content.length,
        content: createFileDialogType.value === 'file' ? content : undefined,
      }),
    });

    const result = await response.json();

    if (result.code === 0) {
      MessagePlugin.success('创建成功');
      createFileDialogVisible.value = false;
      resetCreateForm();
      loadFileTree(searchForm.value.projectId);
    } else {
      MessagePlugin.error(result.message || '创建失败');
    }
  } catch (error) {
    MessagePlugin.error('创建失败');
    console.error(error);
  }
}

function resetCreateForm() {
  createFileForm.value = { name: '', content: '' };
}

function getDropdownOptions(item: FileItem) {
  return [
    { content: '重命名', value: 'rename' },
    { content: '移动', value: 'move' },
    { content: '删除', value: 'delete', theme: 'danger' },
  ];
}

function handleActionClick(event: any, item: FileItem) {
  const { value } = event;

  switch (value) {
    case 'rename':
      MessagePlugin.info('重命名功能开发中');
      break;
    case 'move':
      handleMove(item);
      break;
    case 'delete':
      handleDelete(item);
      break;
  }
}

function handleMove(item: FileItem) {
  if (!item.id) {
    MessagePlugin.error('无法移动文件夹');
    return;
  }
  moveForm.value = {
    fileId: item.id,
    newPath: '',
  };
  moveDialogVisible.value = true;
}

async function handleConfirmMove() {
  const { fileId, newPath } = moveForm.value;

  if (!newPath) {
    MessagePlugin.error('目标路径不能为空');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/files/${fileId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPath }),
    });

    const result = await response.json();

    if (result.code === 0) {
      MessagePlugin.success('移动成功');
      moveDialogVisible.value = false;
      loadFileTree(searchForm.value.projectId);
    } else {
      MessagePlugin.error(result.message || '移动失败');
    }
  } catch (error) {
    MessagePlugin.error('移动失败');
    console.error(error);
  }
}

function handleDelete(item: FileItem) {
  if (!item.id) {
    MessagePlugin.error('无法删除文件夹');
    return;
  }

  const dialog = DialogPlugin({
    header: '确认删除',
    body: `确定要删除 "${item.name}" 吗?`,
    theme: 'warning',
    onConfirm: async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/files/${item.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          MessagePlugin.success('删除成功');
          loadFileTree(searchForm.value.projectId);
        } else {
          MessagePlugin.error('删除失败');
        }
      } catch (error) {
        MessagePlugin.error('删除失败');
        console.error(error);
      }
      dialog.hide();
    },
  });
}

function handleImport() {
  MessagePlugin.info('导入功能开发中');
}

async function handleExport() {
  if (!searchForm.value.projectId) {
    MessagePlugin.warning('请先选择项目');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/files/export/${searchForm.value.projectId}`);

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${searchForm.value.projectId}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      MessagePlugin.success('导出成功');
    } else {
      MessagePlugin.error('导出失败');
    }
  } catch (error) {
    MessagePlugin.error('导出失败');
    console.error(error);
  }
}

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    ts: 'TypeScript',
    js: 'JavaScript',
    vue: 'Vue',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    md: 'Markdown',
    txt: '文本',
  };
  return types[ext || ''] || '文件';
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script>

<style scoped>
.file-manager {
  padding: 24px;
}

.file-explorer {
  margin-top: 24px;
}

.file-toolbar {
  padding: 12px 0;
  border-bottom: 1px solid #e7e7e7;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.file-item:hover {
  background: #f3f3f3;
}

.file-item.is-selected {
  background: #e7f1ff;
}

.file-icon {
  flex-shrink: 0;
  margin-right: 12px;
  color: #0052d9;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.file-actions {
  flex-shrink: 0;
  margin-left: 8px;
}
</style>
