export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";

// AWS DynamoDB Configuration
AWS.config.update({ region: "ap-south-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Report-dev";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phonenumber = searchParams.get("phonenumber");

    if (!phonenumber) {
      return NextResponse.json({ error: "Missing phone number" }, { status: 400 });
    }

    const params = {
      TableName: TABLE_NAME,
      Key: { phonenumber },
    };

    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(result.Item, { status: 200 });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}