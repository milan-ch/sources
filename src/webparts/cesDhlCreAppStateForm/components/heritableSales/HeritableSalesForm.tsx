import * as React from 'react';
import { Label, Stack, TextField } from '@fluentui/react';
import { formatNumber } from '../../helpers/CommonHelper';
import { TextFieldReadOnly } from '../general/TextFieldReadOnly';
import { TwoItemsStack } from '../general/TwoItemsStack';
import { MultilineVerticalTextField } from '../general/MultilineVerticalTextField';
import { TextFieldNumber } from '../general/TextFieldNumber';
import { IHeritableSales } from './HeritableSaleTypes';
import { useDataStore } from '../tStore';
import { TInput, TInputs, useFormStore } from '../store';

export const HeritableSalesForm = (): JSX.Element => {
	const [formData, setFormData] = React.useState<IHeritableSales>({
		hPropertySize: null,
		hRemainingLeaseTerm: null,
		hCurrentGroundValue: null,
		hAdjustedGroundValue: null,
		hPropertyYield: null,
		hGroundValueNoBurden: null,
		hDiscountedGroundValue: null,
		hContractualGroundRent: null,
		hPresentGroundleaseValue: null,
		hReduction: null,
		hCurrentGroundRentSubsidy: null,
		hGRSPresentValue: null,
		hEncumberedPropertyValue: null,
		hSalesPrice: null,
		hOtherRemarks: null
	});

	const calculateGroundValueNoBurden = (formData: IHeritableSales): number => {
		return Number(formData.hPropertySize) * Number(formData.hAdjustedGroundValue);
	};

	const calculateDiscountedGroundValue = (formData: IHeritableSales): number => {
		return (
			calculateGroundValueNoBurden(formData) *
			(1 / Math.pow(1 + Number(formData.hPropertyYield) / 100, Number(formData.hRemainingLeaseTerm)))
		);
	};

	const calculatePresentGroundLeaseValue = (formData: IHeritableSales): number => {
		return (
			(Number(formData.hContractualGroundRent) *
				(Math.pow(1 + Number(formData.hPropertyYield) / 100, Number(formData.hRemainingLeaseTerm)) - 1)) /
			(Math.pow(1 + Number(formData.hPropertyYield) / 100, Number(formData.hRemainingLeaseTerm)) *
				Number(formData.hPropertyYield / 100))
		);
	};

	const calculateGRSPresentValue = (formData: IHeritableSales): number => {
		return (
			(Number(formData.hCurrentGroundRentSubsidy) *
				(Math.pow(1 + Number(formData.hPropertyYield) / 100, Number(formData.hRemainingLeaseTerm)) - 1)) /
			(Math.pow(1 + Number(formData.hPropertyYield) / 100, Number(formData.hRemainingLeaseTerm)) *
				Number(formData.hPropertyYield / 100))
		);
	};

	const recalculateValues = (form: IHeritableSales): void => {

		const copy = { ...form };

		const inputs: TInputs = useFormStore.getState().inputs;
		copy.hSalesPrice = inputs.Sales_x0020_Price.value;
		copy.hGroundValueNoBurden = calculateGroundValueNoBurden(copy);
		copy.hDiscountedGroundValue = calculateDiscountedGroundValue(copy);
		copy.hPresentGroundleaseValue = calculatePresentGroundLeaseValue(copy);
		copy.hGRSPresentValue = calculateGRSPresentValue(copy);
		copy.hEncumberedPropertyValue =
			calculateDiscountedGroundValue(copy) +
			calculatePresentGroundLeaseValue(copy) +
			calculateGRSPresentValue(copy) -
			Number(copy.hReduction);

		setFormData(copy);
	};

	const calculateValues = (): void => {
		setFormData(prevState => {
			return {
				...prevState,
				hGroundValueNoBurden: calculateGroundValueNoBurden(formData),
				hDiscountedGroundValue: calculateDiscountedGroundValue(formData),
				hPresentGroundleaseValue: calculatePresentGroundLeaseValue(formData),
				hGRSPresentValue: calculateGRSPresentValue(formData),
				hEncumberedPropertyValue:
					calculateDiscountedGroundValue(formData) +
					calculatePresentGroundLeaseValue(formData) +
					calculateGRSPresentValue(formData) -
					Number(formData.hReduction)
			};
		});
	};

	React.useEffect(() => {
		const form: IHeritableSales = useDataStore.getState().forms.HeritableSales;
		recalculateValues(form);
	}, []);

	React.useEffect(() => {
		useDataStore.getState().setHeritableSales(formData);
	}, [formData]);

	const inputChange = (key: keyof IHeritableSales, value: string | boolean | number): void => {
		setFormData(prevState => {
			return {
				...prevState,
				[key]: value
			};
		});
	};

	const handleEvent =
		(propName: keyof IHeritableSales): ((event: React.FormEvent<HTMLInputElement>) => void) =>
			(_event: React.FormEvent<HTMLInputElement>, newValue?: string | boolean | number): void => {
				inputChange(propName, newValue);
			};

	return (
		<>
			<TwoItemsStack
				leftItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Property Size (m²)</Label>
						<TextFieldNumber
							style={{ width: '50px' }}
							value={formatNumber(formData.hPropertySize)}
							onChange={handleEvent('hPropertySize')}
							onBlur={calculateValues}
						/>
					</Stack>
				}
				rightItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Remaining lease term of heritable building right (years)</Label>
						<TextFieldNumber
							style={{ width: '50px' }}
							value={formatNumber(formData.hRemainingLeaseTerm)}
							onChange={handleEvent('hRemainingLeaseTerm')}
							onBlur={calculateValues}
						/>
					</Stack>
				}
			/>
			<TwoItemsStack
				leftItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Current standard ground value (€/m²)</Label>
						<TextFieldNumber
							style={{ width: '50px' }}
							value={formatNumber(formData.hCurrentGroundValue)}
							onChange={handleEvent('hCurrentGroundValue')}
							onBlur={calculateValues}
						/>
					</Stack>
				}
				rightItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Adjusted ground value taking into account the actual structural land utilization (€/m²)</Label>
						<TextFieldNumber
							style={{ width: '50px' }}
							value={formatNumber(formData.hAdjustedGroundValue)}
							onChange={handleEvent('hAdjustedGroundValue')}
							onBlur={calculateValues}
						/>
					</Stack>
				}
			/>
			<TwoItemsStack
				leftItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Property yield for discounting / multiplier (%)</Label>
						<TextFieldNumber
							style={{ width: '50px' }}
							value={formatNumber(formData.hPropertyYield)}
							onChange={handleEvent('hPropertyYield')}
							onBlur={calculateValues}
						/>
					</Stack>
				}
				rightItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Ground value without burden of heritable building rights (€)</Label>
						<TextFieldReadOnly style={{ width: '50px' }} value={formatNumber(formData.hGroundValueNoBurden)} />
					</Stack>
				}
			/>
			<TwoItemsStack
				leftItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Discounted ground value over the remaining term of the leasehold (€)</Label>
						<TextFieldReadOnly style={{ width: '50px' }} value={formatNumber(formData.hDiscountedGroundValue)} />
					</Stack>
				}
				rightItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Contractual ground rent p.a. (€)</Label>
						<TextField
							style={{ width: '50px' }}
							type="number"
							value={formatNumber(formData.hContractualGroundRent)}
							onChange={handleEvent('hContractualGroundRent')}
							onBlur={calculateValues}
						/>
					</Stack>
				}
			/>
			<TwoItemsStack
				leftItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Present value of the groundlease until the end of the heritable building rights (€)</Label>
						<TextFieldReadOnly style={{ width: '50px' }} value={formatNumber(formData.hPresentGroundleaseValue)} />
					</Stack>
				}
				rightItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Reduction due to missing adjustment clause for the increase in ground lease (€)</Label>
						<TextFieldNumber
							style={{ width: '50px' }}
							value={formatNumber(formData.hReduction)}
							onChange={handleEvent('hReduction')}
							onBlur={calculateValues}
						/>
					</Stack>
				}
			/>
			<TwoItemsStack
				leftItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Curent ground rent subsidy p.a. (€)</Label>
						<TextFieldNumber
							style={{ width: '50px' }}
							value={formatNumber(formData.hCurrentGroundRentSubsidy)}
							onChange={handleEvent('hCurrentGroundRentSubsidy')}
							onBlur={calculateValues}
						/>
					</Stack>
				}
				rightItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Present value of ground rent subsidy (€)</Label>
						<TextFieldReadOnly style={{ width: '50px' }} value={formatNumber(formData.hGRSPresentValue)} />
					</Stack>
				}
			/>
			<TwoItemsStack
				leftItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Value of the encumbered property subject to the heritable rights (€)</Label>
						<TextFieldReadOnly style={{ width: '50px' }} value={formatNumber(formData.hEncumberedPropertyValue)} />
					</Stack>
				}
				rightItem={
					<Stack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Label>Sales Price (k€)</Label>
						<TextFieldReadOnly style={{ width: '50px' }} readOnly value={formatNumber(formData.hSalesPrice)} />
					</Stack>
				}
			/>
			<MultilineVerticalTextField
				label="Other Remarks"
				value={formData.hOtherRemarks}
				onChange={handleEvent('hOtherRemarks')}
			/>
		</>
	);
};
