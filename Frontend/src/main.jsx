import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import LoginForm from "./pages/Auth/LoginForm.jsx";
import SignupForm from "./pages/Auth/SignupForm.jsx";
import CreatePoll from "./pages/Dashboard/CreatePoll/CreatePoll.jsx";
import MyPolls from "./pages/Dashboard/MyPolls.jsx";
import CreateIdea from "./pages/Dashboard/CreateIdea/CreateIdea.jsx";
import MyIdeas from "./pages/Dashboard/MyIdeas.jsx";
import Home from "./pages/Dashboard/Home.jsx";
import UserProvider from "./context/UserContext.jsx";
import { Toaster } from "react-hot-toast";
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/create-poll" element={<CreatePoll />} />
      <Route path="/my-polls" element={<MyPolls />} />
      <Route path="/create-idea" element={<CreateIdea />} />
      <Route path="/my-ideas" element={<MyIdeas />} />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  </StrictMode>
);
