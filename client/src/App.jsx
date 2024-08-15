import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProjectInput from "./components/ProjectInput";
import TechStackExplorer from "./components/TechStackExplorer";

export default function App() {
  const { currentUser } = useSelector((state) => state.user);
  //used to set user inputs, once set, TechStack Explorer is mounted
  // const [recommendation, setRecommendation] = useState(null);
  // <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  //     {recommendation ? (
  //       <TechStackExplorer recommendation={recommendation} />
  //     ) : (
  //       <ProjectInput setRecommendation={setRecommendation} />
  //     )}
  // </div>
  return (
    <Routes>
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      {currentUser && (
        <Route element={<PrivateRoute />}>
          <Route path="techstackexplorer" element={<TechStackExplorer />} />
          <Route path="projectinput" element={<ProjectInput />} />
        </Route>
      )}
      <Route path="*" element={<SignIn />} />
    </Routes>
  );
}
