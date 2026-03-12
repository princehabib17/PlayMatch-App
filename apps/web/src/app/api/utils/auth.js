import { getToken } from "@auth/core/jwt";

export async function getAuthenticatedUserId(request) {
  const authUrl = process.env.AUTH_URL ?? "";
  const jwt = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: authUrl.startsWith("https"),
  });

  if (!jwt?.sub) {
    return null;
  }

  const userId = Number.parseInt(jwt.sub, 10);
  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}
