const parseArgs = (args: string[]): { height: number, weight: number } => {
  if (args.length != 4) throw new Error(`You need to provide 2 arguments, you provided ${args.length - 2}`);
  const numArgs = [args[2], args[3]].map(arg => {
    if (isNaN(Number(arg))) throw new Error(`Provided argument "${arg}" should be a number`);
    return Number(arg);
  });
  return {
    height: numArgs[0],
    weight: numArgs[1]
  }
};

// height in cm, weight in kg
const calculateBmi = (height: number, weight: number): string => {
  const bmi: number = weight / ((height / 100) ** 2);
  if (bmi < 18.5) return 'Underweight';
  else if (18.5 <= bmi && bmi < 25) return 'Normal (healthy weight)';
  else if (25 <= bmi && bmi < 30) return 'Overweight';
  else return 'Obese';
};

try {
  const { height, weight } = parseArgs(process.argv);
  console.log(calculateBmi(height, weight));
} catch (err: unknown) {
  let errorMessage = err instanceof Error ? err.message : 'Unknown error';
  console.log(`Error: ${errorMessage}`);
}

export {};
