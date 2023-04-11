"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const router = new express.Router();

const { shipProduct } = require("../shipItApi");
const jsonschema = require("jsonschema");
const orderSchema = require("../orderSchema.json");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Validates correct order input.
 *
 * Returns { shipped: shipId }
 *
 * OR
 *
 * Retuns 400 error with error messages if invalid input(s)
 */

router.post("/", async function (req, res, next) {
  if (req.body === undefined) {
    throw new BadRequestError();
  }
  const result = jsonschema.validate(
    req.body, orderSchema, {required: true});

  if (!result.valid) {
    const errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }

  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });
  return res.json({ shipped: shipId });
});


module.exports = router;