<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { computed } from 'vue'
import { Head } from '@inertiajs/vue3';
import { usePage } from '@inertiajs/vue3'
const page = usePage()

const token = computed(() => page.props.auth.token)
localStorage.setItem('authToken', token.value);
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
