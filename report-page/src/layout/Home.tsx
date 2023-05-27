import classNames from "classnames";
import { FunctionalComponent } from "preact";
import { Outlet, NavLink } from "react-router-dom";

const Home: FunctionalComponent = () => {
  return (
    <>
      <div class="w-full h-10 border-b border-black/10">
        <div class="w-full h-full flex justify-center items-center">
          {[
            ["conversation", "对话"],
            ["file", "原始文件"],
            ["result", "运行结果"],
          ].map(([path, title]) => (
            <NavLink
              to={path}
              className={({ isActive }: { isActive: boolean }) =>
                classNames("mx-4 text-sm text-zinc-600 cursor-pointer", {
                  "font-bold": isActive,
                })
              }
            >
              {title}
            </NavLink>
          ))}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Home;
