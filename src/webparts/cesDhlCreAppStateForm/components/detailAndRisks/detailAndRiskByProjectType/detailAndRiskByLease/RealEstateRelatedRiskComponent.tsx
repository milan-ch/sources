import * as React from 'react';
import { useEffect, useState } from 'react';
import { CommandBarButton, DefaultButton, IButtonStyles, IIconProps, Label, Separator, Stack } from '@fluentui/react';
import { DeleteModal } from '../../../general/DeleteModal';
import styles from '../../../baseData/baseDataByProjectType/baseDataByLease/BaseDataFormByLease.module.scss';
import {ICurrent} from "../../../baseData/BaseDataTypes";
import {CurrentDefault} from "../../../baseData/BaseDataHelper";
import { MultilineVerticalTextField } from '../../../general/MultilineVerticalTextField';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { MOBILE_WIDTH } from '../../../statementSetup/StatementSetup';

export const RealEstateRelatedRiskComponent = (): JSX.Element => {
	const [RiskFields, setRiskFields] = useState<ICurrent[]>([]);
	const [deleteRiskIndex, setDeleteRiskIndex] = useState<number>(-1);

	const { width: windowWidth } = useWindowDimensions();
	const isMobile = windowWidth <= MOBILE_WIDTH;

	const handleButtonClick = (buttonColor: string, index: number): void => {
		setRiskFields(prevState =>
			prevState.map((field, i) => (i === index ? { ...field, color: buttonColor, isBorderVisible: true } : field))
		);
	};

	const handleTextFieldChange = (
		value: string,
		index: number,
		fieldName: 'textContent' | 'mitigationContent'
	): void => {
		setRiskFields(prevState => prevState.map((field, i) => (i === index ? { ...field, [fieldName]: value } : field)));
	};

	const onDismissRisk = (): void => {
		setDeleteRiskIndex(-1);
	};

	const onDeleteRisk = (index: number): void => {
		// Add the index parameter
		const newFields = [...RiskFields];
		newFields.splice(index, 1); // Use the index parameter here
		setRiskFields(newFields);
		setDeleteRiskIndex(-1);
	};

	const deleteIcon: IIconProps = { iconName: 'Delete' };
	const addLeaseIcon: IIconProps = { iconName: 'CirclePlus' };

	const RiskDeleteField = (index: number): void => {
		setDeleteRiskIndex(index);
	};

	const RiskAddField = (): void => {
		setRiskFields([...RiskFields, { ...CurrentDefault }]);
	};

	useEffect(() => {
		RiskAddField();
	}, []);

	const renderFieldsCurrentSituation = (): JSX.Element[] => {
		return RiskFields.map((field, index) => {
			const buttonStylesActive = (color: string): IButtonStyles => {
				return {
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
				<Stack key={index}>
					{index > 0 && <Separator />}
					<Stack style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
						<Label>Risk</Label>
						<Stack>
							<DeleteModal
								isOpen={deleteRiskIndex === index}
								onDismiss={onDismissRisk}
								onDelete={() => onDeleteRisk(index)}
							/>
							<CommandBarButton
								iconProps={deleteIcon}
								onClick={() => RiskDeleteField(index)}
								className={styles.noHover}
								style={{ paddingTop: 6 }}
							/>
						</Stack>
					</Stack>
					<Stack
						style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between' }}
					>
						<Stack style={{ justifyContent: 'space-between', width: isMobile ? '' : '15%' }}>
							<DefaultButton
								styles={field.color === 'grey' ? buttonStylesActive('grey') : buttonStyles}
								onClick={() => handleButtonClick('grey', index)}
							>
								No risk
							</DefaultButton>
							<DefaultButton
								styles={field.color === 'green' ? buttonStylesActive('green') : buttonStyles}
								onClick={() => handleButtonClick('green', index)}
							>
								Low
							</DefaultButton>
							<DefaultButton
								styles={field.color === 'orange' ? buttonStylesActive('orange') : buttonStyles}
								onClick={() => handleButtonClick('orange', index)}
							>
								Medium
							</DefaultButton>
							<DefaultButton
								styles={field.color === 'red' ? buttonStylesActive('red') : buttonStyles}
								onClick={() => handleButtonClick('red', index)}
							>
								High
							</DefaultButton>
						</Stack>
						<Stack style={{ width: isMobile ? '' : '84%' }}>
							<MultilineVerticalTextField
								rows={5}
								value={field.textContent}
								onChange={(e, newValue) => handleTextFieldChange(newValue || '', index, 'textContent')}
								styles={{
									fieldGroup: {
										border: field.isBorderVisible ? `1px solid ${field.color}` : '1px solid #808080'
									}
								}}
							/>
						</Stack>
					</Stack>
					<MultilineVerticalTextField
						label="Mitigation"
						rows={4}
						value={field.mitigationContent}
						onChange={(e, newValue) => handleTextFieldChange(newValue || '', index, 'mitigationContent')}
					/>
				</Stack>
			);
		});
	};

	return (
		<>
			{' '}
			{renderFieldsCurrentSituation()}
			<CommandBarButton
				iconProps={addLeaseIcon}
				text="Add another risk"
				onClick={RiskAddField}
				className={styles.noHover}
				style={{ marginTop: 8, width: 180 }}
			/>
		</>
	);
};
