import express from "express";
import env from "./env";
import { Postgres } from "../infra/database/adapters/postgres";
import { AuthRoutes } from "./routes/auth";
import { SignUpController } from "../presentation/controllers/sign-up";
import { SignUpUseCase } from "../application/use-cases/sign-up";
import { BcryptHasher } from "../shared/hashing/bcrypt";
import { UsersRepository } from "../infra/repositories/users";
import { bodyParser } from "./middlewares/body-parser";
import { cors } from "./middlewares/cors";
import { contentType } from "./middlewares/content-type";
import { JWTProvider } from "../shared/auth/jwt";
import { WorkflowsRepository } from "../infra/repositories/workflows";
import { CreateWorkflowUseCase } from "../application/use-cases/create-workflow";
import { CreateWorkflowController } from "../presentation/controllers/create-workflow";
import { WorkflowsRoutes } from "./routes/workflows";
import { ListWorkflowsUseCase } from "../application/use-cases/list-workflows";
import { ListWorkflowsController } from "../presentation/controllers/list-workflows";
import { ExecuteWorkflowController } from "../presentation/controllers/execute-workflow";
import {
  ActionHandler,
  ExecuteWorkflowUseCase,
} from "../application/use-cases/execute-workflow";
import { WorkflowExecutionsRepository } from "../infra/repositories/executions";
import { HttpActionHandler } from "../infra/actions/http";
import { LogActionHandler } from "../infra/actions/log";
import { DelayActionHandler } from "../infra/actions/delay";
import { NodeType } from "../domain/entities/workflow";
import { DeleteWorkflowUseCase } from "../application/use-cases/delete-workflow";
import { DeleteWorkflowController } from "../presentation/controllers/delete-workflow";
import { GetWorkflowUseCase } from "../application/use-cases/get-workflow";
import { GetWorkflowController } from "../presentation/controllers/get-workflow";
import { LogsRepository } from "../infra/repositories/logs";
import { SignInUseCase } from "../application/use-cases/sign-in";
import { SignInController } from "../presentation/controllers/sign-in";
import { UpdateWorkflowUseCase } from "../application/use-cases/update-workflow";
import { UpdateWorkflowController } from "../presentation/controllers/update-workflow";

const app = express();
app.use(bodyParser);
app.use(cors);
app.use(contentType);

const hasher = new BcryptHasher(Number(env.hashSalts));
const tokenProvider = new JWTProvider(env.jwtSecret);
const db = new Postgres(env.databaseUrl);

const handlers: Record<NodeType, ActionHandler> = {
  http: new HttpActionHandler(),
  log: new LogActionHandler(),
  delay: new DelayActionHandler(),
};

const initApp = async () => {
  await db.connect();

  const usersRepository = new UsersRepository(db);
  const workflowsRepository = new WorkflowsRepository(db);
  const executionsRepository = new WorkflowExecutionsRepository(db);
  const logsRepository = new LogsRepository(db);

  const signUpUsecase = new SignUpUseCase(
    usersRepository,
    hasher,
    tokenProvider
  );
  const signInUseCase = new SignInUseCase(
    usersRepository,
    hasher,
    tokenProvider
  );

  const getWorkflowUseCase = new GetWorkflowUseCase(
    workflowsRepository,
    usersRepository
  );
  const createWorkflowUseCase = new CreateWorkflowUseCase(
    workflowsRepository,
    usersRepository
  );
  const listWorkflowsUseCase = new ListWorkflowsUseCase(
    workflowsRepository,
    usersRepository
  );
  const executeWorkflowUseCase = new ExecuteWorkflowUseCase(
    workflowsRepository,
    executionsRepository,
    logsRepository,
    handlers
  );
  const deleteWorkflowUseCase = new DeleteWorkflowUseCase(
    workflowsRepository,
    usersRepository
  );
  const updateWorkflowUseCase = new UpdateWorkflowUseCase(
    workflowsRepository,
    usersRepository
  );

  const signUpController = new SignUpController(signUpUsecase);
  const signInController = new SignInController(signInUseCase);

  const getWorkflowController = new GetWorkflowController(getWorkflowUseCase);
  const createWorkflowController = new CreateWorkflowController(
    createWorkflowUseCase
  );
  const listWorkflowsController = new ListWorkflowsController(
    listWorkflowsUseCase
  );
  const executeWorkflowController = new ExecuteWorkflowController(
    executeWorkflowUseCase
  );
  const deleteWorkflowController = new DeleteWorkflowController(
    deleteWorkflowUseCase
  );
  const updateWorkflowController = new UpdateWorkflowController(
    updateWorkflowUseCase
  );

  const authRoutes = new AuthRoutes(signUpController, signInController);
  const workflowsRoutes = new WorkflowsRoutes(
    createWorkflowController,
    listWorkflowsController,
    executeWorkflowController,
    deleteWorkflowController,
    getWorkflowController,
    updateWorkflowController,
    tokenProvider
  );

  authRoutes.register(app);
  workflowsRoutes.register(app);

  app.listen(env.port, () =>
    console.log(`App running at http://localhost:${env.port}`)
  );
};

initApp().catch((err) => {
  db.close();
  console.log(err);
  process.exit(1);
});
