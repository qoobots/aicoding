<template>
  <div class="settings-page">
    <t-layout>
      <t-header class="header">
        <h2>设置</h2>
      </t-header>

      <t-layout>
        <t-aside class="aside" width="240px">
          <t-menu v-model="activeMenu" :default-active="activeMenu" @change="handleMenuChange">
            <t-menu-item value="general">通用设置</t-menu-item>
            <t-menu-item value="editor">编辑器设置</t-menu-item>
            <t-menu-item value="ai">AI 设置</t-menu-item>
            <t-menu-item value="database">数据库设置</t-menu-item>
            <t-menu-item value="export">导出设置</t-menu-item>
          </t-menu>
        </t-aside>

        <t-content class="content">
          <div v-if="activeMenu === 'general'" class="tab-content">
            <t-card title="通用设置">
              <t-form :data="generalSettings" label-width="120px" @submit="handleSaveGeneral">
                <t-form-item label="主题" name="theme">
                  <t-radio-group v-model="generalSettings.theme">
                    <t-radio value="light">浅色</t-radio>
                    <t-radio value="dark">深色</t-radio>
                    <t-radio value="auto">跟随系统</t-radio>
                  </t-radio-group>
                </t-form-item>

                <t-form-item label="语言" name="language">
                  <t-select v-model="generalSettings.language">
                    <t-option value="zh-CN">简体中文</t-option>
                    <t-option value="en-US">English</t-option>
                  </t-select>
                </t-form-item>

                <t-form-item label="自动保存" name="autoSave">
                  <t-switch v-model="generalSettings.autoSave" />
                  <span class="hint">启用后，编辑器将自动保存更改</span>
                </t-form-item>

                <t-form-item label="保存间隔" name="saveInterval">
                  <t-input-number
                    v-model="generalSettings.saveInterval"
                    :min="10"
                    :max="300"
                    :step="10"
                  />
                  <span class="hint">秒</span>
                </t-form-item>

                <t-form-item>
                  <t-button theme="primary" type="submit">保存</t-button>
                </t-form-item>
              </t-form>
            </t-card>
          </div>

          <div v-else-if="activeMenu === 'editor'" class="tab-content">
            <t-card title="编辑器设置">
              <t-form :data="editorSettings" label-width="120px" @submit="handleSaveEditor">
                <t-form-item label="字体大小" name="fontSize">
                  <t-input-number
                    v-model="editorSettings.fontSize"
                    :min="12"
                    :max="32"
                    :step="1"
                  />
                  <span class="hint">px</span>
                </t-form-item>

                <t-form-item label="字体家族" name="fontFamily">
                  <t-select v-model="editorSettings.fontFamily">
                    <t-option value="Consolas, 'Courier New', monospace">Consolas</t-option>
                    <t-option value="'Fira Code', monospace">Fira Code</t-option>
                    <t-option value="'JetBrains Mono', monospace">JetBrains Mono</t-option>
                    <t-option value="'Source Code Pro', monospace">Source Code Pro</t-option>
                  </t-select>
                </t-form-item>

                <t-form-item label="Tab 大小" name="tabSize">
                  <t-input-number
                    v-model="editorSettings.tabSize"
                    :min="2"
                    :max="8"
                    :step="1"
                  />
                </t-form-item>

                <t-form-item label="行号" name="lineNumbers">
                  <t-switch v-model="editorSettings.lineNumbers" />
                </t-form-item>

                <t-form-item label="代码折叠" name="folding">
                  <t-switch v-model="editorSettings.folding" />
                </t-form-item>

                <t-form-item label="自动缩进" name="autoIndent">
                  <t-switch v-model="editorSettings.autoIndent" />
                </t-form-item>

                <t-form-item>
                  <t-button theme="primary" type="submit">保存</t-button>
                </t-form-item>
              </t-form>
            </t-card>
          </div>

          <div v-else-if="activeMenu === 'ai'" class="tab-content">
            <t-card title="AI 设置">
              <t-form :data="aiSettings" label-width="120px" @submit="handleSaveAI">
                <t-form-item label="AI 提供商" name="provider">
                  <t-select v-model="aiSettings.provider">
                    <t-option value="openai">OpenAI</t-option>
                    <t-option value="claude">Claude</t-option>
                    <t-option value="custom">自定义</t-option>
                  </t-select>
                </t-form-item>

                <t-form-item v-if="aiSettings.provider !== 'custom'" label="API Key" name="apiKey">
                  <t-input
                    v-model="aiSettings.apiKey"
                    type="password"
                    placeholder="请输入 API Key"
                    clearable
                  />
                </t-form-item>

                <t-form-item label="模型" name="model">
                  <t-select v-model="aiSettings.model">
                    <t-option value="gpt-4">GPT-4</t-option>
                    <t-option value="gpt-3.5-turbo">GPT-3.5 Turbo</t-option>
                    <t-option value="claude-3">Claude 3</t-option>
                    <t-option value="claude-3.5-sonnet">Claude 3.5 Sonnet</t-option>
                  </t-select>
                </t-form-item>

                <t-form-item label="温度" name="temperature">
                  <t-slider
                    v-model="aiSettings.temperature"
                    :min="0"
                    :max="2"
                    :step="0.1"
                  />
                  <span class="hint">{{ aiSettings.temperature }}</span>
                </t-form-item>

                <t-form-item label="最大 Token" name="maxTokens">
                  <t-input-number
                    v-model="aiSettings.maxTokens"
                    :min="100"
                    :max="4000"
                    :step="100"
                  />
                </t-form-item>

                <t-form-item>
                  <t-button theme="primary" type="submit">保存</t-button>
                </t-form-item>
              </t-form>
            </t-card>
          </div>

          <div v-else-if="activeMenu === 'database'" class="tab-content">
            <t-card title="数据库设置">
              <t-form :data="databaseSettings" label-width="120px" @submit="handleSaveDatabase">
                <t-form-item label="默认数据库" name="defaultType">
                  <t-radio-group v-model="databaseSettings.defaultType">
                    <t-radio value="mysql">MySQL</t-radio>
                    <t-radio value="postgresql">PostgreSQL</t-radio>
                    <t-radio value="sqlite">SQLite</t-radio>
                  </t-radio-group>
                </t-form-item>

                <t-form-item label="连接池" name="poolSize">
                  <t-input-number
                    v-model="databaseSettings.poolSize"
                    :min="1"
                    :max="100"
                  />
                </t-form-item>

                <t-form-item label="超时时间" name="timeout">
                  <t-input-number
                    v-model="databaseSettings.timeout"
                    :min="1"
                    :max="60"
                  />
                  <span class="hint">秒</span>
                </t-form-item>

                <t-form-item>
                  <t-button theme="primary" type="submit">保存</t-button>
                  <t-button @click="handleTestConnection">测试连接</t-button>
                </t-form-item>
              </t-form>
            </t-card>
          </div>

          <div v-else-if="activeMenu === 'export'" class="tab-content">
            <t-card title="导出设置">
              <t-form :data="exportSettings" label-width="120px" @submit="handleSaveExport">
                <t-form-item label="导出格式" name="format">
                  <t-checkbox-group v-model="exportSettings.format">
                    <t-checkbox value="zip">ZIP 压缩包</t-checkbox>
                    <t-checkbox value="tar">TAR 压缩包</t-checkbox>
                  </t-checkbox-group>
                </t-form-item>

                <t-form-item label="包含文件" name="include">
                  <t-checkbox-group v-model="exportSettings.include">
                    <t-checkbox value="source">源代码</t-checkbox>
                    <t-checkbox value="config">配置文件</t-checkbox>
                    <t-checkbox value="readme">README</t-checkbox>
                    <t-checkbox value="gitignore">.gitignore</t-checkbox>
                  </t-checkbox-group>
                </t-form-item>

                <t-form-item label="压缩级别" name="compression">
                  <t-radio-group v-model="exportSettings.compression">
                    <t-radio value="0">不压缩</t-radio>
                    <t-radio value="1">快速</t-radio>
                    <t-radio value="5">标准</t-radio>
                    <t-radio value="9">最佳</t-radio>
                  </t-radio-group>
                </t-form-item>

                <t-form-item>
                  <t-button theme="primary" type="submit">保存</t-button>
                </t-form-item>
              </t-form>
            </t-card>
          </div>
        </t-content>
      </t-layout>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

const activeMenu = ref('general');

const generalSettings = ref({
  theme: 'light',
  language: 'zh-CN',
  autoSave: true,
  saveInterval: 60,
});

const editorSettings = ref({
  fontSize: 14,
  fontFamily: 'Consolas, "Courier New", monospace',
  tabSize: 4,
  lineNumbers: true,
  folding: true,
  autoIndent: true,
});

const aiSettings = ref({
  provider: 'openai',
  apiKey: '',
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
});

const databaseSettings = ref({
  defaultType: 'mysql',
  poolSize: 10,
  timeout: 30,
});

const exportSettings = ref({
  format: ['zip'],
  include: ['source', 'config', 'readme', 'gitignore'],
  compression: '5',
});

function handleMenuChange(value: string) {
  activeMenu.value = value;
}

function handleSaveGeneral() {
  MessagePlugin.success('通用设置已保存');
}

function handleSaveEditor() {
  MessagePlugin.success('编辑器设置已保存');
}

function handleSaveAI() {
  MessagePlugin.success('AI 设置已保存');
}

function handleSaveDatabase() {
  MessagePlugin.success('数据库设置已保存');
}

function handleSaveExport() {
  MessagePlugin.success('导出设置已保存');
}

function handleTestConnection() {
  MessagePlugin.success('数据库连接测试成功');
}
</script>

<style scoped>
.settings-page {
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  padding: 24px;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.aside {
  background: #fff;
  border-right: 1px solid #e7e7e7;
  padding: 24px 16px;
}

.content {
  padding: 24px;
  background: #f3f3f3;
  overflow-y: auto;
}

.tab-content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.hint {
  margin-left: 8px;
  color: #999;
  font-size: 14px;
}
</style>
