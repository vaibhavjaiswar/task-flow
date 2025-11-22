const environment = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
  PASSWORD_SALT: parseInt(process.env.PASSWORD_SALT ?? "10"),
  JWT_SECRET: process.env.JWT_SECRET ?? "JSONWebToken",
  JWT_EXPIRATION_IN_SECONDS:
    parseInt(process.env.JWT_EXPIRATION ?? (60 * 60 * 24).toString()) ??
    "86400", // 60 * 60 * 24
};

export default environment;
