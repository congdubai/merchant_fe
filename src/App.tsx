import { ConfigProvider } from "antd";
import LayoutAdmin from "./components/admin/layout.admin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import viVN from 'antd/es/locale/vi_VN';
import MerchantPage from "./page/merchant";


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
