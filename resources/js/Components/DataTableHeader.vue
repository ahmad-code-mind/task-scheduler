<template>
  <div class="flex flex-col lg:flex-row items-center justify-between rounded-t mb-0 px-6 py-4 border-0">
    <h3 class="font-semibold text-lg mb-2 lg:mb-0 lg:mr-4">{{ title }}</h3>
    <div class="relative flex w-full lg:w-auto mb-3 lg:mb-0">
      <span class="z-9 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
        <i class="fas fa-search"></i>
      </span>
      <input type="text" @input="handleSearch" placeholder="Search here..." class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"/>
    </div>
    <div>
      <select @change="handleFilter" class="border-0 px-8 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring">
        <option value="all" selected>All</option>
        <option value="1">Low</option>
        <option value="2">Medium</option>
        <option value="3">High</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
    props: {
      title: String,
      showFilter: Boolean,
    },
    methods: {
      handleSearch(e) {
        this.$emit('search', e.target.value);
      },
      handleFilter(e) {
        this.$emit('filter', e.target.value);
      },
    },
};
</script>