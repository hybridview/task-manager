import axios from 'axios';
import toast from 'shared/utils/toast';
import { createBrowserHistory } from 'history';
import { objectToQueryString } from 'shared/utils/url';
import { getStoredAuthToken, removeStoredAuthToken } from 'shared/utils/authToken';

const defaults = {
  baseURL: 'http://localhost:3000', // process.env.API_URL ||
  headers: () => ({
    'Content-Type': 'application/json',
    Authorization: getStoredAuthToken() ? `Bearer ${getStoredAuthToken()}` : undefined,
  }),
  error: {
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong. Please check your internet connection or contact our support.',
    status: 503,
    data: {},
  },
};

const api = (method, url, variables) =>
 axios({
  url: `${defaults.baseURL}${url}`,
  method,
  headers: defaults.headers(),
   params: method === 'get' ? variables : undefined,
   data: method !== 'get' ? variables : undefined,
   paramsSerializer: {
     serialize: (params, options) => { return objectToQueryString(params, options) }, // mimic pre 1.x behavior and send entire params object to a custom serializer func. Allows consumer to control how params are serialized.
     indexes: false // array indexes format (null - no brackets, false (default) - empty brackets, true - brackets with indexes)
   },
})
.then(
  response => {
    return Promise.resolve(response.data);
  },
  error => {
    if (error.response) {
      if (error.response.data.error.code === 'INVALID_TOKEN') {
        removeStoredAuthToken();
        createBrowserHistory().push('/authenticate');
      } else {
        return Promise.reject(error.response.data.error);
      }
    } else {
      return Promise.reject(defaults.error);
    }
  },
);


const optimisticUpdate = async (url, { updatedFields, currentFields, setLocalData }) => {
  try {
    setLocalData(updatedFields);
    await api('put', url, updatedFields);
  } catch (error) {
    setLocalData(currentFields);
    toast.error(error);
  }
};

export default {
  get: (...args) => api('get', ...args),
  post: (...args) => api('post', ...args),
  put: (...args) => api('put', ...args),
  patch: (...args) => api('patch', ...args),
  delete: (...args) => api('delete', ...args),
  optimisticUpdate,
};
