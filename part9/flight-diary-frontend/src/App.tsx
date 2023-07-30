import { useEffect, useState } from 'react';

import diaryService from './services/diaryService';

import { NonSensitiveDiaryEntry } from './types';

import './App.css';


function App() {
  const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>([]);

  const initializeDiaryEntries = async () => {
    const res = await diaryService.getAll();
    setDiaryEntries(res || []);
  };

  useEffect(() => {
    initializeDiaryEntries();
  }, []);

  return (
    <div className='App'>
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
