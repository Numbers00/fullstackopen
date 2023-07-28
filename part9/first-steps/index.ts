import express from 'express';

import { calculateBmi } from './helpers';

const app = express();

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

const PORT=3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
