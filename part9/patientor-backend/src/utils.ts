import { Gender, NewPatient } from './types';


const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isString = (str: unknown): str is string => {
  return typeof str === 'string' || str instanceof String;
};

const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(gender);
};

const parseName = (name: unknown): string => {
  if (!isString(name))
    throw new Error('Incorrect or missing name');
  
  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDate(dateOfBirth))
    throw new Error('Incorrect or missing date of birth');

  return dateOfBirth;
};

const parseSSN = (ssn: unknown): string => {
  if (!isString(ssn))
    throw new Error('Incorrect or missing ssn');

  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender))
    throw new Error('Incorrect or missing gender');

  switch (gender.toLowerCase()) {
  case 'male': return Gender.Male;
  case 'female': return Gender.Female;
  case 'other': return Gender.Other;
  default: throw new Error('Invalid gender');
  }
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation))
    throw new Error('Incorrect or missing occupation');

  return occupation;
};

export const toNewPatient = (obj: unknown): NewPatient => {
  if (!obj || typeof obj !== 'object')
    throw new Error('Incorrect or missing patient data');

  if (!('name' in obj) || !('dateOfBirth' in obj) || !('ssn' in obj) || !('gender' in obj) || !('occupation' in obj))
    throw new Error('Missing patient data fields');
  
  return {
    name: parseName(obj.name),
    dateOfBirth: parseDateOfBirth(obj.dateOfBirth),
    ssn: parseSSN(obj.ssn),
    gender: parseGender(obj.gender),
    occupation: parseOccupation(obj.occupation),
    entries: []
  };
};
