"use strict";

const AxiosMockAdapter = require("axios-mock-adapter");
const axios = require("axios");
const axiosMock = new AxiosMockAdapter(axios);
const { SHIPIT_SHIP_URL, shipProduct } = require("./shipItApi.js")

// shipProduct = jest.fn();

test("shipProduct", async function () {
  axiosMock.onPost(`${SHIPIT_SHIP_URL}`)
    .reply(200, {"receipt": {
      "itemId": 1000,
      "name": "Test Tester",
      "addr": "100 Test St",
      "zip": "12345-6789",
      "shipId": 3166
    }
  })

  const res = await shipProduct(
    {
      "productId": 1000,
       "name": "Test Tester",
       "addr": "100 Test St",
       "zip": "12345-6789"
    }
  );
  expect(res).toEqual(3166)
});

//const receipt = { itemId, name, addr, zip, shipId };