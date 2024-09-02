import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  const location = useLocation();

  // Determine if the current route should be scrollable
  const isScrollable =
    location.pathname.includes("/techstackexplorer") ||
    location.pathname.includes("/createdstacks");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main
        className={`flex-1 ${
          isScrollable ? "overflow-auto" : "overflow-hidden"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
