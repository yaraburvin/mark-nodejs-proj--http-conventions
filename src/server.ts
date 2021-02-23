import express from "express";
import cors from "cors";

const app = express();

/**
 * Simplest way to connect a front-end. Unimportant detail right now, although you can read more: https://flaviocopes.com/express-cors/
 */ import { findSignatureByEpoch } from "./signature/model";

app.use(cors());

/**
 * Middleware to parse a JSON body in requests
 */
app.use(express.json());

app.get("/signatures", (req, res) => {
  res.status(200).send({
    status: "success",
    data: {
      signatures: [], // TODO: populate from 'database'
    },
  });
});

app.post("/signatures", (req, res) => {
  if (typeof req.body.name === "string") {
    res.status(201).send({
      status: "success",
      data: {
        signature: {}, // TODO: populate with data
      },
    });
  } else {
    res.status(400).send({
      status: "fail",
      data: {
        name: "A name is required",
      },
    });
  }
});

app.get("/signatures/:epoch", (req, res) => {
  // :epoch is a route parameter
  //  see documentation: https://expressjs.com/en/guide/routing.html
  const epochMs = parseInt(req.params.epoch); // params are string type
  const signature = findSignatureByEpoch(epochMs);
  if (signature) {
    res.status(200).send({
      status: "success",
      data: {
        signature,
      },
    });
  } else {
    res.status(404).send({
      status: "fail",
      data: {
        epochMs: "Could not find a signature with that epoch identifier",
      },
    });
  }
});

export default app;
