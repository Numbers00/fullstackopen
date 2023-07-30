import axios from 'axios';

import { NewDiaryEntry, NonSensitiveDiaryEntry } from '../types';


const baseUrl = '/api/diaries';
const getAll = () => {
  const req = axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return req.then(res => res.data);
};

const create = (newDiaryEntry: NewDiaryEntry) => {
  const req = axios.post<NonSensitiveDiaryEntry[]>(baseUrl, newDiaryEntry);
  return req.then(res => res.data);
};

const exportedObj = {
  getAll, create
};
export default exportedObj;
