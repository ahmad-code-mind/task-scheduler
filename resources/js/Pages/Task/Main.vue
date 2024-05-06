<template>
  <div v-if="shouldShowAddNewButton" class="cursor-pointer float-end py-5">
    <router-link class="btn-primary text-white font-semibold btn-hover uppercase text-xs px-4 py-2 rounded" :to="{ name: 'createTask' }">
      <i class="fas fa-plus mr-2"></i>
      <span>Add New</span>
    </router-link>
  </div>
  <div class="">
    <router-view />
  </div>
</template>
    
<script>
export default {
  data() {
      return {
          pageTitle: '',
          breadcrumb: '',
      };
  },
  computed: {
    shouldShowAddNewButton() {
        const matchedRoute = this.$route.matched[this.$route.matched.length - 1];
        return matchedRoute && matchedRoute.name === 'taskList';
    },
  },
  watch: {
      $route(to, from) {
          this.updatePageTitle(to);
      },
  },
  mounted() {
      this.updatePageTitle(this.$route);
  },
  methods: {
      updatePageTitle(route) {
          const matchedRoute = route.matched[route.matched.length - 1];
              if (matchedRoute) {
                  this.pageTitle = matchedRoute.meta.title || '';
                  this.breadcrumb = matchedRoute.meta.breadcrumb || '';
              }
          },
      },
};
</script>  