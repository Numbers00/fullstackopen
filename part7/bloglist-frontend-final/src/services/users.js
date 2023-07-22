import axios from 'axios';


const baseUrl = '/api/users';

const getAll = () => {
  const req = axios.get(baseUrl);
  return req.then(res => res.data);
};

const get = id => {
  const req = axios.get(`${baseUrl}/${id}`);
  return req.then(res => res.data);
};

export default { getAll, get };
