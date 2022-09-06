import { NextApiRequest, NextApiResponse } from "next";
import ampq from "amqplib";
import { newSandboxId } from "../../utils";
import { SandboxDocument } from "../../types";
import { mongoClient, projectsCollection } from "../../mongodb";
import { initializeProjectChannel } from "../../ampq";
import { makeErrorResult, makeResult } from "../../utils/result";

const InvalidMethodError = new Error("Invalid HTTP method for endpoint");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      throw InvalidMethodError;
    }

    await mongoClient.connect();
    const ch1 = await initializeProjectChannel();

    const { type } = req.body;
    const sandboxId = newSandboxId();

    const document: SandboxDocument = {
      sandboxId,
      status: "CREATING",
      type,
    };
    await projectsCollection.insertOne(document);

    const r = ch1.sendToQueue(
      "initializeProject",
      Buffer.from(JSON.stringify(document))
    );

    if (!r) {
      throw new Error("error sending to channel");
    }

    res.json(makeResult(document));
  } catch (error) {
    res.json(makeErrorResult(error));
  }
}
