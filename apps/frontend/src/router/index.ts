import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页 - AI编程平台' },
  },
  {
    path: '/projects',
    name: 'ProjectList',
    component: () => import('@/views/ProjectList.vue'),
    meta: { title: '项目列表 - AI编程平台' },
  },
  {
    path: '/projects/create',
    name: 'ProjectCreate',
    component: () => import('@/views/ProjectCreate.vue'),
    meta: { title: '创建项目 - AI编程平台' },
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetail.vue'),
    meta: { title: '项目详情 - AI编程平台' },
  },
  {
    path: '/projects/:id/edit',
    name: 'ProjectEdit',
    component: () => import('@/views/ProjectEdit.vue'),
    meta: { title: '编辑项目 - AI编程平台' },
  },
  {
    path: '/projects/:id/editor',
    name: 'CodeEditor',
    component: () => import('@/views/CodeEditor.vue'),
    meta: { title: '代码编辑器 - AI编程平台' },
  },
  {
    path: '/templates',
    name: 'TemplateList',
    component: () => import('@/views/TemplateList.vue'),
    meta: { title: '模板库 - AI编程平台' },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { title: '设置 - AI编程平台' },
  },
  {
    path: '/database',
    name: 'Database',
    component: () => import('@/views/Database.vue'),
    meta: { title: '数据库管理 - AI编程平台' },
  },
  {
    path: '/entity-designer',
    name: 'EntityDesigner',
    component: () => import('@/views/EntityDesigner.vue'),
    meta: { title: '数据模型设计 - AI编程平台' },
  },
  {
    path: '/file-manager',
    name: 'FileManager',
    component: () => import('@/views/FileManager.vue'),
    meta: { title: '文件管理 - AI编程平台' },
  },
  {
    path: '/template-editor/:type',
    name: 'TemplateEditor',
    component: () => import('@/views/TemplateEditor.vue'),
    meta: { title: '模板代码编辑 - AI编程平台' },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  next();
});

export default router;
