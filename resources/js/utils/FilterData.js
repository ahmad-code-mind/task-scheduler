import config from '../config';
import { successToast, dangerToast } from './toast';
import { getApiHeader } from '@/utils/ApiHeader';

export const createEndpoint = (data, endpoint) => {
    const starterUrl = config.API_BASE_URL + endpoint;
    const page = data.page ?? 0;
    const url = `${starterUrl}?page=${page}&per_page=${data.per_page}&search=${data.search}`;
    return url;
};

export const fetchData = async (commit, url, method) => {
    try {    
        const requestOptions = {
            method: method,
            headers: getApiHeader(),
        };
    
        const response = await fetch(url, requestOptions);
        const responseBody = await response.json();
    
        if (responseBody.status === 200) {
            return responseBody.data;
        } else {
            dangerToast(responseBody.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
};