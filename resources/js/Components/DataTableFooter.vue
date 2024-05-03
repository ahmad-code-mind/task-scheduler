<template>
  <div class="h-0 border border-solid border-blueGray-100" />
  <div class="flex flex-col lg:flex-row items-center justify-between rounded-t mb-0 px-6 py-4 border-0">
    <div class="mb-2 lg:mb-0 lg:mr-4">
      <h1 class="text-show-text-pagination-box">Showing {{ from || 0 }} to {{ to || 0 }} of {{ total || 0 }} entries</h1>
    </div>
    <div class="relative flex lg:w-auto mb-2 lg:mb-0">
      <div class="flex items-center show-record-box">
        <span class="mr-2">Show</span>
        <div class="relative">
          <select :value="selectedPageSize" @change="handleSelectedPageSize" class="border border-gray-300 rounded-md px-6 py-1">
            <option v-for="option in customPageSizeOptions" :value="option.value" :key="option.value">
              {{ option.label || option.value }}
            </option>
          </select>
        </div>
        <span class="ml-2">Entries</span>
      </div>
    </div>
    <div class="">
      <!-- Pagination Start -->
      <div class="flex justify-center">
        <a-pagination
          :current="current_page"
          :pageSize="per_page"
          :total="total"
          show-less-items
          :pageSizeOptions="[]"
          @change="handlePageChange"
        />
      </div>
      <!-- Pagination End -->
    </div>
  </div>
</template>


<script>
export default {
  props: {
    from: Number,
    to: Number,
    total: Number,
    selectedPageSize: Number,
    customPageSizeOptions: Array,
    current_page: Number,
    per_page: Number,
  },
  methods: {
    handleSelectedPageSize(event) {
      this.$emit('selected-page-size', event.target.value);
    },
    handlePageChange(newPage) {
      this.$emit('page-change', newPage);
    },
  },
};
</script>

<style scoped>
.text-show-text-pagination-box {
  font-size: 16px;
  font-weight: 400;
  color: #6d6d6d;
  display: flex;
  align-items: center;
  height: 100%;
}
</style>