import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import ReportContext from "../context";
import classNames from "classnames";

const Sidebar: FunctionalComponent = () => {
  const { data = [], current, setCurrent } = useContext(ReportContext) || {};
  return (
    <div class="dark overflow-auto bg-zinc-800 p-2 space-y-1 fixed inset-y-0 flex w-[260px] flex-col">
      <div class="flex flex-col gap-2 text-gray-100 text-sm">
        {data.map((group) => (
          <a
            class={classNames(
              "flex py-3 px-3 items-center gap-3 rounded-md cursor-pointer break-all hover:bg-zinc-700",
              { "bg-zinc-700": group === current }
            )}
            onClick={() => setCurrent?.(group)}
          >
            <div class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
              {group.rules[0].name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
