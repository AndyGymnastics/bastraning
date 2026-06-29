import type { ExerciseDefinition } from './types';
import exerciseData from '../data/bas-exercises.json';

const catalog = exerciseData as { exercises: ExerciseDefinition[] };

export function getExercises(): ExerciseDefinition[] {
  return catalog.exercises;
}

export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return catalog.exercises.find((exercise) => exercise.id === id);
}

export function getExerciseMap(): Map<string, ExerciseDefinition> {
  return new Map(catalog.exercises.map((exercise) => [exercise.id, exercise]));
}
