import { Route, Routes } from "react-router";
import { WorkflowPage } from "./features/workflows/pages/workflow";
import { SignUpPage } from "./features/auth/pages/sign-up";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>Hello World!</h1>} />
      <Route path="/workflow/:id" element={<WorkflowPage />} />

      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
};
