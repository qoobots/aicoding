<template>
  <div class="database-page">
    <t-layout>
      <!-- 顶部操作栏 -->
      <t-header class="header">
        <t-space size="medium">
          <t-button theme="primary" @click="handleAddConnection">
            <template #icon><add-icon /></template>
            新增数据库连接
          </t-button>
          <t-button
            variant="outline"
            @click="handleEditCurrentConnection"
            :disabled="!selectedConnectionObj"
          >
            <template #icon><edit-icon /></template>
            编辑连接
          </t-button>
          <t-button
            variant="outline"
            @click="handleTestCurrentConnection"
            :disabled="!selectedConnectionObj"
          >
            <template #icon><check-circle-icon /></template>
            测试连接
          </t-button>
          <t-popconfirm
            content="确定要删除此数据库连接吗？"
            @confirm="handleDeleteCurrentConnection"
            :disabled="!selectedConnectionObj"
          >
            <t-button variant="outline" theme="danger" :disabled="!selectedConnectionObj">
              <template #icon><delete-icon /></template>
              删除连接
            </t-button>
          </t-popconfirm>
          <t-button variant="outline" @click="handleBatchGenerate" :disabled="!selectedTable">
            <template #icon><code-icon /></template>
            全表一键生成
          </t-button>
        </t-space>
      </t-header>

      <t-layout has-sider>
        <!-- 左侧数据库列表 -->
        <t-aside class="aside" width="300px">
          <t-card title="数据库列表" :bordered="false">
            <div v-if="connections.length === 0" class="empty-tip">
              <t-empty description="暂无数据库连接" size="small" />
            </div>
            <div v-else>
              <div
                v-for="conn in connections"
                :key="conn.id"
                class="connection-group"
              >
                <div
                  class="connection-item"
                  :class="{ active: selectedConnection === conn.id }"
                  @click="toggleConnection(conn.id || '')"
                >
                  <span class="connection-name">{{ conn.name }}</span>
                  <span class="connection-toggle">
                    {{ selectedConnection === conn.id ? '▼' : '▶' }}
                  </span>
                </div>

                <!-- 表列表 -->
                <div
                  v-if="connTables[conn.id!]"
                  v-show="selectedConnection === conn.id"
                  class="tables-section"
                >
                  <div class="table-list">
                    <div
                      v-for="table in connTables[conn.id!]"
                      :key="table.tableName"
                      class="table-item"
                      :class="{ active: selectedTable?.tableName === table.tableName }"
                      @click.stop="selectTable(conn.id || '', table)"
                    >
                      <table-icon size="16" />
                      <span class="table-name">{{ table.tableName }}</span>
                    </div>
                    <t-empty v-if="connTables[conn.id!]?.length === 0" description="暂无表" size="small" />
                  </div>
                </div>
              </div>
            </div>
          </t-card>
        </t-aside>

        <!-- 右侧代码生成配置 -->
        <t-content class="content">
          <div class="content-wrapper">
            <t-card v-if="selectedTable" title="代码生成配置" :bordered="false">
            <div class="config-form">
              <!-- 项目基本信息 -->
              <div class="config-row config-row-three">
                <div class="config-item">
                  <span class="config-label config-label-short">保存地址：</span>

                  <t-input v-model="generateConfig.projectPath" placeholder="请输入保存地址" class="config-input" />
                </div>
                <div class="config-item">
                  <span class="config-label config-label-short">数据库表名：</span>
                  <t-input v-model="generateConfig.tableName" readonly class="config-input" />
                </div>
                <div class="config-item">
                  <span class="config-label config-label-short">统一包名：</span>
                  <t-input v-model="tempPackageName" placeholder="请输入包名" class="config-input" />
                  <t-button size="small" @click="applyPackageName">确认</t-button>
                </div>
              </div>

              <t-divider />

              <!-- Java 类配置 -->
              <div class="config-section">
                <h4>Java 后端类配置</h4>

                <div class="config-row">
                  <span class="config-label">实体类：</span>
                  <t-input :value="generateConfig.entityConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.entityConfig.basePackage" readonly class="config-input config-input-medium" />
                  <t-input v-model="generateConfig.entityConfig.className" class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateEntity" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('entity')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">Mapper：</span>
                  <t-input :value="generateConfig.mapperConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.mapperConfig.basePackage" readonly class="config-input config-input-medium" />
                  <t-input v-model="generateConfig.mapperConfig.className" class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateMapper" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('mapper')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">Mapper映射文件：</span>
                  <t-input value="/src/main/resources" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.mapperConfig.basePackage" readonly class="config-input config-input-medium" />
                  <t-input :value="generateConfig.mapperConfig.className + '.xml'" readonly class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateMapperXml" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('mapperXml')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">Service：</span>
                  <t-input :value="generateConfig.serviceConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.serviceConfig.basePackage" readonly class="config-input config-input-medium" />
                  <t-input v-model="generateConfig.serviceConfig.className" class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateService" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('service')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">ServiceImpl：</span>
                  <t-input :value="generateConfig.serviceConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.serviceConfig.basePackage + '.impl'" readonly class="config-input config-input-medium" />
                  <t-input :value="serviceImplClassName" readonly class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateServiceImpl" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('serviceImpl')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">Controller：</span>
                  <t-input :value="generateConfig.controllerConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.controllerConfig.basePackage" readonly class="config-input config-input-medium" />
                  <t-input v-model="generateConfig.controllerConfig.className" class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateController" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('controller')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">DTO：</span>
                  <t-input :value="generateConfig.dtoConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.dtoConfig.basePackage" readonly class="config-input config-input-medium" />
                  <t-input v-model="generateConfig.dtoConfig.className" class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateDto" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('dto')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">RequestDTO：</span>
                  <t-input :value="generateConfig.dtoConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.dtoConfig.basePackage + '.request'" readonly class="config-input config-input-medium" />
                  <t-input :value="requestDtoClassName" readonly class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateRequestDto" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('requestDto')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">VO：</span>
                  <t-input :value="generateConfig.voConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.voConfig.basePackage" readonly class="config-input config-input-medium" />
                  <t-input v-model="generateConfig.voConfig.className" class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateVo" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('vo')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">common：</span>
                  <t-input :value="generateConfig.commonConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.commonConfig.basePackage" readonly class="config-input config-input-medium" />
                  <t-input :value="generateConfig.commonConfig.classNames.join('、')" readonly class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateCommon" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('common')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">单元测试类名：</span>
                  <t-input :value="generateConfig.testConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.testConfig.basePackage" readonly class="config-input config-input-medium" />
                  <t-input :value="generateConfig.testConfig.className" readonly class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateTest" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('test')">模板</t-button>
                </div>
              </div>

              <t-divider />

              <!-- Vue 页面配置 -->
              <div class="config-section">
                <h4>Vue 前端页面配置</h4>

                <div class="config-row">
                  <span class="config-label">Vue实体类：</span>
                  <t-input :value="generateConfig.vueConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.vueConfig.routePath" readonly class="config-input config-input-medium" />
                  <t-input :value="vueConfigFileNames[0]" readonly class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateVueEntity" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('vueEntity')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">Vue新增：</span>
                  <t-input :value="generateConfig.vueConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.vueConfig.routePath" readonly class="config-input config-input-medium" />
                  <t-input :value="vueConfigFileNames[1]" readonly class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateVueCreate" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('vueCreate')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">Vue编辑：</span>
                  <t-input :value="generateConfig.vueConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.vueConfig.routePath" readonly class="config-input config-input-medium" />
                  <t-input :value="vueConfigFileNames[2]" readonly class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateVueEdit" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('vueEdit')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">Vue详情：</span>
                  <t-input :value="generateConfig.vueConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.vueConfig.routePath" readonly class="config-input config-input-medium" />
                  <t-input :value="vueConfigFileNames[3]" readonly class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateVueDetail" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('vueDetail')">模板</t-button>
                </div>

                <div class="config-row">
                  <span class="config-label">Vue列表：</span>
                  <t-input :value="generateConfig.vueConfig.basePath" readonly class="config-input config-input-small" />
                  <t-input :value="generateConfig.vueConfig.routePath" readonly class="config-input config-input-medium" />
                  <t-input :value="vueConfigFileNames[4]" readonly class="config-input config-input-medium" />
                  <t-checkbox v-model="generateChecks.generateVueList" />
                  <t-button size="small" variant="outline" @click="openTemplateEditor('vueList')">模板</t-button>
                </div>
              </div>

              <t-divider />

              <!-- 操作按钮 -->
              <div class="config-actions">
                <t-button theme="primary" size="large" @click="handleStartGenerate">
                  <template #icon><play-circle-icon /></template>
                  开始创建
                </t-button>
                <t-button variant="outline" @click="resetConfig">重置</t-button>
              </div>
            </div>
          </t-card>
          <t-empty v-else description="请从左侧选择一个数据库表" />
          </div>
        </t-content>
      </t-layout>
    </t-layout>

    <!-- 新增/编辑数据库连接对话框 -->
    <t-dialog
      v-model:visible="connectionDialogVisible"
      :header="connectionDialogMode === 'create' ? '新增数据库连接' : '编辑数据库连接'"
      width="600px"
      @confirm="handleSaveConnection"
    >
      <t-form
        ref="connectionFormRef"
        :data="connectionForm"
        :rules="connectionFormRules"
        label-width="100px"
      >
        <t-form-item label="连接名称" name="name">
          <t-input v-model="connectionForm.name" placeholder="请输入连接名称" />
        </t-form-item>
        <t-form-item label="主机" name="host">
          <t-input v-model="connectionForm.host" placeholder="localhost" />
        </t-form-item>
        <t-form-item label="端口" name="port">
          <t-input-number v-model="connectionForm.port" :min="1" :max="65535" placeholder="3306" />
        </t-form-item>
        <t-form-item label="用户名" name="username">
          <t-input v-model="connectionForm.username" placeholder="root" />
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input v-model="connectionForm.password" type="password" placeholder="请输入密码" />
        </t-form-item>
        <t-form-item label="数据库" name="database">
          <t-input v-model="connectionForm.database" placeholder="请输入数据库名" />
        </t-form-item>
        <t-form-item label="数据库类型" name="type">
          <t-select v-model="connectionForm.type" placeholder="请选择数据库类型" @change="handleDatabaseTypeChange">
            <t-option
              v-for="option in databaseTypeOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import type { FormRule } from 'tdesign-vue-next';
import { databaseService } from '@/services/database.service';
import type {
  DatabaseConnection,
  CodeGenerateConfig,
  VueFileConfig,
} from '@shared/types';
import { DatabaseType, DatabaseTypeUtils } from '@shared/types';
import {
  AddIcon,
  CodeIcon,
  TableIcon,
  PlayCircleIcon,
  EditIcon,
  CheckCircleIcon,
  DeleteIcon,
} from 'tdesign-icons-vue-next';

const router = useRouter();



// 数据
const connections = ref<DatabaseConnection[]>([]);
const connTables = ref<Record<string, any[]>>({});
const selectedConnection = ref<string | null>(null);
const selectedConnectionObj = ref<DatabaseConnection | null>(null);
const selectedTable = ref<any>(null);
const connectionFormRef = ref();

// 对话框
const connectionDialogVisible = ref(false);
const connectionDialogMode = ref<'create' | 'edit'>('create');

const connectionForm = reactive({
  id: '',
  name: '',
  host: 'localhost',
  port: 3306,
  username: '',
  password: '',
  database: '',
  type: DatabaseType.MySQL,
});

// 数据库类型选项
const databaseTypeOptions = DatabaseTypeUtils.getOptions();

// 监听数据库类型变化，自动设置默认端口
function handleDatabaseTypeChange(value: string) {
  if (DatabaseTypeUtils.isValidType(value)) {
    connectionForm.port = DatabaseTypeUtils.getDefaultPort(value);
  }
}

// 生成配置
const tempPackageName = ref('com.qoobot.example');

// 勾选状态
const generateChecks = reactive({
  generateEntity: true,
  generateMapper: true,
  generateMapperXml: true,
  generateService: true,
  generateServiceImpl: true,
  generateController: true,
  generateDto: true,
  generateRequestDto: true,
  generateVo: true,
  generateCommon: true,
  generateTest: true,
  generateVueEntity: true,
  generateVueCreate: true,
  generateVueEdit: true,
  generateVueDetail: true,
  generateVueList: true,
});

const generateConfig = reactive<CodeGenerateConfig>({
  projectPath: 'd:\\workspaces\\example',
  packageName: 'com.qoobot.example',
  tableName: '',
  tableComment: '',
  resourcePath: '/api',
  vueResourcePath: '/src/views',
  vuePackagePath: '',
  entityConfig: {
    basePath: '/src/main/java',
    basePackage: 'com.qoobot.example.entity',
    className: '',
  },
  mapperConfig: {
    basePath: '/src/main/java',
    basePackage: 'com.qoobot.example.mapper',
    className: '',
  },
  serviceConfig: {
    basePath: '/src/main/java',
    basePackage: 'com.qoobot.example.service',
    className: '',
  },
  controllerConfig: {
    basePath: '/src/main/java',
    basePackage: 'com.qoobot.example.controller',
    className: '',
  },
  dtoConfig: {
    basePath: '/src/main/java',
    basePackage: 'com.qoobot.example.dto',
    className: '',
  },
  voConfig: {
    basePath: '/src/main/java',
    basePackage: 'com.qoobot.example.vo',
    className: '',
  },
  commonConfig: {
    basePath: '/src/main/java',
    basePackage: 'com.qoobot.example.common',
    classNames: ['Result', 'PageResult', 'ResponseCode'],
  },
  testConfig: {
    basePath: '/src/test/java',
    basePackage: 'com.qoobot.example.test',
    className: '',
  },
  vueConfig: {
    basePath: '/src/views',
    routePath: '/example/auth-user',
    files: [
      { type: 'entity', fileName: '', path: '/example/auth-user' },
      { type: 'create', fileName: '', path: '/example/auth-user' },
      { type: 'edit', fileName: '', path: '/example/auth-user' },
      { type: 'detail', fileName: '', path: '/example/auth-user' },
      { type: 'list', fileName: '', path: '/example/auth-user' },
    ],
  },
});

// 计算属性：ServiceImpl 类名
const serviceImplClassName = computed(() => {
  return `${generateConfig.serviceConfig.className}Impl`;
});

// 计算属性：RequestDTO 类名
const requestDtoClassName = computed(() => {
  return generateConfig.dtoConfig.className.replace('DTO', 'RequestDTO');
});

// 计算属性：Vue 文件名列表
const vueConfigFileNames = computed(() => {
  return generateConfig.vueConfig.files.map((file: VueFileConfig) => file.fileName);
});

// 数据库连接表单验证规则
const connectionFormRules: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请输入连接名称', type: 'error' }],
  host: [{ required: true, message: '请输入主机地址', type: 'error' }],
  port: [{ required: true, message: '请输入端口号', type: 'error' }],
  username: [{ required: true, message: '请输入用户名', type: 'error' }],
  password: [{ required: true, message: '请输入密码', type: 'error' }],
  database: [{ required: true, message: '请输入数据库名', type: 'error' }],
  type: [{ required: true, message: '请选择数据库类型', type: 'error' }],
};

// 表名转类名
function tableToClassName(tableName: string): string {
  return tableName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// 生成类名配置
function generateClassNames(tableName: string, packageName: string) {
  const baseClassName = tableToClassName(tableName);
  const [, ...rest] = packageName.split('.');

  generateConfig.entityConfig.className = `${baseClassName}Entity`;
  generateConfig.mapperConfig.className = `${baseClassName}Mapper`;
  generateConfig.serviceConfig.className = `${baseClassName}Service`;
  generateConfig.controllerConfig.className = `${baseClassName}Controller`;
  generateConfig.dtoConfig.className = `${baseClassName}DTO`;
  generateConfig.voConfig.className = `${baseClassName}VO`;
  generateConfig.testConfig.className = `${baseClassName}Test`;

  const vuePath = `/${[...rest].join('/')}/${tableName}`;
  generateConfig.vueConfig.routePath = vuePath;
  generateConfig.vueConfig.files = [
    { type: 'entity', fileName: `${baseClassName}.ts`, path: vuePath },
    { type: 'create', fileName: `${baseClassName}Create.vue`, path: vuePath },
    { type: 'edit', fileName: `${baseClassName}Edit.vue`, path: vuePath },
    { type: 'detail', fileName: `${baseClassName}Detail.vue`, path: vuePath },
    { type: 'list', fileName: `${baseClassName}List.vue`, path: vuePath },
  ];

  generateConfig.entityConfig.basePackage = `${packageName}.entity`;
  generateConfig.mapperConfig.basePackage = `${packageName}.mapper`;
  generateConfig.serviceConfig.basePackage = `${packageName}.service`;
  generateConfig.controllerConfig.basePackage = `${packageName}.controller`;
  generateConfig.dtoConfig.basePackage = `${packageName}.dto`;
  generateConfig.voConfig.basePackage = `${packageName}.vo`;
  generateConfig.testConfig.basePackage = `${packageName}.test`;
}

// 统一包名修改
function applyPackageName() {
  if (!tempPackageName.value) {
    MessagePlugin.warning('请输入包名');
    return;
  }

  generateConfig.packageName = tempPackageName.value;
  generateClassNames(generateConfig.tableName, tempPackageName.value);
  MessagePlugin.success('包名已统一修改');
}

// 加载连接列表
onMounted(async () => {
  await loadConnections();
});

async function loadConnections() {
  try {
    const response = await databaseService.getConnections();
    connections.value = response.data;
  } catch (error: any) {
    MessagePlugin.error(error.message || '加载连接列表失败');
  }
}

// 加载表列表
async function loadTables(connectionId: string) {
  // 如果已经加载过，就直接展开
  if (connTables.value[connectionId]) {
    selectedConnection.value = connectionId;
    selectedConnectionObj.value = connections.value.find(c => c.id === connectionId) || null;
    return;
  }

  try {
    const response = await databaseService.getTables(connectionId);
    connTables.value[connectionId] = response.data;
    selectedConnection.value = connectionId;
    selectedConnectionObj.value = connections.value.find(c => c.id === connectionId) || null;
    MessagePlugin.success('表列表加载成功');
  } catch (error: any) {
    MessagePlugin.error(error.message || '加载表列表失败');
  }
}


// 切换连接（展开/收起）
async function toggleConnection(connectionId: string) {
  // 如果点击的是已选中的连接，则切换展开/收起
  if (selectedConnection.value === connectionId) {
    selectedConnection.value = null;
  } else {
    // 如果点击的是新连接，则加载表列表
    await loadTables(connectionId);
  }
}

// 选择表
async function selectTable(connectionId: string, table: any) {
  selectedConnection.value = connectionId;
  selectedTable.value = table;

  generateConfig.tableName = table.tableName;
  generateConfig.tableComment = table.tableComment || '';

  // 自动生成类名
  generateClassNames(table.tableName, generateConfig.packageName);
}

// 编辑当前选中的连接
function handleEditCurrentConnection() {
  if (!selectedConnectionObj.value) return;
  handleEditConnection(selectedConnectionObj.value);
}

// 测试当前选中的连接
async function handleTestCurrentConnection() {
  if (!selectedConnectionObj.value) return;
  await handleTestConnectionFromList(selectedConnectionObj.value.id || '');
}

// 删除当前选中的连接
function handleDeleteCurrentConnection() {
  if (!selectedConnectionObj.value) return;
  handleDeleteConnection(selectedConnectionObj.value);
}

// 新增连接
function handleAddConnection() {
  connectionDialogMode.value = 'create';
  Object.assign(connectionForm, {
    id: '',
    name: '',
    host: 'localhost',
    port: DatabaseTypeUtils.getDefaultPort(DatabaseType.MySQL),
    username: '',
    password: '',
    database: '',
    type: DatabaseType.MySQL,
  });
  connectionDialogVisible.value = true;
}

// 编辑连接
function handleEditConnection(conn: DatabaseConnection) {
  connectionDialogMode.value = 'edit';
  Object.assign(connectionForm, {
    id: conn.id,
    name: conn.name,
    host: conn.host,
    port: conn.port,
    username: conn.username,
    password: conn.password,
    database: conn.database,
    type: conn.type,
  });
  connectionDialogVisible.value = true;
}

// 删除连接
async function handleDeleteConnection(conn: DatabaseConnection) {
  try {
    await databaseService.deleteConnection(conn.id!);
    MessagePlugin.success('删除成功');
    await loadConnections();
    delete connTables.value[conn.id!];
  } catch (error: any) {
    MessagePlugin.error(error.message || '删除失败');
  }
}

// 保存连接
async function handleSaveConnection() {
  try {
    // 验证表单
    const valid = await connectionFormRef.value?.validate();
    if (!valid) {
      MessagePlugin.warning('请检查表单填写是否正确');
      return;
    }

    if (connectionDialogMode.value === 'create') {
      // 创建时移除 id 字段
      const { id, ...createData } = connectionForm;
      await databaseService.createConnection(createData);
      MessagePlugin.success('创建成功');
    } else {
      // 更新时移除 id 字段，只发送需要更新的字段
      const { id, ...updateData } = connectionForm;
      await databaseService.updateConnection(connectionForm.id!, updateData);
      MessagePlugin.success('更新成功');
    }
    connectionDialogVisible.value = false;
    await loadConnections();
  } catch (error: any) {
    MessagePlugin.error(error.message || '保存失败');
  }
}

// 从列表中测试连接
async function handleTestConnectionFromList(connectionId: string) {
  try {
    MessagePlugin.loading('正在测试连接...', 0);
    const result = await databaseService.testConnection(connectionId);
    MessagePlugin.closeAll();
    if (result.data.success) {
      MessagePlugin.success(result.data.message);
    } else {
      MessagePlugin.error(result.data.message);
    }
  } catch (error: any) {
    MessagePlugin.closeAll();
    MessagePlugin.error('测试连接失败');
  }
}

// 全表一键生成
function handleBatchGenerate() {
  MessagePlugin.success('全表一键生成功能开发中...');
}

// 开始创建
async function handleStartGenerate() {
  if (!generateConfig.projectPath) {
    MessagePlugin.warning('请先选择项目目录');
    return;
  }

  if (!selectedConnection.value || !selectedTable.value) {
    MessagePlugin.warning('请先选择数据库表');
    return;
  }

  try {
    MessagePlugin.loading('正在生成代码...', 0);

    // 获取表结构
    const schemaResponse = await databaseService.getTableSchema(
      selectedConnection.value,
      selectedTable.value.tableName
    );
    const schema = schemaResponse.data;

    // 调用代码生成 API
    const generateResponse = await fetch('/api/code-generator/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config: generateConfig,
        schema: schema,
      }),
    });
    const generateResult = await generateResponse.json();

    if (generateResult.success) {
      MessagePlugin.success('代码生成成功！');
      console.log('生成的代码:', generateResult.data);

      // 可选：直接写入文件（需要后端支持）
      // await fetch('/api/code-generator/write', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     projectPath: generateConfig.projectPath,
      //     codes: generateResult.data.codes,
      //   }),
      // });

      MessagePlugin.success('代码文件已准备就绪，可以下载或复制到项目中');
    } else {
      throw new Error(generateResult.error || '代码生成失败');
    }
  } catch (error: any) {
    MessagePlugin.error(error.message || '代码生成失败');
    console.error('生成错误:', error);
  } finally {
    MessagePlugin.closeAll();
  }
}

// 重置配置
function resetConfig() {
  tempPackageName.value = 'com.qoobot.example';
  if (selectedTable.value) {
    generateClassNames(selectedTable.value.tableName, tempPackageName.value);
  }
}

// 打开模板编辑器
function openTemplateEditor(templateType: string) {
  router.push({
    name: 'TemplateEditor',
    params: { type: templateType }
  });
}
</script>

<style scoped>
.database-page {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
  padding: 16px 24px;
  display: flex;
  align-items: center;
}

.aside {
  background: #fff;
  border-right: 1px solid #e7e7e7;
  min-width: 300px !important;
  max-width: 300px !important;
  width: 300px !important;
  display: flex;
  flex-direction: column;
}

.aside :deep(.t-card) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.aside :deep(.t-card__body) {
  flex: 1;
  overflow-y: auto;
}

.content {
  background: #f3f3f3;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
}

.content-wrapper {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 确保 t-card 在内容容器中正确布局 */
.content-wrapper :deep(.t-card) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.content-wrapper :deep(.t-card__body) {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.empty-tip {
  padding: 20px;
}

.connection-group {
  border-bottom: 1px solid #e7e7e7;
}

.connection-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.connection-item:hover {
  background-color: #f3f3f3;
}

.connection-item.active {
  background-color: #e7f1ff;
  color: #0052d9;
}

.connection-toggle {
  font-size: 12px;
  color: #999;
}

.tables-section {
  padding: 0 0 12px 0;
}

.table-list {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
}

.table-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  min-width: 0;
}

.table-item :deep(.t-icon) {
  flex-shrink: 0;
  min-width: 16px;
}

.table-item:hover {
  background-color: #f3f3f3;
}

.table-item.active {
  background-color: #e7f1ff;
  color: #0052d9;
}

.table-name {
  font-weight: 500;
}

.table-comment {
  color: #999;
  font-size: 12px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.config-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;
}

.config-form .config-row:not(.config-row-three) {
  margin-bottom: 8px;
}

.config-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-row-three {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 300px;
}

.config-label {
  width: 140px;
  font-weight: 500;
  font-size: 14px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 8px;
  color: #333;
  white-space: nowrap;
}

.config-label-short {
  width: 90px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.config-input {
  flex: 1;
}

.config-input-small {
  flex: 0 0 140px;
}

.config-input-medium {
  flex: 0 0 300px;
}

.config-input-large {
  flex: 1;
}

.config-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 16px 0;
}

/* 勾选框样式 */
:deep(.t-checkbox) {
  flex-shrink: 0;
}
</style>
