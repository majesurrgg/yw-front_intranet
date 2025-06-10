
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
