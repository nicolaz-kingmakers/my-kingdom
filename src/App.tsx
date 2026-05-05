import { AppProvider } from "./context/AppContext";
import AppFlow from "./flows/AppFlow";

export default function App() {
  return (
    <AppProvider>
      <AppFlow />
    </AppProvider>
  );
}
