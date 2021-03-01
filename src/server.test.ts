import { update } from "lodash";
import supertest from "supertest";
import app from "./server";
import {
  DatelessSignature,
  findSignatureByEpoch,
  getAllSignatures,
  insertSignature,
  Signature,
  updateSignatureByEpoch,
} from "./signature/model";
import { resetMockFor } from "./test-utils";

// mock all the model functions
jest.mock("./signature/model");

describe("GET /signatures", () => {

  beforeEach(() => {
    resetMockFor(getAllSignatures, (): Signature[] => [
      { epochMs: Date.now(), name: "Lucy Liu" },
      { epochMs: Date.now() + 1, name: "Jackie Chan" },
    ]);
  });

  it("responds with a status of 200, a status of success and signatures array in data", async () => {
    const response = await supertest(app).get("/signatures");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("signatures");
    expect(Array.isArray(response.body.data.signatures)).toBe(true);
  });
});

describe("GET /signatures/:epoch", () => {
  const PASSING_EPOCH = 1614096121305;
  const PASSING_SIGNATURE = {
    epochMs: PASSING_EPOCH,
    name: "Indiana Jones",
  };

  beforeEach(() => {
    resetMockFor(findSignatureByEpoch, (epochMs: number): Signature | null => {
      // return a signature for a specific epochMs, otherwise null
      return epochMs === PASSING_SIGNATURE.epochMs ? PASSING_SIGNATURE : null;
    });
  });

  it("calls findSignatureByEpoch with the given epoch", async () => {
    await supertest(app).get("/signatures/1614095562950");
    expect(findSignatureByEpoch).toHaveBeenCalledWith(1614095562950);
  });

  test("when findSignatureByEpoch returns a signature, it returns a 200 with the given epoch", async () => {
    const response = await supertest(app).get(
      `/signatures/${PASSING_SIGNATURE.epochMs}`
    );
    expect(findSignatureByEpoch).toReturnWith(PASSING_SIGNATURE);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("signature");
  });

  test("when findSignatureByEpoch returns null, it returns a 404 with information about not managing to find a signature", async () => {
    // add one to get a non-passing epochMs value
    const response = await supertest(app).get(
      `/signatures/${PASSING_SIGNATURE.epochMs + 1}`
    );
    expect(findSignatureByEpoch).toReturnWith(null);
    expect(response.status).toBe(404);
    expect(response.body.status).toBe("fail");
    expect(response.body.data).toHaveProperty("epochMs");
    expect(response.body.data.epochMs).toMatch(/could not find/i);
  });
});

describe.skip("PATCH /signatures/:epoch", () => {
  const PASSING_EPOCH = 1614096121305;
  const PASSING_SIGNATURE = {
    epochMs: PASSING_EPOCH,
    name: "Indiana Jones",
  };
  const UPDATE_PROPERTIES = {
    message:
      "If you want to be a good archeologist, you gotta get out of the library!",
  };

  beforeEach(() => {
    resetMockFor(
      updateSignatureByEpoch,
      (
        epochMs: number,
        updateProperties: Partial<Signature>
      ): Signature | null => {
        // simulate updating a signature for a specific epochMs
        // otherwise return null
        return epochMs === PASSING_SIGNATURE.epochMs
          ? { ...PASSING_SIGNATURE, ...updateProperties }
          : null;
      }
    );
  });

  it("calls findSignatureByEpoch with the given epoch", async () => {
    await supertest(app)
      .patch("/signatures/1614095562950")
      .send(UPDATE_PROPERTIES);
    expect(findSignatureByEpoch).toHaveBeenCalledWith(1614095562950);
  });

  test("when updateSignatureByEpoch returns a signature, it returns a 200 with the given epoch", async () => {
    const response = await supertest(app)
      .patch(`/signatures/${PASSING_SIGNATURE.epochMs}`)
      .send(UPDATE_PROPERTIES);
    expect(findSignatureByEpoch).toReturnWith({
      ...PASSING_SIGNATURE,
      ...UPDATE_PROPERTIES,
    });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("signature");
  });

  test("when updateSignatureByEpoch returns null, it returns a 404 with information about not managing to find a signature", async () => {
    // add one to patch a non-passing epochMs value
    const response = await supertest(app)
      .patch(`/signatures/${PASSING_SIGNATURE.epochMs + 1}`)
      .send(UPDATE_PROPERTIES);
    expect(findSignatureByEpoch).toReturnWith(null);
    expect(response.status).toBe(404);
    expect(response.body.status).toBe("fail");
    expect(response.body.data).toHaveProperty("epochMs");
    expect(response.body.data.epochMs).toMatch(/could not find/i);
  });
});

describe("POST /signatures", () => {
  beforeEach(() => {
    resetMockFor(
      insertSignature,
      (signature: DatelessSignature): Signature => ({
        ...signature,
        epochMs: Date.now(),
      })
    );
  });

  it("calls insertSignature with the string name and message passed in the body", async () => {
    await supertest(app).post("/signatures").send({
      name: "Noddy",
      message: "Hi, I'm Noddy!",
    });
    expect(insertSignature).toHaveBeenCalledWith({
      name: "Noddy",
      message: "Hi, I'm Noddy!",
    });
  });

  test("when given appropriate signature data, it responds with a status of 201, a status of success and signature in data", async () => {
    const response = await supertest(app).post("/signatures").send({
      name: "Noddy",
    });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("signature");
  });

  test("when not provided with a name in the request body, it responds with a status of 400, a status of success and signature in data", async () => {
    const response = await supertest(app).post("/signatures").send({
      naem: "Noddy", // deliberate typo to test response
    });
    expect(response.status).toBe(400);
    expect(response.body.status).toBe("fail");
    expect(response.body.data).toMatchObject({
      name: "A string value for name is required",
    });
  });
});
