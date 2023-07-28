export const calculateBmi = (height: number, weight: number): string => {
  const bmi: number = weight / ((height / 100) ** 2);
  if (bmi < 18.5) return 'Underweight';
  else if (18.5 <= bmi && bmi < 25) return 'Normal (healthy weight)';
  else if (25 <= bmi && bmi < 30) return 'Overweight';
  else return 'Obese';
};

interface ExerciseValues {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (dailyExerTime: number[], targetDaily: number): ExerciseValues => {
  const dailyAvg = dailyExerTime.reduce((a, b) => a + b, 0) / dailyExerTime.length;
  const rating = dailyAvg < targetDaily * 0.75 ? 1 : dailyAvg < targetDaily ? 2 : 3;
  const ratingDescription = rating === 1 ? 'work harder next time'
    : rating === 2 ? 'not too bad but could be better'
    : 'you reached your target, keep it up!';
  return {
    periodLength: dailyExerTime.length,
    trainingDays: dailyExerTime.filter(d => d > 0).length,
    success: dailyAvg >= targetDaily,
    rating,
    ratingDescription,
    target: targetDaily,
    average: dailyAvg
  };
};
