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
