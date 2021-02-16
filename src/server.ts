import express from "express";
import cors from "cors";

const app = express();

/**
 * Simplest way to connect a front-end. Unimportant detail right now, although you can read more: https://flaviocopes.com/express-cors/
 */
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
        signature: {}, // TODO: populate from 'database'
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

export default app;
