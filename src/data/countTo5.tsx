// src/data/countTo5.tsx
export type CountExercise = {
  iconsCount: number;
  correctAnswer: number;
  options: number[];
};

export const countTo5Exercises: CountExercise[] = [
  { iconsCount: 1, correctAnswer: 1, options: [1, 2, 3] },
  { iconsCount: 2, correctAnswer: 2, options: [1, 2, 3] },
  { iconsCount: 3, correctAnswer: 3, options: [2, 3, 4] },
  { iconsCount: 4, correctAnswer: 4, options: [3, 4, 5] },
  { iconsCount: 5, correctAnswer: 5, options: [4, 5, 1] },
  { iconsCount: 2, correctAnswer: 2, options: [1, 2, 4] },
  { iconsCount: 3, correctAnswer: 3, options: [2, 3, 5] },
  { iconsCount: 4, correctAnswer: 4, options: [2, 4, 5] },
  { iconsCount: 1, correctAnswer: 1, options: [1, 3, 5] },
  { iconsCount: 5, correctAnswer: 5, options: [3, 4, 5] },
];
