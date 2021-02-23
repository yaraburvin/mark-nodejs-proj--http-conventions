import supertest from "supertest";
import app from "./server";
import { findSignatureByEpoch, Signature } from "./signature/model";

// mock all the model functions
jest.mock("./signature/model");

describe("GET /signatures", () => {
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
    // type guard so we can use the mock API inside
    if (jest.isMockFunction(findSignatureByEpoch)) {
      // Reset the mock call and return history before each test
      findSignatureByEpoch.mockReset();

      // mock behaviour for tests
      findSignatureByEpoch.mockImplementation(
        (epochMs: number): Signature | null => {
          // return a signature for a specific epochMs, otherwise null
          return epochMs === PASSING_SIGNATURE.epochMs
            ? PASSING_SIGNATURE
            : null;
        }
      );
    }
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

describe("DELETE /signatures/", () => {
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
      name: "A name is required",
    });
  });
});
