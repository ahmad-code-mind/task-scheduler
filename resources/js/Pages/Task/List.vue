<template>
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      <DataTableHeader title="Task List" @search="handleSearch" />
      <div class="block w-full overflow-x-auto">
        <table class="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th v-for="(header, index) in headers" :key="index" :class="headerClass">
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody v-if="getAllPaginatedTasks && getAllPaginatedTasks.length != 0">
            <tr v-for="(Task, index) in Object.values(getAllPaginatedTasks)" :key="Task.id">
              <td :class="bodyCommonClass">{{ index + 1 }}</td>
              <td :class="bodyCommonClass">{{ Task.title }}</td>
              <td>
                <div class="flex" style="width: 200px">
                  <router-link type="button" v-if="hasPermission('update_Task')" class="btn-primary text-white font-semibold btn-hover uppercase text-xs px-4 py-2 rounded mr-2" :to="{ name: 'TaskEdit', params: { id: Task.id } }">
                    <i class="fa fa-edit mr-1" aria-hidden="true"></i> Edit
                  </router-link>
                  <button type="button" v-if="hasPermission('delete_Task')" class="btn-primary text-white font-semibold btn-hover uppercase text-xs px-4 py-2 rounded" @click="confirmDelete(Task.id)">
                    <i class="fa fa-trash mr-1" aria-hidden="true"></i> Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td class="text-sm p-4">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
      <DataTableFooter
        :from="getExtraPaginatedTasksData.from"
        :to="getExtraPaginatedTasksData.to"
        :total="getExtraPaginatedTasksData.total"
        :selectedPageSize="selectedPageSize"
        :customPageSizeOptions="customPageSizeOptions"
        :current_page="getExtraPaginatedTasksData.current_page"
        :per_page="getExtraPaginatedTasksData.per_page"
        @page-change="setCurrentPage"
      />
    </div>
  </template>
  
<script>
import { mapActions, mapGetters } from 'vuex';
import { PaginationStatesMixin } from '@/mixins/PaginationStatesMixin';
import Loader from '@/Components/Loader.vue';
import DataTableHeader from '@/Components/DataTableHeader.vue';
import DataTableFooter from '@/Components/DataTableFooter.vue';
  
  export default {
    components: {Loader, DataTableFooter, DataTableHeader},
    mixins: [PaginationStatesMixin],
    data() {
      return {
        headerCommonClass: 'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left',
        bodyCommonClass: 'border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4',
        headers: [],
        commonInputClass: 'border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150',
      }
    },
    created() {
      this.headers = [
        { text: '#', class: this.headerCommonClass },
        { text: 'Title', class: this.headerCommonClass },
        { text: 'Due Date', class: this.headerCommonClass },
        { text: 'Action', class: this.headerCommonClass }
      ];
    },
    mounted() {
        this.fetchTasks();
    },
    watch: {
      selectedPageSize() {
        this.fetchTasks();
      },
    },
    computed: {
      ...mapGetters([
        'getTaskValidationError',
        'getSelectedTask',
        'getAllTasks',
        'getAllPaginatedTasks', 
        'getExtraPaginatedTasksData',
      ]),
      isLoading() {
        return this.$store.state.Task.isLoading;
      },
      isContentLoading() {
        return this.$store.state.Task.isContentLoading;
      },
      headerClass() {
        return this.headers.map(header => {
          return [
            header.class,
            'bg-blueGray-800 text-blueGray-500 border-blueGray-700',
          ];
        });
      }
    },
    methods: {
      ...mapActions(['deleteTask', 'filterTask', 'updateTask']),
      openModal(TaskId) {
        this.$store.dispatch("getTask", { TaskId });
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
      async fetchTasks(search = '') {
        try {
          const data = {
            page: search !== '' ? this.currentPage = 1 : this.currentPage,
            per_page: this.selectedPageSize,
            search: search
          }
          await this.filterTask(data);
        }
        catch (error) {
          console.error('Error fetching Tasks:', error);
        }
      },
      handleSearch(value) {
        this.fetchTasks(value);
      },
      handleSelectedPageSize(value) {
        this.selectedPageSize = value;
      },
      setCurrentPage(page) {
        this.currentPage = page;
        this.sortKey = "";
        this.sortOrder = "asc";
        this.fetchTasks();
      },
      async confirmDelete(TaskId) {
        try {
          const result = await showWarningAlert('Are you sure?', 'Deleting this Task will also delete all related courses. Are you sure you want to proceed?', 'Yes, delete it!');
          if (result.isConfirmed) {
            this.handleDeleteTask(TaskId);
          }
          else {
            showInfoAlert('Deletion canceled');
          }
        }
        catch (error) {
          console.error(error);
        }
      },
      handleDeleteTask(TaskId) {
        try {
            const data = {
                id: TaskId,
            };
            this.deleteTask(data);
            this.fetchTasks();
        }
        catch (error) {
            console.error('Error deleting Tasks:', error);
        }
      },
    },
  };
  </script>