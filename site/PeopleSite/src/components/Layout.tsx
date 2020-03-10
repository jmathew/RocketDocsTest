import React, { ReactNode } from "react";

interface IProps {
    children: ReactNode;
}

export const Layout = ({children}:IProps) => {
    return (
        <div>
            HI!
            {children}
        </div>
    )
}