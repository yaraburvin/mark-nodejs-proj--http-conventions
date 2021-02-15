interface Signature {
  /**
   * Treated like an id, the return value of Date.now()
   *
   * (Making the assumption that no more than 1 signature is added in a given millisecond)
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
   */
  date: number;
  name: string;
  message?: string;
}
