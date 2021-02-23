import {
  getAllSignatures,
  findSignatureByEpoch,
  setAllSignatures,
  findSignatureByEpochOrFail,
  insertSignature,
  findSignature,
  findSignatureOrFail,
  updateSignature,
  findIndexOfSignature,
  removeSignature,
  updateSignatureByEpoch,
  removeSignatureByEpoch,
} from "./model";

describe("getAllSignatures", () => {
  it("returns all signatures stored", () => {
    // setup
    setAllSignatures([
      { epochMs: Date.now(), name: "Ada Lovelace" },
      { epochMs: Date.now() + 1, name: "Alan Turing" },
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
      { epochMs: Date.now(), name: "Harry Potter" },
      { epochMs: Date.now() + 1, name: "Ginny Weasley" },
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

describe("findIndexOfSignature", () => {
  it("returns the index of the first signature that matches the data passed in", () => {
    // setup
    const [dateOne, dateTwo, dateThree, dateFour] = [
      // use addition to ensure different milliseconds
      Date.now(),
      Date.now() + 1,
      Date.now() + 2,
      Date.now() + 3,
    ];
    const referenceSignatures = [
      { epochMs: dateOne, name: "Apple" },
      { epochMs: dateTwo, name: "Apple", message: "Not my first signature" },
      { epochMs: dateThree, name: "Carrot" },
      { epochMs: dateFour, name: "Carrot", message: "Not my first message" },
    ];
    setAllSignatures(referenceSignatures);

    // act
    const emptyMatcher = findIndexOfSignature({});
    const matchOnSecondDate = findIndexOfSignature({ epochMs: dateTwo });
    const matchOnCarrotName = findIndexOfSignature({ name: "Carrot" });
    const matchOnCarrotNameAndMessage = findIndexOfSignature({
      name: "Carrot",
      message: "Not my first message",
    });
    const shouldNotMatch = findIndexOfSignature({
      epochMs: dateOne,
      name: "Carrot",
    });

    // assert
    // design decision: empty matcher just finds the first one
    expect(emptyMatcher).toStrictEqual(0);
    expect(matchOnSecondDate).toStrictEqual(1);
    expect(matchOnCarrotName).toStrictEqual(2);
    expect(matchOnCarrotNameAndMessage).toStrictEqual(3);
    expect(shouldNotMatch).toBeNull();
  });

  it("returns null if no signature exists with that date", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ epochMs: presentDate, name: "Apple" }]);

    // act
    const result = findIndexOfSignature({ name: "Carrot" });

    // assert
    expect(result).toBeNull();
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
      { epochMs: dateOne, name: "Apple" },
      { epochMs: dateTwo, name: "Apple", message: "Not my first signature" },
      { epochMs: dateThree, name: "Carrot" },
      { epochMs: dateFour, name: "Carrot", message: "Not my first message" },
    ];
    setAllSignatures(referenceSignatures);

    // act
    const emptyMatcher = findSignature({});
    const matchOnSecondDate = findSignature({ epochMs: dateTwo });
    const matchOnCarrotName = findSignature({ name: "Carrot" });
    const matchOnCarrotNameAndMessage = findSignature({
      name: "Carrot",
      message: "Not my first message",
    });
    const shouldNotMatch = findSignature({ epochMs: dateOne, name: "Carrot" });

    // assert
    // design decision: empty matcher just finds the first one
    expect(emptyMatcher).toStrictEqual(referenceSignatures[0]);
    expect(matchOnSecondDate).toStrictEqual(referenceSignatures[1]);
    expect(matchOnCarrotName).toStrictEqual(referenceSignatures[2]);
    expect(matchOnCarrotNameAndMessage).toStrictEqual(referenceSignatures[3]);
    expect(shouldNotMatch).toBeNull();
  });

  it("returns null if no matching signature exists", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ epochMs: presentDate, name: "Apple" }]);

    // act
    const result = findSignature({ name: "Carrot" });

    // assert
    expect(result).toBeNull();
  });

  it("is resistant to accidental mutation", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ epochMs: presentDate, name: "Apple" }]);

    // act
    const signature = findSignature({ epochMs: presentDate });
    signature!.name = "WAKKA WAKKA";

    // assert: still finds a name of Apple
    expect(findSignature({ epochMs: presentDate })).toHaveProperty(
      "name",
      "Apple"
    );
  });
});

describe("findSignatureByEpoch", () => {
  it("returns a given signature if it can find it", () => {
    // setup
    const [dateOne, dateTwo, dateThree] = [
      // use addition to ensure different milliseconds
      Date.now(),
      Date.now() + 1,
      Date.now() + 2,
    ];
    setAllSignatures([
      { epochMs: dateOne, name: "Apple" },
      { epochMs: dateTwo, name: "Banana" },
      { epochMs: dateThree, name: "Carrot" },
    ]);

    // act
    const sigOne = findSignatureByEpoch(dateOne);
    const sigTwo = findSignatureByEpoch(dateTwo);
    const sigThree = findSignatureByEpoch(dateThree);

    // assert
    expect(sigOne).toHaveProperty("name", "Apple");
    expect(sigTwo).toHaveProperty("name", "Banana");
    expect(sigThree).toHaveProperty("name", "Carrot");
  });

  it("returns null if no signature exists with that date", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ epochMs: presentDate, name: "Apple" }]);

    // act
    const result = findSignatureByEpoch(presentDate - 1000);

    // assert
    expect(result).toBeNull();
  });

  it("is resistant to accidental mutation", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ epochMs: presentDate, name: "Apple" }]);

    // act
    const signature = findSignatureByEpoch(presentDate);
    signature!.name = "WAKKA WAKKA";

    // assert: still finds a name of Apple
    expect(findSignatureByEpoch(presentDate)).toHaveProperty("name", "Apple");
  });
});

describe("findSignatureByEpochOrFail", () => {
  it("returns a given signature if it can find it", () => {
    // setup
    const [dateOne, dateTwo, dateThree] = [
      // use addition to ensure different milliseconds
      Date.now(),
      Date.now() + 1,
      Date.now() + 2,
    ];
    setAllSignatures([
      { epochMs: dateOne, name: "Apple" },
      { epochMs: dateTwo, name: "Banana" },
      { epochMs: dateThree, name: "Carrot" },
    ]);

    // act
    const sigOne = findSignatureByEpochOrFail(dateOne);
    const sigTwo = findSignatureByEpochOrFail(dateTwo);
    const sigThree = findSignatureByEpochOrFail(dateThree);

    // assert
    expect(sigOne).toHaveProperty("name", "Apple");
    expect(sigTwo).toHaveProperty("name", "Banana");
    expect(sigThree).toHaveProperty("name", "Carrot");
  });

  it("throws an error no signature exists with that date", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ epochMs: presentDate, name: "Apple" }]);

    // assert
    expect(() => {
      findSignatureByEpochOrFail(presentDate - 1000);
    }).toThrowError();
  });

  it("is resistant to accidental mutation", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ epochMs: presentDate, name: "Apple" }]);

    // act
    const signature = findSignatureByEpochOrFail(presentDate);
    signature!.name = "WAKKA WAKKA";

    // assert: still finds a name of Apple
    expect(findSignatureByEpochOrFail(presentDate)).toHaveProperty(
      "name",
      "Apple"
    );
  });
});

describe("findSignatureOrFail", () => {
  it("returns a given signature if it can find it", () => {
    // setup
    const [dateOne, dateTwo, dateThree] = [
      // use addition to ensure different milliseconds
      Date.now(),
      Date.now() + 1,
      Date.now() + 2,
    ];
    const referenceSignatures = [
      { epochMs: dateOne, name: "Apple" },
      { epochMs: dateTwo, name: "Banana", message: "holla" },
      { epochMs: dateThree, name: "Carrot", message: "holla" },
    ];
    setAllSignatures(referenceSignatures);

    // act
    const sigOne = findSignatureOrFail({ name: "Apple" });
    const sigTwo = findSignatureOrFail({ message: "holla" });
    const sigThree = findSignatureOrFail({ name: "Carrot", message: "holla" });

    // assert
    expect(sigOne).toStrictEqual(referenceSignatures[0]);
    expect(sigTwo).toStrictEqual(referenceSignatures[1]);
    expect(sigThree).toStrictEqual(referenceSignatures[2]);
  });

  it("throws an error no signature exists with that date", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ epochMs: presentDate, name: "Apple" }]);

    // assert
    expect(() => {
      findSignatureOrFail({ name: "Date" });
    }).toThrowError();
  });

  it("is resistant to accidental mutation", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([{ epochMs: presentDate, name: "Apple" }]);

    // act
    const signature = findSignatureOrFail({ epochMs: presentDate });
    signature!.name = "WAKKA WAKKA";

    // assert: still finds a name of Apple
    expect(findSignatureOrFail({ epochMs: presentDate })).toHaveProperty(
      "name",
      "Apple"
    );
  });
});

describe("insertSignature", () => {
  it("adds a signature into the collection and returns it with a date property", () => {
    // setup
    setAllSignatures([
      // use date in past to ensure uniqueness
      { epochMs: Date.now() - 1, name: "Horrid Henry" },
    ]);

    // act
    const signatureToInsert = { name: "Perfect Peter" };
    const insertedSignature = insertSignature({ name: "Perfect Peter" });

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toHaveLength(2);
    expect(signatures[1]).toMatchObject(signatureToInsert);
    expect(signatures[1]).toMatchObject(insertedSignature);
    // has added an epochMs number
    expect(typeof insertedSignature.epochMs).toBe("number");
    // has not added it onto the original object
    expect(signatureToInsert).not.toHaveProperty("date");
  });
});

describe("removeSignature", () => {
  test("when there is a matching signature, it remove it and returns true", () => {
    // setup
    setAllSignatures([
      { epochMs: Date.now(), name: "Ada Lovelace" },
      { epochMs: Date.now() + 1, name: "Alan Turing" },
    ]);

    // act
    const result = removeSignature({ name: "Ada Lovelace" });

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toHaveLength(1);
    expect(signatures).toMatchObject([{ name: "Alan Turing" }]);
    expect(result).toBe(true);
  });

  test("when there no matching signature, it returns false", () => {
    // setup
    setAllSignatures([
      { epochMs: Date.now(), name: "Ada Lovelace" },
      { epochMs: Date.now() + 1, name: "Alan Turing" },
    ]);

    // act
    const result = removeSignature({ name: "Billy Jean" });

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toHaveLength(2);
    expect(signatures).toMatchObject([
      { name: "Ada Lovelace" },
      { name: "Alan Turing" },
    ]);
    expect(result).toBe(false);
  });
});

describe("removeSignatureByEpoch", () => {
  test("when there is a matching signature, it remove it and returns true", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([
      { epochMs: presentDate, name: "Ada Lovelace" },
      { epochMs: presentDate + 1, name: "Alan Turing" },
    ]);

    // act
    const result = removeSignatureByEpoch(presentDate);

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toHaveLength(1);
    expect(signatures).toMatchObject([{ name: "Alan Turing" }]);
    expect(result).toBe(true);
  });

  test("when there no matching signature, it returns false", () => {
    // setup
    const presentDate = Date.now();
    setAllSignatures([
      { epochMs: presentDate, name: "Ada Lovelace" },
      { epochMs: presentDate + 1, name: "Alan Turing" },
    ]);

    // act
    const result = removeSignatureByEpoch(presentDate + 2);

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toHaveLength(2);
    expect(signatures).toMatchObject([
      { name: "Ada Lovelace" },
      { name: "Alan Turing" },
    ]);
    expect(result).toBe(false);
  });
});

describe("setAllSignatures", () => {
  it("reassigns the signatures to the array passed in", () => {
    // act
    setAllSignatures([
      { epochMs: Date.now(), name: "Lisa Simpson" },
      { epochMs: Date.now() + 1, name: "Bart Simpson" },
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

describe("updateSignature", () => {
  it("updates a single signature with the matched values", () => {
    // setup
    const [dateOne, dateTwo, dateThree] = [
      // use addition to ensure different milliseconds
      Date.now(),
      Date.now() + 1,
      Date.now() + 2,
    ];
    const referenceSignatures = [
      { epochMs: dateOne, name: "Apple" },
      { epochMs: dateTwo, name: "Apple", message: "holla" },
      { epochMs: dateThree, name: "Banana", message: "holla" },
    ];
    setAllSignatures(referenceSignatures);

    // act: change message of first signature with holla message
    updateSignature({ message: "holla" }, { message: "message one!" });
    // act: change message of first signature with holla message
    //  (which should now be Banana's message since the first has been changed)
    updateSignature({ message: "holla" }, { message: "message two!" });

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toHaveLength(3);
    expect(signatures).toStrictEqual([
      { epochMs: dateOne, name: "Apple" },
      { epochMs: dateTwo, name: "Apple", message: "message one!" },
      { epochMs: dateThree, name: "Banana", message: "message two!" },
    ]);
  });

  it("returns the updated signature", () => {
    // arrange
    const presentDate = Date.now();
    const referenceSignatures = [
      { epochMs: presentDate, name: "Apple" },
      { epochMs: presentDate + 1, name: "Apple", message: "holla" },
      { epochMs: presentDate + 2, name: "Banana", message: "holla" },
    ];
    setAllSignatures(referenceSignatures);

    // act
    const result = updateSignature(
      { name: "Apple", message: "holla" },
      { name: "Carrot" }
    );

    // assert: returns updated signature
    expect(result).toStrictEqual({ ...referenceSignatures[1], name: "Carrot" });
  });

  it("Can update keys different to those matched against", () => {
    // setup
    const presentDate = Date.now();
    const referenceSignatures = [{ epochMs: presentDate, name: "Apple" }];
    setAllSignatures(referenceSignatures);

    updateSignature({ epochMs: presentDate }, { name: "Banana" });

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toStrictEqual([
      { epochMs: presentDate, name: "Banana" },
    ]);
  });

  it("Can add a previously absent key", () => {
    // setup
    const presentDate = Date.now();
    const referenceSignatures = [{ epochMs: presentDate, name: "Apple" }];
    setAllSignatures(referenceSignatures);

    updateSignature({ epochMs: presentDate }, { message: "hi!" });

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toStrictEqual([
      { epochMs: presentDate, name: "Apple", message: "hi!" },
    ]);
  });

  it("copes with case where matching signature has index 0", () => {
    // setup
    const [dateOne, dateTwo, dateThree] = [
      // use addition to ensure different milliseconds
      Date.now(),
      Date.now() + 1,
      Date.now() + 2,
    ];
    const referenceSignatures = [
      { epochMs: dateOne, name: "Apple" },
      { epochMs: dateTwo, name: "Apple", message: "holla" },
      { epochMs: dateThree, name: "Banana", message: "holla" },
    ];
    setAllSignatures(referenceSignatures);

    // act: change first match with Apple to have a name of Carrot
    updateSignature({ name: "Apple" }, { name: "Carrot" });
    // act: change first match with Apple to have a name of Carrot
    //  (which should now be index 1 since index 0 has been changed)
    updateSignature({ name: "Apple" }, { name: "Carrot" });

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toHaveLength(3);
    expect(signatures).toStrictEqual([
      { epochMs: dateOne, name: "Carrot" },
      { epochMs: dateTwo, name: "Carrot", message: "holla" },
      { epochMs: dateThree, name: "Banana", message: "holla" },
    ]);
  });

  it("returns null when there is no signature to update", () => {
    // arrange
    const presentDate = Date.now();
    const referenceSignatures = [
      { epochMs: presentDate, name: "Apple" },
      { epochMs: presentDate + 1, name: "Apple", message: "holla" },
      { epochMs: presentDate + 2, name: "Banana", message: "holla" },
    ];
    setAllSignatures(referenceSignatures);

    // act
    const result = updateSignature({ name: "Kanye" }, { name: "Kim" });

    // assert: returns null and signatures are unchanged
    expect(result).toBeNull();
    expect(getAllSignatures()).toStrictEqual(referenceSignatures);
  });
});

describe("updateSignatureByEpoch", () => {
  it("updates single signature with the given epoch identifier", () => {
    // setup
    const [dateOne, dateTwo, dateThree] = [
      // use addition to ensure different milliseconds
      Date.now(),
      Date.now() + 1,
      Date.now() + 2,
    ];
    const referenceSignatures = [
      { epochMs: dateOne, name: "Apple" },
      { epochMs: dateTwo, name: "Apple", message: "holla" },
      { epochMs: dateThree, name: "Banana", message: "holla" },
    ];
    setAllSignatures(referenceSignatures);

    // act: change messages of specified signatures
    updateSignatureByEpoch(dateTwo, {
      name: "Carrot",
      message: "message one!",
    });

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toHaveLength(3);
    expect(signatures).toStrictEqual([
      { epochMs: dateOne, name: "Apple" },
      { epochMs: dateTwo, name: "Carrot", message: "message one!" },
      { epochMs: dateThree, name: "Banana", message: "holla" },
    ]);
  });

  it("returns the updated signature", () => {
    // arrange
    const presentDate = Date.now();
    const referenceSignatures = [
      { epochMs: presentDate, name: "Apple" },
      { epochMs: presentDate + 1, name: "Apple", message: "holla" },
      { epochMs: presentDate + 2, name: "Banana", message: "holla" },
    ];
    setAllSignatures(referenceSignatures);

    // act
    const result = updateSignatureByEpoch(presentDate + 2, { name: "Carrot" });

    // assert: returns updated signature
    expect(result).toStrictEqual({ ...referenceSignatures[2], name: "Carrot" });
  });

  it("returns null when there is no signature to update", () => {
    // arrange
    const presentDate = Date.now();
    const referenceSignatures = [
      { epochMs: presentDate, name: "Apple" },
      { epochMs: presentDate + 1, name: "Apple", message: "holla" },
      { epochMs: presentDate + 2, name: "Banana", message: "holla" },
    ];
    setAllSignatures(referenceSignatures);

    // act
    const result = updateSignatureByEpoch(presentDate + 3, { name: "Kim" });

    // assert: returns null and signatures are unchanged
    expect(result).toBeNull();
    expect(getAllSignatures()).toStrictEqual(referenceSignatures);
  });

  it("can add a previously absent key", () => {
    // setup
    const presentDate = Date.now();
    const referenceSignatures = [{ epochMs: presentDate, name: "Apple" }];
    setAllSignatures(referenceSignatures);

    updateSignatureByEpoch(presentDate, { message: "hi!" });

    // assert
    const signatures = getAllSignatures();
    expect(signatures).toStrictEqual([
      { epochMs: presentDate, name: "Apple", message: "hi!" },
    ]);
  });
});
