// height in cm, weight in kg
const calculateBmi = (height: number, weight: number): string => {
  const bmi: number = weight / ((height / 100) ** 2);
  if (bmi < 18.5) return 'Underweight';
  else if (18.5 <= bmi && bmi < 25) return 'Normal (healthy weight)';
  else if (25 <= bmi && bmi < 30) return 'Overweight';
  else return 'Obese';
};
console.log(calculateBmi(180, 74));
