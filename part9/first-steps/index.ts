import express from 'express';

import { calculateBmi, calculateExercises } from './helpers';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  if (!height || !weight)
    return res.status(400).json({ error: 'malformatted parameters' });

  const numHeight = Number(height);
  const numWeight = Number(weight);
  if (isNaN(numHeight) || isNaN(numWeight))
    return res.status(400).json({ error: 'malformatted parameters' });

    const classification = calculateBmi(numHeight, numWeight);
    return res.send(classification);
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises: dailyExerTime, target } = req.body;

  if (!dailyExerTime || !target)
    return res.status(400).json({ error: 'parameters missing' });

  if (!Array.isArray(dailyExerTime) || dailyExerTime.some(t => isNaN(Number(t))) || isNaN(Number(target)))
    return res.status(400).json({ error: 'malformatted parameters' });

  const exerciseValues = calculateExercises(dailyExerTime.map(t => Number(t)), Number(target));
  return res.json(exerciseValues);
});

const PORT=3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
