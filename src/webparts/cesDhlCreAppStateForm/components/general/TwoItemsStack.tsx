import * as React from 'react';
import { Stack, IStackTokens } from '@fluentui/react';
import { MOBILE_WIDTH } from '../statementSetup/StatementSetup';
import useWindowDimensions from '../../hooks/useWindowDimensions';

interface ReusableStackProps {
	leftItemLabel?: React.ReactNode;
	rightItemLabel?: React.ReactNode;
	leftItem: React.ReactNode;
	rightItem: React.ReactNode;
}

const stackTokens: IStackTokens = {
	childrenGap: 8
};

const FULL_WIDTH = {
	width: '100%'
};

const FULL_WIDTH_WITHOUT_MARGIN = {
	width: '100%',
	marginLeft: '0px'
};

export const TwoItemsStack: React.FC<ReusableStackProps> = ({ leftItemLabel, rightItemLabel, leftItem, rightItem }) => {
	const { width: windowWidth } = useWindowDimensions();
	const isMobile = windowWidth <= MOBILE_WIDTH;

	return (
		<Stack
			enableScopedSelectors
			horizontal
			tokens={stackTokens}
			style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}
		>
			<Stack.Item style={isMobile ? FULL_WIDTH_WITHOUT_MARGIN : FULL_WIDTH}>
				{leftItemLabel}
				{leftItem}
			</Stack.Item>
			<Stack.Item style={isMobile ? FULL_WIDTH_WITHOUT_MARGIN : FULL_WIDTH}>
				{rightItemLabel}
				{rightItem}
			</Stack.Item>
		</Stack>
	);
};
