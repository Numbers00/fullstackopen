import { useEffect, useState } from 'react';

import diaryService from './services/diaryService';

import { NewDiaryEntry, NonSensitiveDiaryEntry, Weather, Visibility } from './types';

import './App.css';


function App() {
  const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>([]);
  
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
    } catch (err: unknown) {
      console.log(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className='App'>
      <h2>Add New Entry</h2>
      <form id='addDiaryEntryForm' onSubmit={addDiaryEntry}>
        <div>
          <label htmlFor='dateInput'>Date</label>
          <input type='string' id='dateInput' value={newDiaryEntry.date} onChange={e => setNewDiaryEntry({ ...newDiaryEntry, date: e.target.value })} />
        </div>
        <div>
          <label htmlFor='weatherInput'>Weather</label>
          <select id='weatherInput' value={newDiaryEntry.weather} onChange={e => setNewDiaryEntry({ ...newDiaryEntry, weather: e.target.value as Weather })}>
            {Object.values(Weather).map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor='visibilityInput'>Visibility</label>
          <select id='visibilityInput' value={newDiaryEntry.visibility} onChange={e => setNewDiaryEntry({ ...newDiaryEntry, visibility: e.target.value as Visibility })}>
            {Object.values(Visibility).map(v => <option key={v} value={v}>{v}</option>)}
          </select>
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
