import { createWebHistory, createRouter } from "vue-router";

function createRoute(path, name, component) {
    return {
        path,
        name,
        component,
    };
}

const routes = [
    {
        path: '/',
        component: () => import('@/Pages/Task/Main.vue'),
        children: [
            createRoute('', 'taskList', () => import('@/Pages/Task/List.vue')),
            createRoute('create-task', 'createTask', () => import('@/Pages/Task/Create.vue')),
            createRoute('edit-task/:id', 'editTask', () => import('@/Pages/Task/Edit.vue')),
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;