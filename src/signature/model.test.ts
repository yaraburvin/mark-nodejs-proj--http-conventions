import {
  getAllSignatures,
  findSignatureByDate,
  setAllSignatures,
  findSignatureByDateOrFail,
  insertSignature,
  findSignature,
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

describe("findSignature", () => {
  it("returns the first signature that matches the data passed in", () => {
    // setup
    const [dateOne, dateTwo, dateThree, dateFour] = [
      // use addition to ensure different milliseconds
      Date.now(),
      Date.now() + 1,
      Date.now() + 2,
      Date.now() + 3,
    ];
    const referenceSignatures = [
      { date: dateOne, name: "Apple" },
      { date: dateTwo, name: "Apple", message: "Not my first signature" },
      { date: dateThree, name: "Carrot" },
      { date: dateFour, name: "Carrot", message: "Not my first message" },
    ];
    setAllSignatures(referenceSignatures);

    // act
    const emptyMatcher = findSignature({});
    const matchOnSecondDate = findSignature({ date: dateTwo });
    const matchOnCarrotName = findSignature({ name: "Carrot" });
    const matchOnCarrotNameAndMessage = findSignature({
      name: "Carrot",
      message: "Not my first message",
    });
    const shouldNotMatch = findSignature({ date: dateOne, name: "Carrot" });

    // assert
    // empty matcher just finds the first one
    expect(emptyMatcher).toStrictEqual(referenceSignatures[0]);
    expect(matchOnSecondDate).toStrictEqual(referenceSignatures[1]);
    expect(matchOnCarrotName).toStrictEqual(referenceSignatures[2]);
    expect(matchOnCarrotNameAndMessage).toStrictEqual(referenceSignatures[3]);
    expect(shouldNotMatch).toBeNull();
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

describe("findSignatureByDateOrFail", () => {
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
    const sigOne = findSignatureByDateOrFail(dateOne);
    const sigTwo = findSignatureByDateOrFail(dateTwo);
    const sigThree = findSignatureByDateOrFail(dateThree);

    // assert
    expect(sigOne).toHaveProperty("name", "Apple");
    expect(sigTwo).toHaveProperty("name", "Banana");
    expect(sigThree).toHaveProperty("name", "Carrot");
  });

  it("throws an error no signature exists with that date", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ date: presentDate, name: "Apple" }]);

    // assert
    expect(() => {
      findSignatureByDateOrFail(presentDate - 1000);
    }).toThrowError();
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

describe("insertSignature", () => {
  it("adds a signature into the collection and returns it with a date property", () => {
    // setup
    setAllSignatures([
      // use date in past to ensure uniqueness
      { date: Date.now() - 1, name: "Horrid Henry" },
    ]);

    // act
    const signatureToInsert = { name: "Perfect Peter" };
    const insertedSignature = insertSignature({ name: "Perfect Peter" });

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toHaveLength(2);
    expect(signatures[1]).toMatchObject(signatureToInsert);
    expect(signatures[1]).toMatchObject(insertedSignature);
    // has added a date number
    expect(typeof insertedSignature.date).toBe("number");
    // has not added it onto the original object
    expect(signatureToInsert).not.toHaveProperty("date");
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
