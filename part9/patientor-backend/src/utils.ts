import { Diagnosis, HealthCheckRating, NewEntry, Gender, NewPatient } from './types';


const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isString = (str: unknown): str is string => {
  return typeof str === 'string' || str instanceof String;
};

const isHealthCheckRating = (rating: number): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(rating);
};

const isNumber = (num: unknown): num is number => {
  return typeof num === 'number' || num instanceof Number;
};

const parseDate = (date: unknown, fieldName: string): string => {
  if (!isString(date) || !isDate(date))
    throw new Error(`Incorrect or missing ${fieldName}`);

  return date;
};

const parseDiagnosisCodes = (arr: unknown): Array<Diagnosis['code']> =>  {
  if (!Array.isArray(arr) || !arr.every(isString))
    throw new Error('Incorrect diagnosis codes');
  
  return arr;
};

const parseDischarge = (obj: unknown): { date: string, criteria: string } => {
  if (!obj || typeof obj !== 'object' || !('date' in obj && 'criteria' in obj))
    throw new Error('Incorrect or missing discharge data');

  if (!isString(obj.date) || !isDate(obj.date))
    throw new Error('Incorrect or missing discharge date');

  if (!isString(obj.criteria))
    throw new Error('Incorrect or missing discharge criteria');

  return { date: obj.date, criteria: obj.criteria };
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isNumber(rating) || !isHealthCheckRating(rating))
    throw new Error('Incorrect or missing health check rating');

  return rating;
};

const parseSickLeave = (obj: unknown): { startDate: string, endDate: string } | undefined => {
  if (!obj) return undefined;
  
  if (typeof obj !== 'object' || !('startDate' in obj && 'endDate' in obj))
    throw new Error('Incorrect or missing sick leave data');

  if (!isString(obj.startDate) || !isDate(obj.startDate))
    throw new Error('Incorrect or missing sick leave start date');

  if (!isString(obj.endDate) || !isDate(obj.endDate))
    throw new Error('Incorrect or missing sick leave end date');

  return { startDate: obj.startDate, endDate: obj.endDate };
};

const parseString = (str: unknown, fieldName: string): string => {
  if (!isString(str))
    throw new Error(`Incorrect or missing ${fieldName}`);

  return str;
};

// const parseType = (type: unknown): 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare' => {
//   if (!isString(type))
//     throw new Error('Incorrect or missing entry type');

//   if (!['HealthCheck', 'Hospital', 'OccupationalHealthcare'].includes(type))
//     throw new Error('Invalid entry type');

//   return type as 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare';
// };

export const toNewEntry = (obj: unknown): NewEntry => {
  if (!obj || typeof obj !== 'object')
    throw new Error('Incorrect or missing entry data');

  if (!('type' in obj && 'description' in obj && 'date' in obj && 'specialist' in obj))
    throw new Error('Missing entry data fields');
  
  const initialEntry = {
    description: parseString(obj.description, 'description'),
    date: parseDate(obj.date, 'date'),
    specialist: parseString(obj.specialist, 'specialist'),
    diagnosisCodes: 'diagnosisCodes' in obj ? parseDiagnosisCodes(obj.diagnosisCodes) : undefined
  };
  switch (obj.type) {
  case 'HealthCheck':
    if (!('healthCheckRating' in obj))
      throw new Error('Missing health check rating field');

    return {
      ...initialEntry,
      type: 'HealthCheck',
      healthCheckRating: parseHealthCheckRating(obj.healthCheckRating)
    };
  case 'Hospital':
    if (!('discharge' in obj))
      throw new Error('Missing discharge field');

    return {
      ...initialEntry,
      type: 'Hospital',
      discharge: parseDischarge(obj.discharge)
    };
  case 'OccupationalHealthcare':
    if (!('employerName' in obj))
      throw new Error('Missing employer name field');

    return {
      ...initialEntry,
      type: 'OccupationalHealthcare',
      employerName: parseString(obj.employerName, 'employer name'),
      sickLeave: 'sickLeave' in obj ? parseSickLeave(obj.sickLeave) : undefined
    };
  default:
    throw new Error('Invalid entry type');
  }
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

const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(gender);
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

  if (!('name' in obj && 'dateOfBirth' in obj && 'ssn' in obj && 'gender' in obj && 'occupation' in obj))
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
