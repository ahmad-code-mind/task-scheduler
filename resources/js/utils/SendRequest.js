import config from '../config';
import api from '../apis';
import { successToast, dangerToast } from './toast';
import { getApiHeader } from '@/utils/ApiHeader';

export async function sendRequest(endpoint, method, data, commit) {
  try {
    commit("SET_LOADING", true); 
    commit("SET_SUCCESS", false);

    const response = await fetch(config.API_BASE_URL + endpoint, {
      method,
      headers: getApiHeader(),
      body: JSON.stringify(data),
    });

    const responseBody = await response.json();
    if (responseBody.status === 200) {
      commit("SET_LOADING", false);
      commit("SET_SUCCESS", true);
      successToast(responseBody.message);
    } else {
      commit("SET_LOADING", false);
      commit("SET_SUCCESS", false);
      setTimeout(() => {
        commit("SET_VALIDATION_ERROR", responseBody.data);
      }, 500);
      dangerToast(responseBody.message);
    }
  } catch (error) {
    commit("SET_LOADING", false);
    commit("SET_SUCCESS", false);
    console.error(error);
  }
}
