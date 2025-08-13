import { ConfigProvider } from "antd";
import LayoutAdmin from "./components/admin/layout.admin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import viVN from 'antd/es/locale/vi_VN';
import MerchantPage from "./page/admin/merchant";
import ReportPage from "./page/admin/report";


export default function App() {


  const router = createBrowserRouter([
    {
      path: "/admin",
      element: (<LayoutAdmin />),
      //errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <MerchantPage />
        },
        {
          path: "report",
          element:
            <ReportPage />
        },
      ],
    },

  ]);

  return (
    <>
      <ConfigProvider locale={viVN}>
        <RouterProvider router={router} />
      </ConfigProvider>

    </>

  )
}
