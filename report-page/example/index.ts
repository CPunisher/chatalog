import { Module } from "@chatalog/interface/commons";
import renderReports from "../src/";
import data_1st_dimension from "./1st_dimension.csv.json";
import data_semantic from "./date_semantic.csv.json";

renderReports(document.getElementById("app")!, "string-trans", [
  data_1st_dimension as Module<unknown>,
  data_semantic as Module<unknown>,
]);
