import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreatedStacks from "./pages/CreatedStacks";
import Home from "./pages/Home";
import ProjectInput from "./components/ProjectInput";
import TechStackExplorer from "./components/TechStackExplorer";

export default function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      {currentUser && (
        // private route redirects user to sign in if not logged in
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="projectinput" element={<ProjectInput />} />
            <Route path="techstackexplorer" element={<TechStackExplorer />} />
            <Route path="createdstacks" element={<CreatedStacks />} />
          </Route>
        </Route>
      )}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
