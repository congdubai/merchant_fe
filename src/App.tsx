import { ConfigProvider } from "antd";
import LayoutAdmin from "./components/admin/layout.admin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import viVN from 'antd/es/locale/vi_VN';
import MerchantPage from "./page/admin/merchant";
import ReportPage from "./page/admin/report";
import LoginPage from "./page/auth/login";
import MerchantHistory from "./page/admin/merchant_history";
import UserPage from "./page/admin/user";
import RolePage from "./page/admin/role";
import PermissionPage from "./page/admin/permission";
import ProtectedRoute from "./components/share/protected-route.ts";
import LayoutApp from "./components/share/layout.app";
import NotFound from "./components/share/not.found";
import { useEffect } from "react";
import { useAppDispatch } from "./redux/hooks";
import { fetchAccount } from "./redux/slice/accountSlide";

export default function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // if (
    //   window.location.pathname === '/login'
    //   || window.location.pathname === '/register'
    // )
    //   return;
    dispatch(fetchAccount())
  }, [])
  const router = createBrowserRouter([
    {
      path: "/admin",
      element: (<LayoutApp><LayoutAdmin /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <MerchantPage />
            </ProtectedRoute>

        },
        {
          path: "report",
          element:
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>

        },
        {
          path: "merchant-history",
          element:
            <ProtectedRoute>
              <MerchantHistory />
            </ProtectedRoute>

        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>

        },
        {
          path: "role",
          element:
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>

        },
        {
          path: "permisson",
          element:
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>

        }
      ],
    },
    {
      path: "/",
      element: <LoginPage />,
    }
  ]);

  return (
    <>
      <ConfigProvider locale={viVN}>
        <RouterProvider router={router} />
      </ConfigProvider>

    </>

  )
}
