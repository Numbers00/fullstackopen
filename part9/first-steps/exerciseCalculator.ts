const parseArgs = (args: string[]): { dailyExerTime: number[], targetDaily: number } => {
  if (args.length < 4) throw new Error(`You need to provide at least 2 arguments, you provided ${args.length - 2}`);
  const numArgs = args.slice(2).map(arg => {
    if (isNaN(Number(arg))) throw new Error(`Provided argument "${arg}" should be a number`);
    return Number(arg);
  });
  return {
    dailyExerTime: numArgs.slice(1),
    targetDaily: numArgs[0]
  }
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

const calculateExercises = (dailyExerTime: number[], targetDaily: number): ExerciseValues => {
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
  }
};

try {
  const { dailyExerTime, targetDaily } = parseArgs(process.argv);
  console.log(calculateExercises(dailyExerTime, targetDaily));
} catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  console.log(`Error: ${errorMessage}`);
}

export {};
