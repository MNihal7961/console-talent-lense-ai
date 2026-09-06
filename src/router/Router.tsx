import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "../guards/ProtectedRoute";
import PublicRoute from "../guards/PublicRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Layout from "../layout/Layout";
import Home from "../pages/home/Home";
import JobPost from "../pages/jobPost/JobPost";
import JobPostDetails from "../pages/jobPostDetails/JobPostDetails";
import JobPostGenrator from "../pages/jobPostGenrator/JobPostGenrator";
import JobPostcreator from "../pages/jobPostcreator/JobPostcreator";
import Screening from "../pages/screening/Screening";
import ScreeningResult from "../pages/screeningResult/ScreeningResult";

function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/sign-in" element={<Login />} />
            <Route path="/sign-up" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/job-post" element={<JobPost />} />
              <Route path="/job-post/:id" element={<JobPostDetails />} />
              <Route path="/job-post/generate" element={<JobPostGenrator />} />
              <Route path="/job-post/create" element={<JobPostcreator />} />
              <Route path="/screening" element={<Screening />} />
              <Route
                path="/screening/:jobApplicationId"
                element={<ScreeningResult />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default Router;
