import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import ReportContext from "../context";
import classNames from "classnames";

const Sidebar: FunctionalComponent = () => {
  const {
    data = [],
    mode,
    current,
    setCurrent,
  } = useContext(ReportContext) || {};
  return (
    <div class="dark overflow-auto bg-zinc-800 p-2 space-y-1 fixed inset-y-0 flex w-[260px] flex-col">
      <div class="flex flex-col h-full space-y-1 text-gray-100 text-sm">
        <div class="flex flex-col flex-1 overflow-y-auto gap-2 border-b border-white/20">
          {data.map((group) => (
            <a
              class={classNames(
                "flex py-3 px-3 items-center gap-3 rounded-md cursor-pointer break-all hover:bg-zinc-700",
                { "bg-zinc-700": mode === "item" && group === current }
              )}
              onClick={() => {
                setCurrent?.(group);
                window.scrollTo(0, 0);
              }}
            >
              <div class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                {group.name ?? "Unknown"}
              </div>
            </a>
          ))}
        </div>
        <a
          class={classNames(
            "flex py-3 px-3 items-center gap-3 rounded-md cursor-pointer break-all hover:bg-zinc-700",
            { "bg-zinc-700": mode === "test summary" }
          )}
          onClick={() => {
            setCurrent?.("test summary");
          }}
        >
          <div
            class={classNames(
              "flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative"
            )}
          >
            Test Summary
          </div>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
