import axios from 'axios';
const BASE_URL = 'http://localhost:3001/persons';

const getAll = () => {
  return axios
          .get(BASE_URL)
          .then(response => response.data);
}

const create = (newPerson) => {
  return axios
          .post(BASE_URL, newPerson)
          .then(response => response.data);
}

const update = (id, newPerson) => {
  return axios
          .put(`${BASE_URL}/${id}`, newPerson)
          .then(response => response.data);
}

const remove = (id) => {
  return axios
          .delete(`${BASE_URL}/${id}`)
          .then(response => response.data);
}

const exportedObject = {getAll, create, update, remove};

export default exportedObject;
