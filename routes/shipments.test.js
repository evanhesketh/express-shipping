"use strict";

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("error returned for single invalid input", async function() {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: 10,
        name: "Test Tester",
        addr: "100 Test St",
        zip: "12345-6789"
      });

    expect(resp.body.error.message).toEqual(
      ["instance.productId must be greater than or equal to 1000"]);
    expect(resp.statusCode).toEqual(400);
  })

  test("error returned for multiple invalid inputs", async function() {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: 99,
        addr: 1123,
        zip: 1234
      });

      expect(resp.body.error.message).toEqual([
        "instance.productId must be greater than or equal to 1000",
        "instance.addr is not of a type(s) string",
        "instance.zip is not of a type(s) string",
        "instance requires property \"name\""
      ]);
      expect(resp.statusCode).toEqual(400);
  })
});
