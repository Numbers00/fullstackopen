import axios from 'axios';
const baseUrl = '/api/login';

const login = credentials => {
  const req = axios.post(baseUrl, credentials);
  return req.then(res => res.data);
};

export default { login };
