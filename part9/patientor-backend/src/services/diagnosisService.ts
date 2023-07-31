import diagnoses from "../data/diagnoses";

import { Diagnosis } from "../types";


const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const getByCode = (codes: string[]): Diagnosis[] => {
  return diagnoses.filter(d => codes.includes(d.code));
};

export default {
  getDiagnoses, getByCode
};
