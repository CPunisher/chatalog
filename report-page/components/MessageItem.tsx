import classNames from "classnames";
import { FunctionalComponent, VNode } from "preact";

interface MessageItemProps {
  className?: string;
  prompt?: VNode;
}

const MessageItem: FunctionalComponent<MessageItemProps> = ({
  className,
  prompt,
  children,
}) => {
  return (
    <div
      class={classNames(
        "w-full text-gray-800 border-b border-black/10",
        className
      )}
    >
      <div class="flex gap-4 text-base whitespace-pre-wrap m-auto p-4  md:gap-6 md:max-w-2xl md:py-6 lg:max-w-2xl xl:max-w-3xl">
        {prompt && <div>{prompt}</div>}
        <div class="min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default MessageItem;
