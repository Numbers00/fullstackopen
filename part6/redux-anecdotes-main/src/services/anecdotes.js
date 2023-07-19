import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';
const getAll = () => {
  const req = axios.get(baseUrl);
  return req.then(res => res.data);
};

const create = anecdote => {
  const req = axios.post(baseUrl, anecdote);
  return req.then(res => res.data);
};

const update = (id, anecdote) => {
  const req = axios.put(`${baseUrl}/${id}`, anecdote);
  return req.then(res => res.data);
}

export default { getAll, create, update };
