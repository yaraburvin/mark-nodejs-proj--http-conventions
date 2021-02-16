import supertest from "supertest";
import app from "./server";

describe("GET /signatures", () => {
  it("responds with a status of 200, a status of success and signatures array in data", async () => {
    const response = await supertest(app).get("/signatures");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("signatures");
    expect(Array.isArray(response.body.data.signatures)).toBe(true);
  });
});

describe("POST /signatures", () => {
  test("when given appropriate signature data, it responds with a status of 201, a status of success and signature in data", async () => {
    const response = await supertest(app).post("/signatures").send({
      name: "Noddy",
    });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("signature");
  });

  test("when given malformed signature data, it responds with a status of 400, a status of success and signature in data", async () => {
    const response = await supertest(app).post("/signatures").send({
      naem: "Noddy", // deliberate typo
    });
    expect(response.status).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.data).toMatchObject({
      name: "A name is required",
    });
  });
});
