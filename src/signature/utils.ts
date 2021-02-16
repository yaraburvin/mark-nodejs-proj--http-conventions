/**
 * Checks whether the second argument is an object with subset properties of the first object, by checking for shallow equality between the key-value pairs.
 *
 * @param wholeObject
 * @param partialMatcher
 */
export function isObjectSubset<T>(
  wholeObject: T,
  partialMatcher: Partial<T>
): boolean {
  const matcherEntries = ObjectEntries(partialMatcher);
  for (let [key, value] of matcherEntries) {
    if (wholeObject[key] !== value) return false;
  }
  return true;
}

/**
 * An array of [key, value] in T
 * @param T the object to extract entries from
 * @param K a key of T
 */
type Entry<T, K extends keyof T> = [K, T[K]];

/**
 * For if you happen to know and are absolutely sure that an object has only the keys known about by the compiler
 *
 * see: https://stackoverflow.com/questions/62053739/preserve-type-when-using-object-entries
 */
export function ObjectEntries<T extends object>(obj: T): Entry<T, keyof T>[] {
  return Object.entries(obj) as Entry<T, keyof T>[];
}

export function protectFromMutations<T extends object>(objects: T[]): T[] {
  /**
   * Uses a spread inside of a map to prevent
   *  accidental mutation: shallow copy of each
   *  signature and then a new array containing them all
   */
  return objects.map((object) => ({
    ...object,
  }));
}
