import { render } from "preact";
import { GroupedDatalogFiles } from "../chatalog-cli/interface";
import Main from "./components/Main";
import "./index.css";

function renderReports(parentNode: Element, data: GroupedDatalogFiles[]) {
  render(<Main data={data} />, parentNode);
}

export default renderReports;
