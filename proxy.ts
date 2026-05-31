import { NextResponse, type NextRequest } from "next/server";

const REALM = "Iniziativenergetiche Preview";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"` },
  });
}

export function proxy(request: NextRequest) {
  const password = process.env.PREVIEW_PASSWORD;
  if (!password) {
    return new NextResponse(
      "Preview gate misconfigured: PREVIEW_PASSWORD env var is not set.",
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return unauthorized();

  let decoded = "";
  try {
    decoded = atob(header.slice("Basic ".length));
  } catch {
    return unauthorized();
  }

  const idx = decoded.indexOf(":");
  if (idx < 0) return unauthorized();
  const submitted = decoded.slice(idx + 1);
  if (submitted !== password) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
