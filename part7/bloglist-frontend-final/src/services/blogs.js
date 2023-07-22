import axios from 'axios';


const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const req = axios.get(baseUrl);
  return req.then(res => res.data);
};

const get = id => {
  const req = axios.get(`${baseUrl}/${id}`);
  return req.then(res => res.data);
};

const create = blog => {
  const config = {
    headers: { Authorization: token },
  };

  const req = axios.post(baseUrl, blog, config);
  return req.then(res => res.data);
};

const update = async blog => {
  const config = {
    headers: { Authorization: token },
  };

  const req = axios.put(`${baseUrl}/${blog.id}`, blog, config);
  return req.then(res => res.data);
};

const remove = async blog => {
  const config = {
    headers: { Authorization: token },
  };

  const req = axios.delete(`${baseUrl}/${blog.id}`, config);
  return req.then(res => res.data);
};

export default { setToken, getAll, get, create, update, remove };
