<template>
  <div class="code-editor-page">
    <t-layout>
      <t-header class="header">
        <div class="header-left">
          <t-button variant="text" @click="handleBack">
            <template #icon><chevron-left-icon /></template>
            返回
          </t-button>
          <div class="project-title">
            <h2>{{ projectName }}</h2>
            <t-tag size="small" theme="success">编辑中</t-tag>
          </div>
        </div>
        <div class="header-right">
          <t-space>
            <t-button variant="outline" @click="handleGenerateCode">
              <template #icon><code-icon /></template>
              生成代码
            </t-button>
            <t-button variant="outline" @click="handleSaveAll">
              <template #icon><save-icon /></template>
              保存全部
            </t-button>
            <t-button theme="primary" @click="handleExport">
              <template #icon><download-icon /></template>
              导出项目
            </t-button>
          </t-space>
        </div>
      </t-header>

      <t-layout>
        <t-aside class="aside" width="280px">
          <FileTree
            :data="fileTreeData"
            @select="handleFileSelect"
            @expand="handleFolderExpand"
          />
        </t-aside>

        <t-content class="content">
          <div v-if="selectedFile" class="editor-container">
            <CodePreview
              ref="codePreviewRef"
              v-model:code="currentCode"
              :filename="selectedFile.label"
              :language="selectedFile.language || 'java'"
              :readonly="false"
              @change="handleCodeChange"
            />
          </div>
          <t-empty v-else description="请选择一个文件进行编辑" />
        </t-content>

        <t-aside v-if="showPreview" class="preview-aside" width="400px">
          <div class="preview-header">
            <h4>生成预览</h4>
            <t-button size="small" variant="text" @click="togglePreview">
              <template #icon><close-icon /></template>
            </t-button>
          </div>
          <div class="preview-content">
            <t-tabs v-model="activePreviewTab">
              <t-tab-panel value="code" label="代码" />
              <t-tab-panel value="preview" label="预览" />
            </t-tabs>
            <div class="tab-content">
              <CodePreview
                v-if="activePreviewTab === 'code'"
                :code="previewCode"
                :filename="previewFilename"
                :language="previewLanguage"
                :readonly="true"
              />
              <div v-else class="preview-text">
                {{ previewText }}
              </div>
            </div>
          </div>
        </t-aside>
      </t-layout>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { useProjectStore } from '@/stores/project';
import FileTree, { type FileNode } from '@/components/FileTree.vue';
import CodePreview from '@/components/CodePreview.vue';
import {
  ChevronLeftIcon,
  CodeIcon,
  SaveIcon,
  DownloadIcon,
  CloseIcon,
} from 'tdesign-icons-vue-next';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();

const projectId = route.params.id as string;
const projectName = ref('');
const selectedFile = ref<FileNode | null>(null);
const currentCode = ref('');
const fileCodes = ref<Record<string, string>>({});

const showPreview = ref(false);
const previewCode = ref('');
const previewFilename = ref('');
const previewLanguage = ref('java');
const previewText = ref('');
const activePreviewTab = ref('code');

const codePreviewRef = ref<InstanceType<typeof CodePreview>>();

// 示例文件树数据
const fileTreeData = ref<FileNode[]>([
  {
    id: '1',
    label: 'src',
    value: 'src',
    path: '/src',
    type: 'folder',
    children: [
      {
        id: '2',
        label: 'main',
        value: 'src/main',
        path: '/src/main',
        type: 'folder',
        children: [
          {
            id: '3',
            label: 'java',
            value: 'src/main/java',
            path: '/src/main/java',
            type: 'folder',
            children: [
              {
                id: '4',
                label: 'com',
                value: 'src/main/java/com',
                path: '/src/main/java/com',
                type: 'folder',
                children: [
                  {
                    id: '5',
                    label: 'example',
                    value: 'src/main/java/com/example',
                    path: '/src/main/java/com/example',
                    type: 'folder',
                    children: [
                      {
                        id: '6',
                        label: 'demo',
                        value: 'src/main/java/com/example/demo',
                        path: '/src/main/java/com/example/demo',
                        type: 'folder',
                        children: [
                          {
                            id: '7',
                            label: 'DemoApplication.java',
                            value: 'src/main/java/com/example/demo/DemoApplication.java',
                            path: '/src/main/java/com/example/demo/DemoApplication.java',
                            type: 'file',
                            language: 'java'
                          },
                          {
                            id: '8',
                            label: 'controller',
                            value: 'src/main/java/com/example/demo/controller',
                            path: '/src/main/java/com/example/demo/controller',
                            type: 'folder',
                            children: []
                          },
                          {
                            id: '9',
                            label: 'service',
                            value: 'src/main/java/com/example/demo/service',
                            path: '/src/main/java/com/example/demo/service',
                            type: 'folder',
                            children: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                id: '10',
                label: 'resources',
                value: 'src/main/resources',
                path: '/src/main/resources',
                type: 'folder',
                children: [
                  {
                    id: '11',
                    label: 'application.yml',
                    value: 'src/main/resources/application.yml',
                    path: '/src/main/resources/application.yml',
                    type: 'file',
                    language: 'yaml'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '12',
    label: 'pom.xml',
    value: '/pom.xml',
    path: '/pom.xml',
    type: 'file',
    language: 'xml'
  }
]);

onMounted(() => {
  // 加载项目信息
  const project = projectStore.projects.find(p => p.id === projectId);
  if (project) {
    projectName.value = project.name;
  }
});

function handleBack() {
  router.push(`/projects/${projectId}`);
}

function handleFileSelect(node: FileNode) {
  selectedFile.value = node;
  // 从缓存中加载代码，或使用默认代码
  currentCode.value = fileCodes.value[node.value] || generateDefaultCode(node);
}

function handleFolderExpand(node: FileNode) {
  console.log('Expand folder:', node.label);
}

function handleCodeChange(code: string) {
  if (selectedFile.value) {
    fileCodes.value[selectedFile.value.value] = code;
  }
}

function generateDefaultCode(node: FileNode): string {
  const filename = node.label.toLowerCase();

  if (filename.endsWith('.java')) {
    return `package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}`;
  } else if (filename.endsWith('.yml') || filename.endsWith('.yaml')) {
    return `server:
  port: 8080

spring:
  application:
    name: demo-app
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password:`;
  } else if (filename.endsWith('.xml')) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>1.0.0</version>
    <name>Demo Project</name>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`;
  }

  return '// 文件内容待生成';
}

function handleGenerateCode() {
  MessagePlugin.success('代码生成功能开发中...');
  showPreview.value = true;
  previewCode.value = generateDefaultCode(selectedFile.value || { label: 'Test.java', value: '', path: '', type: 'file' });
  previewFilename.value = '生成预览.java';
  previewLanguage.value = 'java';
  previewText.value = '代码生成成功！';
}

function handleSaveAll() {
  MessagePlugin.success('保存成功');
}

function handleExport() {
  MessagePlugin.success('导出项目功能开发中...');
}

function togglePreview() {
  showPreview.value = !showPreview.value;
}
</script>

<style scoped>
.code-editor-page {
  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.project-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-title h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
}

.aside {
  background: #fff;
  border-right: 1px solid #e7e7e7;
}

.content {
  background: #f5f5f5;
  overflow: hidden;
}

.editor-container {
  height: 100%;
  padding: 16px;
  background: #fff;
}

.preview-aside {
  background: #fff;
  border-left: 1px solid #e7e7e7;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f8f8;
  border-bottom: 1px solid #e7e7e7;
}

.preview-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.preview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tab-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.preview-text {
  color: #666;
  line-height: 1.6;
}
</style>
