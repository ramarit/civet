/**
 * Common utility types
 */

// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Make all properties required recursively
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Make specific keys optional
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific keys required
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Extract keys of a type that are of a specific type
export type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

// Ensure at least one property is present
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Ensure exactly one property is present
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

// Nullable type
export type Nullable<T> = T | null;

// Await the type of a promise
export type Awaited<T> = T extends Promise<infer U> ? U : T;

// Extract the element type from an array
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Make a type mutable (remove readonly)
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Make a type immutable (add readonly)
export type Immutable<T> = {
  readonly [P in keyof T]: T[P];
};

// Result type for operations that can fail
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Async result type
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

// Type-safe environment variables
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL: string;
  REDIS_URL: string;
  API_BASE_URL: string;
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  JWT_SECRET: string;
  [key: string]: string | undefined;
}

// Type guards
export const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isArray = <T = unknown>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};
