import styled from "@emotion/styled";
import React from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
}

function SectionHeader({ children, className }: Props) {
    return <div className={className}>{children}</div>;
}

export default styled(SectionHeader)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
