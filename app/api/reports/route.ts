import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

// AWS DynamoDB Configuration
AWS.config.update({ region: "ap-south-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Report-dev";

// Astrology API Configuration
const API_BASE_URL = "https://json.astrologyapi.com/v1/general_house_report";
const API_USER_ID = "638177"; // Replace with actual User ID
const API_KEY = "de88cd63b147a66eb5e3fb963aa2fc08208a1887"; // Replace with actual API Key

// Planets for which reports need to be generated
const PLANETS = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
];

// In-memory cache (state management)
const reportCache: { [phone: string]: any } = {};

async function checkReportInDatabase(phonenumber: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: { phonenumber },
  };

  const result = await dynamoDb.get(params).promise();
  return result.Item ? result.Item : null;
}

async function fetchPlanetReports({ dob, time, lat, long }) {
  const [year, month, day] = dob.split("-").map(Number);
  const [hour, min] = time.split(":").map(Number);
  const timezone = 5.5; // Hardcoded for IST, can be dynamic

  const reports: { [key: string]: string } = {};

  for (const planet of PLANETS) {
    try {
      const requestBody = {
        day,
        month,
        year,
        hour,
        min,
        lat: parseFloat(lat),
        lon: parseFloat(long),
        tzone: timezone,
      };

      const response = await fetch(`${API_BASE_URL}/${planet}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(`${API_USER_ID}:${API_KEY}`).toString("base64"),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.warn(`Failed to fetch ${planet} report`);
        reports[planet] = "Error fetching report";
      } else {
        const data = await response.json();
        reports[planet] = data.house_report;
      }
    } catch (error) {
      console.error(`Error fetching ${planet} report:`, error);
      reports[planet] = "Error fetching report";
    }
  }

  return reports;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, dob, time, place, phone, lat, long } = body;
    console.log("Received Body:", body);

    // Step 1: Check if report exists in cache
    if (reportCache[phone]) {
      console.log("Fetching report from cache...");
      return NextResponse.json(reportCache[phone]);
    }

    // Step 2: Check if report exists in DynamoDB
    const existingReport = await checkReportInDatabase(phone);
    if (existingReport) {
      console.log("Fetching report from DynamoDB...");
      reportCache[phone] = existingReport; // Store in cache
      return NextResponse.json(existingReport);
    }

    // Step 3: Fetch reports for all planets from APIs
    console.log("Fetching new reports from astrology API...");
    const reports = await fetchPlanetReports({ dob, time, lat, long });

    console.log("Fetched Reports:", reports);

    // Step 4: Store reports in DynamoDB
    const reportItem = {
      id: uuidv4(),
      user: fullName,
      email: email,
      phonenumber: phone,
      place,
      dob,
      time,
      lat,
      long,
      createdAt: new Date().toISOString(),
      ...reports, // Store each planet's report in separate columns
    };

    await dynamoDb
      .put({
        TableName: TABLE_NAME,
        Item: reportItem,
      })
      .promise();

    // Step 5: Store result in cache
    reportCache[phone] = reportItem;

    return NextResponse.json(reportItem, { status: 200 });
  } catch (error) {
    console.error("Error fetching astrology report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
