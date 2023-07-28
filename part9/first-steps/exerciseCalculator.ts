interface ExerciseValues {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (dailyExerTime: number[], targetDaily: number): ExerciseValues => {
  const dailyAvg = dailyExerTime.reduce((a, b) => a + b, 0) / dailyExerTime.length;
  const rating = dailyAvg < targetDaily * 0.75 ? 1 : dailyAvg < targetDaily ? 2 : 3;
  const ratingDescription = rating === 1 ? 'work harder next time'
    : rating === 2 ? 'not bad but could be better'
    : 'you reached your target, keep it up!';
  return {
    periodLength: dailyExerTime.length,
    trainingDays: dailyExerTime.filter(d => d > 0).length,
    success: dailyAvg >= targetDaily,
    rating,
    ratingDescription,
    target: targetDaily,
    average: dailyAvg
  }
};
console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
