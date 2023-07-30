import axios from 'axios';

import { NonSensitiveDiaryEntry } from '../types';


const baseUrl = '/api/diaries';
const getAll = () => {
  const req = axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return req.then(res => res.data);
};

const exportedObj = {
  getAll
};
export default exportedObj;
