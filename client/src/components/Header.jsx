import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { TbStack3Filled } from "react-icons/tb";
import { signoutSuccess } from "../redux/userSlice";
import { motion } from "framer-motion";

export default function Header() {
  const tabs = ["Home", "Stack", "Saved"];
  const [selected, setSelected] = useState(tabs[0]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.slice(1);
    if (path === "") setSelected("Home");
    else if (path === "techstackexplorer") setSelected("Stack");
    else if (path === "saved") setSelected("Saved");
  }, [location]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`http://localhost:3002/api/user/signout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const Chip = ({ text, selected, setSelected }) => {
    return (
      <button
        onClick={() => {
          setSelected(text);
          if (text === "Home") navigate("/home");
          else if (text === "Stack") navigate("/techstackexplorer");
          else if (text === "Saved") navigate("/saved");
        }}
        className={`${
          selected
            ? "text-white"
            : "text-slate-300 hover:text-slate-200 hover:bg-slate-700"
        } text-sm font-bold transition-colors px-2.5 py-0.5 rounded-md relative`}
      >
        <span className="relative z-10">{text}</span>
        {selected && (
          <motion.span
            layoutId="pill-tab"
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute inset-0 z-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-md"
          ></motion.span>
        )}
      </button>
    );
  };

  return (
    <header className="bg-black text-white p-4 border-b-2 border-b-white">
      <div className=" flex justify-between items-center">
        <div className="flex justify-center items-center space-x-2">
          <TbStack3Filled className="size-10" />
          <h1 className="text-2xl font-bold">Tech Stack Finder</h1>
        </div>

        <div className="flex mr-36 items-center flex-wrap gap-2">
          {tabs.map((tab) => (
            <Chip
              text={tab}
              selected={selected === tab}
              setSelected={setSelected}
              key={tab}
            />
          ))}
        </div>

        <button
          className="flex justify-center items-center w-20 h-10 font-bold bg-purple-400 rounded-lg"
          onClick={() => handleSignout()}
        >
          <p>sign out</p>
        </button>
      </div>
    </header>
  );
}
