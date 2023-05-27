import { FunctionalComponent } from "preact";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const Main: FunctionalComponent = () => {
  return (
    <div class="overflow-hidden w-full h-full">
      <Sidebar />
      <div class="h-full pl-[160px] lg:pl-[260px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
