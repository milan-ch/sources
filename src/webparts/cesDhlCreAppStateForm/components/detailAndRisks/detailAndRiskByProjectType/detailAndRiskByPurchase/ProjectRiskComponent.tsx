import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { DefaultButton, IButtonStyles, Stack } from '@fluentui/react';

import { MultilineVerticalTextField } from '../../../general/MultilineVerticalTextField';

export const ProjectRiskComponent = (props: { placeHolderText: string }): JSX.Element => {
	const [color, setColor] = React.useState('grey'); // nastavit defaultní barvu na šedou
	const [isBorderVisible, setIsBorderVisible] = React.useState(false);
	const [textFieldHeight, setTextFieldHeight] = useState(null);
	const divRef = useRef(null);

	useEffect(() => {
		if (divRef.current) {
			setTextFieldHeight(divRef.current.offsetHeight);
		}
	}, []);

	const handleButtonClick = (buttonColor: any): void => {
		setColor(buttonColor);
		setIsBorderVisible(true);
	};

	const buttonStylesActive: IButtonStyles = {
		root: {
			backgroundColor: color,
			color: '#fff',
			height: '20%',
			fontWeight: 400
		},
		rootHovered: {
			backgroundColor: color,
			color: '#fff',
			height: '20%',
			fontWeight: 400
		}
	};

	const buttonStyles: IButtonStyles = {
		root: {
			height: '20%'
		},
		label: {
			fontWeight: 400
		}
	};

	return (
		<>
			<div
				ref={divRef}
				style={{ color: 'black', padding: 0, margin: 0 }}
				dangerouslySetInnerHTML={{ __html: props.placeHolderText }}
			/>
			<Stack style={{ justifyContent: 'space-between' }}>
				<DefaultButton
					styles={color === 'grey' ? buttonStylesActive : buttonStyles} // přidat podmínku pro šedou barvu
					onClick={() => handleButtonClick('grey')}
				>
					No risk
				</DefaultButton>
				<DefaultButton
					styles={color === 'green' ? buttonStylesActive : buttonStyles}
					onClick={() => handleButtonClick('green')}
				>
					Low
				</DefaultButton>
				<DefaultButton
					styles={color === 'orange' ? buttonStylesActive : buttonStyles}
					onClick={() => handleButtonClick('orange')}
				>
					Medium
				</DefaultButton>
				<DefaultButton
					styles={color === 'red' ? buttonStylesActive : buttonStyles}
					onClick={() => handleButtonClick('red')}
				>
					High
				</DefaultButton>
			</Stack>
			<MultilineVerticalTextField
				rows={4}
				style={{ height: textFieldHeight }}
				styles={{
					fieldGroup: {
						border: isBorderVisible ? `2px solid ${color}` : '2px solid #808080'
					}
				}}
			/>
		</>
	);
};
