/* eslint-disable */
import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  const url =
    type === 'password'
      ? 'http://localhost:3002/api/v1/users/updateMyPassword'
      : 'http://localhost:3002/api/v1/users/updateMe';
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
