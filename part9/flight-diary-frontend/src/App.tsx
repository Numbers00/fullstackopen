import axios from 'axios';

import { useEffect, useState } from 'react';

import diaryService from './services/diaryService';

import { ValidationError, NewDiaryEntry, NonSensitiveDiaryEntry, Weather, Visibility } from './types';
import { isValidationError } from './utils';

import './App.css';


function App() {
  const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialNewDiary = {
    date: '',
    weather: Weather.Sunny,
    visibility: Visibility.Good,
    comment: ''
  };
  const [newDiaryEntry, setNewDiaryEntry] = useState<NewDiaryEntry>({ ...initialNewDiary });

  const initializeDiaryEntries = async () => {
    const allDiaryEntries = await diaryService.getAll();
    setDiaryEntries(allDiaryEntries || []);
  };

  useEffect(() => {
    initializeDiaryEntries();
  }, []);

  const addDiaryEntry = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const createdDiary = await diaryService.create(newDiaryEntry);
      setDiaryEntries(diaryEntries.concat(createdDiary));
      setNewDiaryEntry({ ...initialNewDiary });
    } catch (error: unknown) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        if (error.response && isValidationError(error.response.data)) {
          const validationError: ValidationError = error.response.data;
          setErrorMessage(validationError.message);
          setTimeout(() => setErrorMessage(null), 5000);
        } else
          console.log('Unknown axios error');
      } else if (error instanceof Error)
        console.log(error.message);
      else
        console.log('Unknown error');
    }
  };

  return (
    <div className='App'>
      <h2>Add New Entry</h2>
      {errorMessage && <p style={{ color: 'red' }}>{ errorMessage }</p>}
      <form id='addDiaryEntryForm' onSubmit={addDiaryEntry}>
        <div>
          <label htmlFor='dateInput'>Date</label>
          <input type='date' id='dateInput' value={newDiaryEntry.date} onChange={e => setNewDiaryEntry({ ...newDiaryEntry, date: e.target.value })} />
        </div>
        <div>
          <span style={{ marginRight: 8 }}>Weather</span>
          {Object.values(Weather).map(w => (
            <>
              <label key={w + 'Label'} htmlFor={w + 'WeatherRadio'}>{ w }</label>
              <input
                type='radio'
                id={w + 'WeatherRadio'}
                key={w + 'Radio'}
                name='weatherRadio'
                onChange={() => setNewDiaryEntry({ ...newDiaryEntry, weather: w })}
                checked={newDiaryEntry.weather === w}
              />
            </>
          ))}
        </div>
        <div>
          <span style={{ marginRight: 8 }}>Visibility</span>
          {Object.values(Visibility).map(v => (
            <>
              <label key={v + 'Label'} htmlFor={v + 'VisibilityRadio'}>{ v }</label>
              <input
                type='radio'
                id={v + 'VisibilityRadio'}
                key={v + 'Radio'}
                name='visibilityRadio'
                onChange={() => setNewDiaryEntry({ ...newDiaryEntry, visibility: v })}
                checked={newDiaryEntry.visibility === v}
              />
            </>
          ))}
        </div>
        <div>
          <label htmlFor='commentInput'>Comment</label>
          <textarea id='commentInput' value={newDiaryEntry.comment} onChange={e => setNewDiaryEntry({ ...newDiaryEntry, comment: e.target.value })} />
        </div>
        <button type='submit'>Add Entry</button>
      </form>
      <h2>Diary Entries</h2>
      {diaryEntries.map((d, i) => (
        <div key={i}>
          <h3>{ d.date }</h3>
          <p>
            visibility: { d.visibility }<br />
            weather: { d.weather }
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
