import cliProgress from "cli-progress";

const createBar = (total: number) => {
  const bar = new cliProgress.SingleBar({
    format: "{bar} | {filename} | {value}/{total}",
  });
  bar.start(total, 0);
  return bar;
};

export { createBar };
