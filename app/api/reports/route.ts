import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

AWS.config.update({ region: "ap-south-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const API_URL = "https://json.astrologyapi.com/v1/general_house_report/venus";
const API_USER_ID = "your_user_id"; // Replace with actual User ID
const API_KEY = "your_api_key"; // Replace with actual API Key

// ✅ Correctly Export Named POST Handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, dob, time, place, phonenumber } = body;

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
      return NextResponse.json({ error: "Failed to fetch astrology report" }, { status: response.status });
    }

    const reportData = await response.json();

    console.log('Report Data:', reportData);

    // Store in DynamoDB
    const reportItem = {
      id: uuidv4(),
      user: fullName,
      email: email,
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

    return NextResponse.json({ message: "Report stored successfully", data: reportItem }, { status: 200 });
  } catch (error) {
    console.error("Error fetching astrology report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}