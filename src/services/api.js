import axios from 'axios';
// import { t } from '../i18n';
import * as authActions from '../redux/Auth';
import * as UserActions from '../redux/User';
import { store } from '../App';

const request = (options) => {
  const { API_URL = 'https://churrastri.herokuapp.com/api/v1' } = process.env;
  const { user: { data: { accessToken } } } = store.getState();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const client = axios.create({ baseURL: API_URL, timeout: 20000, headers });
  const onSuccess = (response) => {
    if (response.status !== 200) return response.status;
    return response.data;
  };

  const updateAccessToken = async () => {
    let newAccessToken;
    const { user } = await store.getState();
    const { refreshToken } = user.data;
    try {
      const { data } = await client({
        method: 'post',
        data: { refreshToken },
        url: 'auth/refresh-token',
        headers: { 'Content-Type': 'application/json' },
      });
      if (data && typeof data !== 'number') {
        newAccessToken = data.access_token;
        user.accessToken = data.access_token;
        user.refreshToken = data.refresh_token;
        await store.dispatch(UserActions.updateUserSuccess(user));
      }
      return newAccessToken;
    } catch (err) {
      await store.dispatch(authActions.resetData());
      // if (AppNavigatorRef.current) {
      //   AppNavigatorRef.current.popToTop();
      //   AppNavigatorRef.current.replace('Login');
      //   alert(t('sessionExpired'), t('yourLoginHasExpired'));
      // }
      return undefined;
    }
  };

  const onError = async (error) => {
    if (error.response && error.response.status === 401) {
      const newAccessToken = await updateAccessToken();
      if (newAccessToken) {
        const newOptions = options;
        newOptions.headers.Authorization = `Bearer ${newAccessToken}`;
        const response = await request(newOptions);
        return response;
      }
    }
    return Promise.reject(error.response || error.message);
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
