export type TyCheck<T> = (value: unknown) => T;

const assertType =
  <T>(wanted: string) =>
  (value: unknown): T => {
    const passed = typeof value === wanted;
    const given = typeof value;
    if (!passed) {
      throw new Error(`Type is incorrect, wanted ${wanted} but given ${given}`);
    }
    return value as T;
  };

const assertArray = <T>(value: unknown): T[] => {
  if (!Array.isArray(value)) {
    throw new Error('Type not an array');
  }
  return value as T[];
};

const fieldExists =
  (object: Record<string, unknown>) =>
  (field: string): unknown => {
    const value = object[field];
    if (value === undefined) {
      throw new Error('missing value');
    }
    return value;
  };

const fieldCheck =
  (obj: Record<string, unknown>) =>
  ([field, check]: [string, TyCheck<unknown>]): void => {
    try {
      check(fieldExists(obj)(field));
    } catch (e) {
      const parent = e as Error;
      throw new Error(`On field "${field}": ${parent.message}`);
    }
  };

type ObjectTypeChecker<T extends Record<string, unknown>> = { [P in keyof T]: TyCheck<T[P]> };

export const typeString: TyCheck<string> = assertType('string');
export const typeNumber: TyCheck<number> = assertType('number');
export const typeBoolean: TyCheck<boolean> = assertType('boolean');
export const typeObject: TyCheck<object> = assertType('object');

export const beInterface =
  <T extends Record<string, unknown>>(checker: ObjectTypeChecker<T>): TyCheck<T> =>
  (value: unknown) => {
    const obj = typeObject(value) as Record<string, unknown>;
    Object.entries(checker).forEach(fieldCheck(obj));
    return value as T;
  };

export const beArray =
  <T>(checker: TyCheck<T>): TyCheck<T[]> =>
  (value: unknown) => {
    const array = assertArray<unknown>(value);
    array.forEach(checker);
    return array as T[];
  };

export const beOption =
  <T>(checker: TyCheck<T>): TyCheck<T | undefined> =>
  (value: unknown) => {
    if (value !== undefined) {
      checker(value);
    }
    return value as T;
  };

export const typeChecker =
  <T>(typeCheck: TyCheck<T>) =>
  (value: unknown): T =>
    typeCheck(value);
