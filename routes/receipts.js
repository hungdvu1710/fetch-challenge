const express = require("express");
const receipts_router = express.Router();
const { v4: uuidv4 } = require("uuid");
let receipts = {};

// receipts examples:
/**
 * 
  {
    "retailer": "Walgreens",
    "purchaseDate": "2022-01-02",
    "purchaseTime": "08:13",
    "total": "2.65",
    "items": [
        {"shortDescription": "Pepsi - 12-oz", "price": "1.25"},
        {"shortDescription": "Dasani", "price": "1.40"}
    ]
  }

  {
    "retailer": "Target",
    "purchaseDate": "2022-01-02",
    "purchaseTime": "13:13",
    "total": "1.25",
    "items": [
        {"shortDescription": "Pepsi - 12-oz", "price": "1.25"}
    ]
  }
 * 
 */

const calculateReceiptPoints = (receiptId) => {
  const receipt = receipts[receiptId];
  let points = 0;
  let { retailer, items, total, purchaseDate, purchaseTime } = receipt;

  // points from retailer name
  points += retailer.replace(/[^a-zA-Z0-9]/g, "").length;

  //points from total
  total = parseFloat(total);
  if (total == Math.round(total)) points += 50;
  if (total % 0.25 == 0) points += 25;

  // points from number of items
  points += Math.floor(items.length / 2) * 5;

  // points from individual item
  for (const item of items) {
    let { shortDescription, price } = item;
    if (shortDescription.trim().length % 3 == 0)
      points += Math.ceil(price * 0.2);
  }

  // points from purchase date
  let purchaseDay = purchaseDate.split("-")[2];
  if (parseInt(purchaseDay) % 2 != 0) points += 6;

  // points from purchase time
  let purchaseHour = parseInt(purchaseTime.split(":")[0]);
  // for this condition, I assume we don't want points for 2:00pm and 4:00pm
  if (purchaseHour >= 14 && purchaseHour < 16 && purchaseTime != "14:00")
    points += 10;

  return points;
};

receipts_router.post("/process", (req, res) => {
  const receipt = req.body;
  if (
    !receipt.retailer ||
    !receipt.purchaseDate ||
    !receipt.purchaseTime ||
    !receipt.total ||
    !receipt.items
  ) {
    // Simple input validation
    // Since its not mention in the requirement, I assume we don't need to do further input validation
    res.status(400).send("The receipt is invalid");
    return;
  }
  const receiptId = uuidv4();
  receipts[receiptId] = receipt;
  res.status(200).send({ id: receiptId });
});

receipts_router.get("/:id/points", (req, res) => {
  if (!receipts[req.params.id])
    res.status(404).send("No receipt found for that id");
  else {
    res.status(200).send({ points: calculateReceiptPoints(req.params.id) });
  }
});

module.exports = receipts_router;
