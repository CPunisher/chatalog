import { FunctionalComponent } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";
import ReportContext from "../context";
import classNames from "classnames";
import { ValidationResult, singleValidate } from "../utils/validator";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar: FunctionalComponent = () => {
  const { data = [] } = useContext(ReportContext) || {};
  const [searchInput, setSearchInput] = useState("");

  const searchFiltered = useMemo(
    () =>
      data.filter((group) =>
        group.name.toLowerCase().includes(searchInput.toLowerCase())
      ),
    [data, searchInput]
  );

  const location = useLocation();
  const nested = useMemo(() => {
    if (location.pathname.split("/").length <= 2) return "";
    return location.pathname.substring(location.pathname.lastIndexOf("/"));
  }, [location]);

  return (
    <div class="dark overflow-auto bg-zinc-800 p-2 space-y-1 fixed inset-y-0 flex w-[160px] flex-col lg:w-[260px]">
      <div class="flex flex-col h-full space-y-1 text-gray-100 text-sm">
        <div className="flex items-center pb-2">
          <input
            className="w-full text-black focus-visible:outline-none"
            type="text"
            value={searchInput}
            onInput={(e) => setSearchInput((e.target as any).value ?? "")}
          />
        </div>
        <div class="flex flex-col flex-1 overflow-y-auto gap-2 pt-2 border-b border-t border-white/20">
          {searchFiltered.map((module, index) => (
            <NavLink
              to={`/${index}${nested}`}
              className={({ isActive }: { isActive: boolean }) =>
                classNames(
                  "flex py-3 px-3 items-center gap-3 rounded-md cursor-pointer break-all hover:bg-zinc-700",
                  {
                    "text-green-500":
                      singleValidate(module)[0] === ValidationResult.PASS,
                  },
                  {
                    "text-red-600":
                      singleValidate(module)[0] ===
                      ValidationResult.WRONG_ERROR,
                  },
                  {
                    "text-orange-500":
                      singleValidate(module)[0] ===
                      ValidationResult.SYNTAX_ERROR,
                  },
                  {
                    "bg-zinc-700": isActive,
                  }
                )
              }
            >
              <div class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                {module.name ?? "Unknown"}
              </div>
            </NavLink>
          ))}
        </div>
        <NavLink
          to="/summary"
          className={({ isActive }: { isActive: boolean }) =>
            classNames(
              "flex py-3 px-3 items-center gap-3 rounded-md cursor-pointer break-all hover:bg-zinc-700",
              { "bg-zinc-700": isActive }
            )
          }
        >
          <div class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
            Test Summary
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
