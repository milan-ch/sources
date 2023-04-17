import * as React from 'react';
import { TextField, ITextFieldProps } from '@fluentui/react';
import { WEBPART_CTX } from '../../CesDhlCreAppStateFormWebPart';

interface MultilineVerticalTextFieldProps extends ITextFieldProps {
	style?: React.CSSProperties;
}

export const MultilineVerticalTextField: React.FC<MultilineVerticalTextFieldProps> = props => {

	const ctx = React.useContext(WEBPART_CTX);
	const { style, ...otherProps } = props;

	const combinedStyle: React.CSSProperties = {
		resize: 'vertical',
		...style
	};

	const readOnlyStyle: React.CSSProperties = {
		resize: 'vertical',
		borderColor: "#605E5C",
		borderWidth: "1px",
		borderStyle: "solid",
		backgroundColor: "#E6E6E6",
		...style
	};

	return (
		<>
			{ctx.hasEditPermission && <TextField multiline={true} rows={4} style={combinedStyle} {...otherProps} />}
			{!ctx.hasEditPermission && <TextField multiline={true} rows={4} style={readOnlyStyle} readOnly={true} {...otherProps} />}
		</>
	);
};

