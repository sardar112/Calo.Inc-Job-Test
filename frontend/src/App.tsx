import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";

import { AppLayout } from "./components/layouts/layout";
import { JobsDashboard } from "./pages/JobsDashboard";
import { JobDetails } from "./pages/JobDetails";

function App() {
  return (
    <Router>
      <AppLayout>
        <ToastContainer stacked />
        <Routes>
          <Route path="/" element={<JobsDashboard />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
