import { Navigate, Route, Routes, useLocation } from "react-router";
import { SignUpPage } from "./features/auth/sign-up/page";
import { WorkflowPage } from "./features/workflows/builder/page";
import { SignInPage } from "./features/auth/sign-in/page";
import { WorkflowsListPage } from "./features/workflows/list/page";
import Cookies from "js-cookie";
import { type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const accessToken = Cookies.get("accessToken");
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route
        path="/workflows"
        element={
          <ProtectedRoute>
            <WorkflowsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workflow/:id"
        element={
          <ProtectedRoute>
            <WorkflowPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/workflows" replace />} />
    </Routes>
  );
};
