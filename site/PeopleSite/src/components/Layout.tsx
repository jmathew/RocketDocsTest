import React, { ReactNode } from "react";

interface IProps {
    children: ReactNode;
}

/**
 * A general component that handles the overall layouting of each page.
 * Meant to be used in all pages of the website.
 * It is a gatsby convention.
 */
export const Layout = ({children}:IProps) => {
    return (
        <div>
            {children}
        </div>
    )
}