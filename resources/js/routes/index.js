import { createWebHistory, createRouter } from "vue-router";

function generateMeta(title, breadcrumb) {
    return {
        title,
        breadcrumb,
    };
}

function createRoute(path, name, component, meta = {}) {
    return {
        path,
        name,
        component,
        meta,
    };
}

const routes = [
    {
        path: '/',
        component: () => import('../Pages/Task/Main.vue'),
        children: [
            createRoute('', 'taskList', () => import('../Pages/Task/List.vue'), generateMeta('Task Scheduler', 'Task Scheduler')),
            createRoute('create-task', 'createTask', () => import('../Pages/Task/Create.vue'), generateMeta('Create Task', 'Create Task')),
            createRoute('edit-task/:id', 'editTask', () => import('../Pages/Task/Edit.vue'), generateMeta('Edit Task', 'Edit Task')),
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;