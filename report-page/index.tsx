import { render } from "preact";
import { GroupedDatalogFiles } from "../chatalog/interface";
import Main from "./Main";
import "./index.css";

function renderReports(parentNode: Element, data: GroupedDatalogFiles[]) {
  render(<Main data={data} />, parentNode);
}

export default renderReports;
