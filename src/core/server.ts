import { Postgres } from "../infra/database/adapters/postgres";
import express from "express";
import { AuthRoutes } from "./routes/auth";
import { SignUpController } from "../presentation/controllers/signup";
import { CreateUserUseCase } from "../application/use-cases/create-user";
import { BcryptHasher } from "../shared/hashing/bcrypt";
import { UsersRepository } from "../infra/repositories/users";
import env from "./env";
import { bodyParser } from "./middlewares/body-parser";
import { cors } from "./middlewares/cors";
import { contentType } from "./middlewares/content-type";
import { JWTProvider } from "../shared/auth/jwt";

const app = express();
app.use(bodyParser);
app.use(cors);
app.use(contentType);

const hasher = new BcryptHasher(Number(env.hashSalts));
const tokenProvider = new JWTProvider(env.jwtSecret);

const db = new Postgres(env.databaseUrl);

const initApp = async () => {
  await db.connect();

  const usersRepository = new UsersRepository(db);

  const createUserUseCase = new CreateUserUseCase(
    usersRepository,
    hasher,
    tokenProvider
  );

  const signUpController = new SignUpController(createUserUseCase);

  const authRoutes = new AuthRoutes(signUpController);

  authRoutes.register(app);

  app.listen(env.port, () =>
    console.log(`App running at http://localhost:${env.port}`)
  );
};

initApp().catch((err) => {
  db.close();
  process.exit(1);
});
