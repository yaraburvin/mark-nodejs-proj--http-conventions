import { getAllSignatures, setAllSignatures } from "./model";

describe("getSignatureByDate", () => {
  it("returns a given signature if it can find it", () => {});
});

describe("setAllSignatures", () => {
  it("reassigns the signatures to the array passed in", () => {
    // act
    setAllSignatures([
      { date: Date.now(), name: "Lisa Simpson" },
      { date: Date.now() + 1, name: "Bart Simpson" },
    ]);

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toHaveLength(2);
    expect(signatures).toMatchObject([
      { name: "Lisa Simpson" },
      { name: "Bart Simpson" },
    ]);
  });
});
