import { NextResponse } from "next/server";
import {
  apioptions,
  apireq,
  apireqType,
  defaultApiReq,
  getAuth,
  getUser,
} from "@/db/dbreq";

type Params = {
  db: string;
};

export const GET = async (request: Request, context: { params: Params }) => {
  const selfUser = await getAuth();
  if (request.headers.get("module") === "parlement") {
    const body = await request.json();
    const method = context.params.db;

    try {
      const mod = await import("@/db/parlament");

      if (typeof (mod as { [key: string]: any })[method] === "function") {
        console.log("body:", body);
        return NextResponse.json(
          await (mod as { [key: string]: any })[method](
            selfUser,
            ...Object.values(body),
          ),
        );
      } else {
        console.error(`Invalid method: ${method} is not a function`);
        return NextResponse.json(
          { error: `Invalid method: ${method}` },
          { status: 400 },
        );
      }
    } catch (error) {
      console.error("Error in parlement module:", error);
      return NextResponse.json(
        { error: "Failed to process request in parlement module" },
        { status: 500 },
      );
    }
  }

  if (!selfUser) {
    return NextResponse.json(
      { error: "Please log in to use this API" },
      { status: 400 },
    );
  }

  const gate = context.params.db;
  if (apioptions.includes(gate as any) === false) {
    return NextResponse.json(
      { error: "Invalid API endpoint" },
      { status: 400 },
    );
  }

  const user = await getUser(selfUser.email ?? undefined);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 500 });
  }

  const userPermissionsSet = new Set(user.permissions);
  const gatePermissions = new Set(apireq[gate as apireqType].perm);

  if (
    apireq[gate as apireqType].perm != null &&
    !Array.from(gatePermissions).some((item) => userPermissionsSet.has(item))
  ) {
    return NextResponse.json(
      {
        error: `You do not have permission to use this API\nYour permissions: ${user.name}`,
      },
      { status: 403 },
    );
  }

  // const bodyData = streamToString(request.body);
  let bodyData: string | Promise<string>;
  try {
    bodyData = JSON.parse(await request.text());
  } catch (error) {
    bodyData = "";
  }

  try {
    const data = await defaultApiReq(gate as apireqType, bodyData);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request, context: { params: Params }) => {
  return await GET(request, context);
};
