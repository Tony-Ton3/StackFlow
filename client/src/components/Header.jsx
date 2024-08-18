import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TbStack3Filled } from "react-icons/tb";
import { signoutSuccess } from "../redux/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  return (
    <header className="bg-black text-white p-4 border-b-2 border-b-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex justify-center items-center space-x-2">
          <TbStack3Filled className="size-10" />
          <h1 className="text-2xl font-bold">stack finder</h1>
        </div>

        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Explorer
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Stack
              </a>
            </li>
          </ul>
        </nav>
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
