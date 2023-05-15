import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import ReportContext from "../../context";
import SouffleFile from "./SouffleFile";
import StringTransFile from "./StringTransFile";

const File: FunctionalComponent = () => {
  const { type } = useContext(ReportContext) || {};
  switch (type) {
    case "souffle":
      return <SouffleFile />;
    case "string-trans":
      return <StringTransFile />;
  }
  return null;
};

export default File;
