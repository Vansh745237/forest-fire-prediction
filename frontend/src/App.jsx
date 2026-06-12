import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
    path="/forgot-password"
    element={<ForgotPassword />}
  />
        <Route
    path="/reset-password"
    element={<ResetPassword />}
  />
  <Route
  path="/test"
  element={<h1>TEST ROUTE</h1>}
/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;