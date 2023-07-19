import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';
const getAll = () => {
  const req = axios.get(baseUrl);
  return req.then(res => res.data);
};

const getId = () => (100000 * Math.random()).toFixed(0);
const create = (anecdote) => {
  const obj = { id: getId(), content: anecdote, votes: 0 }
  const res = axios.post(baseUrl, obj);
  return res.then(res => res.data);
};

export default { getAll, create };
