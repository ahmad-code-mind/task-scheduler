import { createStore } from "vuex";
import api from "@/apis";
import config from "@/config";
import { getApiHeader } from '@/utils/ApiHeader';
import { sendRequest } from '@/utils/SendRequest';

export default createStore({
    state: {
        allTasks: [],
        allPaginatedTasks: [],
        extraPaginatedTasksData: [],
        selectedTask: {},
        taskValidationErrors: [],
        isLoading: false,
        isSuccess: false,
      },
      getters: {
        getAllTasks(state) {
          return state.allTasks;
        },
        getAllPaginatedTasks(state) {
          return state.allPaginatedTasks;
        },
        getExtraPaginatedTasksData(state) {
          return state.extraPaginatedTasksData;
        },
        getSelectedTask(state) {
          return state.selectedTask;
        },
        getTaskValidationError(state) {
          return state.taskValidationErrors;
        },
        getSelectedTaskIds(state) {
          return state.selectedTaskIds;
        },
        getCompanies(state) {
          return state.companies;
        },
        getCountries(state) {
          return state.countries;
        },
        getCities(state) {
          return state.cities;
        },
      },
      mutations: {
        SET_ALL_TASKS(state, data) {
          state.allTasks = data;
        },
        SET_ALL_PAGINATED_TASKS(state, data) {
          state.allPaginatedTasks = data;
        },
        SET_EXTRA_PAGINATED_DATA(state, data) {
          state.extraPaginatedTasksData = data;
        },
        SET_TASK_TO_EDIT(state, data) {
          state.selectedTask = data;
        },
        SET_VALIDATION_ERROR(state, errors) {
          state.taskValidationErrors = errors;
        },
        SET_LOADING(state, status) {
          state.isLoading = status;
        },
        SET_CONTENT_LOADING(state, status) {
          state.isContentLoading = status;
        },
        SET_SUCCESS(state, status) {
          state.isSuccess = status;
        },
      },
      actions: {
        /* CREATE TASK */
        async createTask({ commit }, data) {
          await sendRequest(api.task_scheduler.create.endpoint, api.task_scheduler.create.method, data, commit);
        },
        /* GET TASK */
        async getTask({ commit }, { TaskId, module }) {
          try {
            commit("SET_CONTENT_LOADING", true);
            commit("SET_Task_TO_EDIT", {});
            
            const url = config.API_BASE_URL + api.task_scheduler.get.endpoint;
            let endpoint = url;
            if (TaskId && module) {
              endpoint += `?Task_id=${TaskId}&module=${module}`;
            } else if (TaskId) {
              endpoint += `?Task_id=${TaskId}`;
            } else if (module) {
              endpoint += `?module=${module}`;
            }
    
            const method = api.task_scheduler.get.method;
    
            const requestOptions = {
              method: method,
              headers: getApiHeader(),
            };
            const response = await fetch(endpoint, requestOptions);
            const responseBody = await handleResponse(response);
            if (responseBody.status === 200) {
              commit("SET_CONTENT_LOADING", false);
              if (TaskId) {
                commit("SET_Task_TO_EDIT", responseBody.data);
              } else {
                commit("SET_ALL_Tasks", responseBody.data.Tasks);
              }
            } else {
              commit("SET_CONTENT_LOADING", false);
              dangerToast(responseBody.message);
            }
          } catch (error) {
            commit("SET_CONTENT_LOADING", false);
            console.error('Error fetching profiles:', error.message);
          }
        },
        /* FILTER TASK */
        async filterTask({ commit }, data) {
          try {
            const showLoader = data.search === '';
            const url = createEndpoint(data, api.task_scheduler.get.endpoint, showLoader);
            const responseData = await fetchData(commit, url, api.task_scheduler.get.method, showLoader);
            
            if (responseData) {
              commit("SET_EXTRA_PAGINATED_DATA", responseData.Tasks);
              commit("SET_ALL_PAGINATED_Tasks", responseData.Tasks.data);
            }
          } catch (error) {
            console.error('Error fetching profiles:', error.message);
          }
        },
        /* UPDATE TASK */
        async updateTask({ commit }, data) {
          await sendRequest(api.task_scheduler.update.endpoint, api.task_scheduler.update.method, data, commit);
        },
         /* DELETE TASK */
        async deleteTask({ commit }, data) {
          try {
              commit("SET_SUCCESS", false);
              const response = await fetch(
                  config.API_BASE_URL + api.task_scheduler.delete.endpoint,
                  {
                      method: api.task_scheduler.delete.method,
                      headers: getApiHeader(),
                      body: JSON.stringify(data),
                  }
              );
              const responseBody = await handleResponse(response);
              if (responseBody.status === 200) {
                  commit("SET_SUCCESS", true);
                  successToast(responseBody.message);
              } else {
                  commit("SET_SUCCESS", false);
                  dangerToast(responseBody.message);
              }
          } catch (error) {
              commit("SET_SUCCESS", false);
              console.error('Error deleting Task:', error.message);
          }
        },
        /* CLEAN UP */
        TaskCleanUp({ commit }) {
          commit("SET_VALIDATION_ERROR", []);
          commit("SET_SUCCESS", false);
        },
    },
});