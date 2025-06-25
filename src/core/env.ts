export default {
  hashSalts: process.env.HASH_SALTS || 10,
  port: process.env.PORT || 3000,
  databaseUrl:
    process.env.DATABASE_URL || "postgresql://alloy:alloy@localhost:5432/alloy",
  jwtSecret: process.env.JWT_SECRET || "secret",
};
