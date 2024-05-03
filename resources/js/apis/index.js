/* PREFIX */
const task = "task";

const api = {
  task_scheduler: {
    get: {
      endpoint: task + "get",
      method: "GET",
    },
    create: {
      endpoint: task + "create",
      method: "POST",
    },
    update: {
      endpoint: task + "update",
      method: "POST",
    },
    delete: {
      endpoint: task + "delete",
      method: "POST",
    },
  },
};

export default api;
