<template>
    <div
      class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
    >
      <div class="rounded-t bg-white mb-0 px-6 py-3">
        <div class="text-center flex justify-between">
          <h6 class="text-blueGray-700 text-xl font-semibold">{{ title }}</h6>
        </div>
      </div>
      <div class="flex-auto px-2 mt-5">
        <form @submit.prevent="handleCreateTask" ref="createTask">
          <input type="hidden" name="user_id" v-model="userId">
          <div class="flex flex-wrap">
            <!-- Title -->
            <div class="w-full px-4">
              <div class="relative w-full mb-3">
                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" for="title">Title</label>
                <input type="text" id="title" name="title" :class="commonInputClass">
                <form-error :validationErrors="getTaskValidationError" name="title" />
              </div>
            </div>
  
            <!-- Description -->
            <div class="w-full px-4">
              <div class="relative w-full mb-3">
                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" for="description">Description</label>
                <textarea name="description" id="description" :class="commonInputClass" rows="4"></textarea>
                <form-error :validationErrors="getTaskValidationError" name="description" />
              </div>
            </div>

            <!-- Due Date -->
            <div class="w-full px-4">
              <div class="relative w-full mb-3">
                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" for="due_date">Due Date</label>
                <input type="datetime-local" :min="currentDateTime" id="due_date" name="due_date" :class="commonInputClass">
                <form-error :validationErrors="getTaskValidationError" name="due_date" />
              </div>
            </div>
  
            <!-- Priority -->
            <div class="w-full px-4">
              <div class="relative w-full mb-3">
                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2" for="priority">Priority</label>
                <select name="priority" id="priority" :class="commonInputClass">
                  <option value="1">Low</option>
                  <option value="2">Medium</option>
                  <option value="3">High</option>
                </select>
                <form-error :validationErrors="getUserValidationError" name="priority" />
              </div>
            </div>
  
            <!-- Submit Button -->
            <div class="w-full text-right px-4 pb-6 pt-2">
              <button type="submit" class="btn-primary text-white font-semibold btn-hover uppercase text-sm px-4 py-2 rounded">
                <span v-if="isLoading">
                  <Loader />
                </span>
                <span v-else>
                  Save Changes
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>     
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex'
  import { serializeForm } from '@/utils/SerializeForm';
  import Loader from '@/Components/Loader.vue';
  import FormError from '@/Components/FormError.vue';
      
  export default {
    components: {
      Loader,
      FormError,
    },
    data() {    
      return {
        title: "Create Task",
        currentDateTime: new Date().toISOString().slice(0, 16),
        commonInputClass: 'border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150',
      }
    },
    computed: {
      ...mapGetters(['getTaskValidationError']),
      isLoading() {
        return this.$store.state.isLoading;
      },
      userId() {
        return this.$page.props.auth.user.id
      }
    },
    created() {
      this.$store.dispatch('taskCleanUp');
    },
    methods: {
      ...mapActions(["createTask"]),
      async handleCreateTask(e) {
        try {
          e.preventDefault();
          var data = serializeForm(this.$refs.createTask);
          await this.createTask(data);
          const success = this.$store.state.isSuccess;
          if (success) {
              this.$router.push({ name: "taskList" });
          }
        }
        catch (error) {
          console.error(error);
        }
      },
    }
  }
  </script>