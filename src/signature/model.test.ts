import {
  getAllSignatures,
  findSignatureByDate,
  setAllSignatures,
} from "./model";

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

describe("findSignatureByDate", () => {
  it("returns a given signature if it can find it", () => {
    // setup
    const [dateOne, dateTwo, dateThree] = [
      // use addition to ensure different milliseconds
      Date.now(),
      Date.now() + 1,
      Date.now() + 2,
    ];
    setAllSignatures([
      { date: dateOne, name: "Apple" },
      { date: dateTwo, name: "Banana" },
      { date: dateThree, name: "Carrot" },
    ]);

    // act
    const sigOne = findSignatureByDate(dateOne);
    const sigTwo = findSignatureByDate(dateTwo);
    const sigThree = findSignatureByDate(dateThree);

    // assert
    expect(sigOne).toHaveProperty("name", "Apple");
    expect(sigTwo).toHaveProperty("name", "Banana");
    expect(sigThree).toHaveProperty("name", "Carrot");
  });

  it("returns null if no signature exists with that date", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ date: presentDate, name: "Apple" }]);

    // act
    const result = findSignatureByDate(presentDate - 1000);

    // assert
    expect(result).toBeNull();
  });

  it("is resistant to accidental mutation", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ date: presentDate, name: "Apple" }]);

    // act
    const signature = findSignatureByDate(presentDate);
    signature!.name = "WAKKA WAKKA";

    // assert: still finds a name of Apple
    expect(findSignatureByDate(presentDate)).toHaveProperty("name", "Apple");
  });
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
