import { FunctionalComponent, render } from "preact";
import Main from "./Main";
import "./index.css";
import { Module, ModuleType } from "@chatalog/interface/commons";
import ReportContext from "./context";
import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";
import Conversation from "./layout/Conversation";
import File from "./layout/File";
import Result from "./layout/Result";
import Summary from "./layout/Summary";
import Home from "./layout/Home";

const App: FunctionalComponent<{
  type: ModuleType;
  data: Module<unknown>[];
}> = ({ type, data }) => {
  const router = createHashRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          path: "summary",
          element: <Summary />,
        },
        {
          path: ":id",
          element: <Home />,
          children: [
            {
              path: "conversation",
              element: <Conversation />,
            },
            {
              path: "file",
              element: <File />,
            },
            {
              path: "result",
              element: <Result />,
            },
            {
              path: "",
              element: <Navigate to="conversation" replace />,
            },
          ],
        },
        {
          path: "",
          element: <Navigate to="0/conversation" replace />,
        },
      ],
    },
  ]);

  return (
    <ReportContext.Provider
      value={{
        type,
        data,
      }}
    >
      <RouterProvider router={router} />
    </ReportContext.Provider>
  );
};

function renderReports(
  parentNode: Element,
  type: ModuleType,
  data: Module<unknown>[]
) {
  render(<App type={type} data={data} />, parentNode);
}

export default renderReports;
