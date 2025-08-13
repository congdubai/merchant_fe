import { message } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setRefreshTokenAction } from "../../redux/slice/accountSlide";

interface IProps {
    children: React.ReactNode
}

const LayoutApp = (props: IProps) => {


    return (
        <>

        </>
    )
}

export default LayoutApp;