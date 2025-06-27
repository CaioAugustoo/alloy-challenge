import { BrowserRouter } from "react-router";
import { AppRoutes } from "./routes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="bottom-center" richColors />
    </BrowserRouter>
  );
}
