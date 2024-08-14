import { NextRequest } from "next/server";

const getUserInfo = (req: NextRequest) => {
  const cookies = req.cookies;
  return cookies;
};
export { getUserInfo };
