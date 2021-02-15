import { getAllSignatures, setAllSignatures } from "./model";

describe("getAllSignatures", () => {
  it("returns all signatures stored", () => {
    // setup
    setAllSignatures([
      { date: Date.now(), name: "Ada Lovelace" },
      { date: Date.now() + 1, name: "Alan Turing" },
    ]);

    // act
    const signatures = getAllSignatures();

    // assert
    expect(signatures).toHaveLength(2);
    expect(signatures).toMatchObject([
      { name: "Ada Lovelace" },
      { name: "Alan Turing" },
    ]);
  });

  it("is resistant to accidental mutation", () => {
    // setup
    const initialSignatures = [
      { date: Date.now(), name: "Harry Potter" },
      { date: Date.now() + 1, name: "Ginny Weasley" },
    ];
    setAllSignatures(initialSignatures);

    // act
    const signatures = getAllSignatures();
    initialSignatures[0].name = "oopsie";
    signatures[1].name = "whoops";

    // assert
    expect(getAllSignatures()).toMatchObject([
      { name: "Harry Potter" },
      { name: "Ginny Weasley" },
    ]);
  });
});

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
