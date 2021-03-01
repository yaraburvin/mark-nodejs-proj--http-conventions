
/**
 * Sets, or resets, a Jest mock implementation of a function - especially intended for use in a `beforeEach` Jest hook.
 * 
 * We use mocks in this way so that we can do focused unit tests.
 * 
 * @param fn - the function which we have mocked
 * @param mockVersion  - the mock implementation we are using for the function
 */
export const resetMockFor = (fn: Function, mockVersion: (...args: any) => any) => {
// type guard so we can use the mock API inside
  if (jest.isMockFunction(fn)) {
    // Reset the mock call and return history before each test
    fn.mockReset();

    // mock behaviour for tests
    fn.mockImplementation(mockVersion);
  }
}
