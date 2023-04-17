import * as React from "react";
import { Stack, IStackTokens } from "@fluentui/react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { MOBILE_WIDTH } from "../statementSetup/StatementSetup";

interface ReusableStackProps {
    leftItem?: React.ReactNode;
    rightItem?: React.ReactNode;
}

const stackTokens: IStackTokens = {
    childrenGap: 8,
};

const HALF_ITEM = {
    width: '50%',
};

const FULL_WIDTH = {
    width: '100%'  
};

export const OneItemStack: React.FC<ReusableStackProps> = ({leftItem, rightItem}) => {

    const { width: windowWidth } = useWindowDimensions();
    const isMobile = windowWidth <= MOBILE_WIDTH;
    
    return (
        <>
            {leftItem ?
                (<Stack enableScopedSelectors horizontal tokens={stackTokens}>
                        <Stack.Item style={isMobile ? FULL_WIDTH : HALF_ITEM }>
                            {leftItem}
                        </Stack.Item>
                    </Stack>
                ) : (
                    <Stack enableScopedSelectors horizontal tokens={stackTokens} style={{flexDirection: "row-reverse", marginLeft: isMobile ? 0 : 8}}>
                        <Stack.Item style={isMobile ? FULL_WIDTH : HALF_ITEM }>
                            {rightItem}
                        </Stack.Item>
                    </Stack>)}
        </>
    );
};
