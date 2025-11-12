const environment = {
  NODE_ENV: process.env.NODE_ENV,
  PASSWORD_SALT: parseInt(process.env.PASSWORD_SALT || "10"),
};

export default environment;
