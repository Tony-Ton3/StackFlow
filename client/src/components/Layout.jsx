import { Outlet } from "react-router-dom";
import Header from "./Header"; // Assuming you have a Header component

export default function Layout() {
  return (
    <div>
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
