import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

AWS.config.update({ region: "us-east-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const API_URL = "https://json.astrologyapi.com/v1/general_house_report/venus";
const API_USER_ID = "638177"; // Replace with actual user ID
const API_KEY = "de88cd63b147a66eb5e3fb963aa2fc08208a1887"; // Replace with actual API key

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fullName, email, dob, time, place, phonenumber } = req.body;

    // Fetch astrology report
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${API_USER_ID}:${API_KEY}`).toString("base64"),
      },
      body: JSON.stringify({ dob, time, place }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch astrology report" });
    }

    const reportData = await response.json();

    // Store in DynamoDB
    const reportItem = {
      id: uuidv4(),
      user: fullName,
      email: email,
      phonenumber: phonenumber,
      dob,
      time,
      place,
      report: JSON.stringify(reportData),
      createdAt: new Date().toISOString(),
    };

    await dynamoDb.put({
      TableName: "Report-dev",
      Item: reportItem,
    }).promise();

    res.status(200).json(reportItem);
  } catch (error) {
    console.error("Error fetching astrology report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}