import supertest from "supertest";
import app from "./server";

test("GET /signatures returns a status of 200, a status of success and signatures array in data", async () => {
  const response = await supertest(app).get("/signatures");
  expect(response.status).toBe(200);
  expect(response.body.status).toBe("success");
  expect(Array.isArray(response.body.data.signatures)).toBe(true);
});
