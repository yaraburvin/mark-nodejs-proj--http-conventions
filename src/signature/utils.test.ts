import { isObjectSubset } from "./utils";

describe("isObjectSubset", () => {
  describe("positive cases", () => {
    it("always matches when the second is an empty object, since zero properties is always a subset of any object", () => {
      expect(isObjectSubset({}, {})).toBe(true);
      expect(isObjectSubset({ message: "hi" }, {})).toBe(true);
      expect(isObjectSubset({ message: "hi", count: 4 }, {})).toBe(true);
    });

    it("matches when the second is a strict subset of properties", () => {
      expect(isObjectSubset({ message: "hi" }, { message: "hi" })).toBe(true);
      expect(
        isObjectSubset({ message: "hi", count: 4 }, { message: "hi" })
      ).toBe(true);
      expect(
        isObjectSubset({ message: "hi", count: 4 }, { message: "hi", count: 4 })
      ).toBe(true);
    });
  });

  describe("negative cases", () => {
    it("does not match when the second object has defined properties not in the first", () => {
      expect(isObjectSubset({}, { message: "hi" })).toBe(false);
      expect(
        // @ts-ignore - checking runtime behaviour
        isObjectSubset({ message: "hi" }, { message: "hi", count: 4 })
      ).toBe(false);
    });

    it("does not match when the second object has different values for a key", () => {
      expect(isObjectSubset({ message: "hi" }, { message: "hello" })).toBe(
        false
      );
      expect(
        isObjectSubset({ message: "hi", count: 2 }, { message: "hi", count: 1 })
      ).toBe(false);
    });
  });
});
