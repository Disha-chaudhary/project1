import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import Protected from "./features/auth/components/protected";
import Home from "./features/interview/pages/Home";
import InterviewDashboard from "./features/interview/pages/interviewDashboard";
import Landing from "./features/auth/pages/landing";
import MockInterview from "./features/interview/pages/MockInterview";
import MockResult from "./features/interview/pages/MockResult";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <InterviewDashboard />
      </Protected>
    ),
  },
  {
    path: "/mock-interview/:interviewId",
    element: (
      <Protected>
        <MockInterview />
      </Protected>
    ),
  },
  {
    path: "/mock-result/:interviewId",
    element: (
      <Protected>
        <MockResult />
      </Protected>
    ),
  },
]);
