<template>
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      <DataTableHeader title="Task List" @search="handleSearch" @filter="handleFilter" />
      <div class="block w-full overflow-x-auto">
        <table class="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th v-for="(header, index) in headers" :key="index" :class="headerClass">
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody v-if="formattedTasks && formattedTasks.length != 0">
            <tr v-for="(task, index) in Object.values(formattedTasks)" :key="task.id">
              <td :class="bodyCommonClass">{{ index + 1 }}</td>
              <td :class="bodyCommonClass">{{ task.title }}</td>
              <td :class="bodyCommonClass">{{ task.formattedDueDate }}</td>
              <td :class="bodyCommonClass">{{ task.remainingTime.days }} days, {{ task.remainingTime.hours }} hours, {{ task.remainingTime.minutes }} minutes</td>
              <td :class="bodyCommonClass">{{ task.priorityLabel  }}</td>
              <td>
                <div class="flex" style="width: 200px">
                  <router-link type="button" class="btn-primary text-white font-semibold btn-hover uppercase text-xs px-4 py-2 rounded mr-2" :to="{ name: 'editTask', params: { id: task.id } }">
                    <i class="fa fa-edit mr-1" aria-hidden="true"></i> Edit
                  </router-link>
                  <button type="button" class="btn-primary text-white font-semibold btn-hover uppercase text-xs px-4 py-2 rounded" @click="confirmDelete(task.id)">
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
        user_id: null,
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
        { text: 'Remaining Time', class: this.headerCommonClass },
        { text: 'Priority', class: this.headerCommonClass },
        { text: 'Action', class: this.headerCommonClass }
      ];
    },
    mounted() {
      this.user_id = this.$page.props.auth.user.id
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
      },
      formattedTasks() {
        return this.getAllPaginatedTasks.map(task => {
          const dueDate = new Date(task.due_date);
          const formattedDueDate = this.formatDate(dueDate);
          const remainingTime = this.calculateRemainingTime(dueDate);

          return {
            ...task,
            formattedDueDate,
            remainingTime,
            priorityLabel: this.getPriorityLabel(task.priority)
          };
        });
      },
    },
    watch: {
      getAllPaginatedTasks: {
        immediate: true,
        handler() {
          this.startTimer();
        }
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
      async fetchTasks(search = '', filter = 'all') {
        try {
          const data = {
            page: search !== '' ? this.currentPage = 1 : this.currentPage,
            per_page: this.selectedPageSize,
            search: search,
            filter: filter,
            user_id: this.user_id
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
      handleFilter(value) {
        this.fetchTasks('', value);
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
      async confirmDelete(taskId) {
        try {
            const result = window.confirm('Are you sure you want to proceed?');
            if (result) {
                this.handleDeleteTask(taskId);
            } else {
                window.alert('Deletion canceled');
            }
        } catch (error) {
            console.error(error);
        }
      },
      handleDeleteTask(taskId) {
        try {
            const data = {
                id: taskId,
            };
            this.deleteTask(data);
            this.fetchTasks();
        }
        catch (error) {
            console.error('Error deleting Tasks:', error);
        }
      },
      formatDate(date) {
        const options = { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
      },
      calculateRemainingTime(dueDate) {
        const now = new Date();
        const difference = dueDate.getTime() - now.getTime();

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        return { days, hours, minutes };
      },
      startTimer() {
        setInterval(() => {
          this.formattedTasks.forEach(task => {
            task.remainingTime = this.calculateRemainingTime(new Date(task.due_date));
          });
        }, 60000);
      },
      getPriorityLabel(priority) {
        switch (priority) {
          case 1:
            return 'Low';
          case 2:
            return 'Medium';
          case 3:
            return 'High';
          default:
            return 'Unknown';
        }
      }
    },
  };
  </script>