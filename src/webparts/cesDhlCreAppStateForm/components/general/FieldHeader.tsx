import * as React from 'react';
import { Label, Stack } from '@fluentui/react';
import { TooltipHost, Icon } from '@fluentui/react';

interface IInfoProps {
	info: string | JSX.Element | JSX.Element[];
}

const styles: React.CSSProperties = {
	marginTop: 'auto',
	marginBottom: 'auto',
	paddingLeft: '10px',
	color: 'rgb(97, 178, 216)',
	cursor: 'pointer',
};

export const Info = (props: IInfoProps): JSX.Element => {
	return (
		props.info !== '' &&
		props.info !== null &&
		props.info !== undefined && (
			<div style={styles}>
				<TooltipHost content={props.info}>
					<Icon iconName='Info' />
				</TooltipHost>
			</div>
		)
	);
};
interface IAsteriskProps {
	required: boolean;
	readOnly: boolean;
	showAsterisk?: boolean;
}

export const Asterisk = (props: IAsteriskProps): JSX.Element => {
	return props.showAsterisk ? !props.readOnly && props.required && <Label style={{ color: 'rgb(168, 0, 0)', marginLeft: '4px' }}>*</Label> : null;
};
interface IFieldHeader {
	htmlFor: string;
	label: string;
	required: boolean;
	readOnly: boolean;
	info: string | JSX.Element | JSX.Element[];
	stackClassName: string;
	showAsterisk?: boolean;
}

export const FieldHeader = (props: IFieldHeader): JSX.Element => {
	return (
		<Stack horizontal className={props.stackClassName}>
			{props.label !== null && props.label !== undefined && (
				<Label htmlFor={props.htmlFor} style={{ fontWeight: 600 }}>
					{props.label}
				</Label>
			)}
			<Asterisk required={props.required} readOnly={props.readOnly} showAsterisk={props.showAsterisk === undefined ? true : props.showAsterisk} />
			<Info info={props.info} />
		</Stack>
	);
};
