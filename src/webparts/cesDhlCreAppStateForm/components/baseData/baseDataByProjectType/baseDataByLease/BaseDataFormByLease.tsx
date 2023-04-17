import * as React from 'react';
import { FormSection, TextSection } from '../../../statementSetup/StatementSetup';
import { Checkbox, CommandBarButton, IIconProps, Label, Stack, TextField } from '@fluentui/react';
import styles from './BaseDataFormByLease.module.scss';
import { useState } from 'react';
import { formatNumber } from '../../../../helpers/CommonHelper';
import { DeleteModal } from '../../../general/DeleteModal';
import { useDataStore } from '../../../tStore';
import {IBaseDataLease, ICurrent, ICurrentTotals, ICurrentVsProposed, IProposed, IProposedTotals} from "../../BaseDataTypes";
import {CurrentDefault, CurrentTotalsDefault, CurrentVsProposedDefault, ProposedDefault, ProposedTotalsDefault} from "../../BaseDataHelper";
import { cloneDeep } from 'lodash';
import { TextFieldReadOnly } from '../../../general/TextFieldReadOnly';
import { TextFieldNumber } from '../../../general/TextFieldNumber';
import { CustomTextField } from '../../../general/CustomTextField';
import { ScrollablePane } from '../../../general/ScrollablePane';
import { CustomDatePickerField } from '../../../general/CustomDatePickerField';
import * as moment from 'moment';

export const BaseDataFormByLease = (): JSX.Element => {
	/** CURRENT SITUATION - dynamic fields */
	const [currentFields, setCurrentFields] = useState<ICurrent[]>([]);
	const [currentTotals, setCurrentTotals] = useState<ICurrentTotals>(CurrentTotalsDefault);
	const [deleteCurrentCalled, setDeleteCurrentCalled] = useState<boolean>(false);
	const [deleteCurrentIndex, setDeleteCurrentIndex] = useState<number>(-1);
	const [currentComment, setCurrentComment] = useState<string>('');

	/** PROPOSED SITUATION - dynamic fields */
	const [proposedFields, setProposedFields] = useState<IProposed[]>([]);
	const [proposedTotals, setProposedTotals] = useState<IProposedTotals>(ProposedTotalsDefault);
	const [deleteProposedCalled, setDeleteProposedCalled] = useState<boolean>(false);
	const [deleteProposedIndex, setDeleteProposedIndex] = useState<number>(-1);
	const [proposedComment, setProposedComment] = useState<string>('');

	/** Difference - CURRENT VS PROPOSED */
	const [difference, setDifference] = useState<ICurrentVsProposed>(CurrentVsProposedDefault);

	React.useEffect(() => {
		// loadovani dat ze store
		const form: IBaseDataLease = useDataStore.getState().forms.BaseData.Lease;
		setCurrentFields(form.currentFields);
		setProposedFields(form.proposedFields);
		setCurrentComment(form.currentComment);
		setProposedComment(form.proposedComment);
		// aktualizace vypoctu
		setDeleteCurrentCalled(true);
		setDeleteProposedCalled(true);
	}, []);

	const saveDataToStore = () => {
		const data: IBaseDataLease = {
			currentComment: currentComment,
			currentFields: currentFields,
			proposedComment: proposedComment,
			proposedFields: proposedFields
		};
		useDataStore.getState().setBaseDataLease(data);
	};

	React.useEffect(() => {
		saveDataToStore();
	}, [currentFields, proposedFields, currentComment, proposedComment]);

	/** Difference - CURRENT VS PROPOSED */
	const calculateDifference = () => {
		const copy = { ...CurrentVsProposedDefault };
		copy.differenceWarehouseAreaTotal =
			((proposedTotals.proposedWarehouseAreaTotal - currentTotals.currentWarehouseAreaTotal) /
				currentTotals.currentWarehouseAreaTotal) *
			100;
		copy.differenceOfficeAreaTotal =
			((proposedTotals.proposedOfficeAreaTotal - currentTotals.currentOfficeAreaTotal) /
				currentTotals.currentOfficeAreaTotal) *
			100;
		copy.differenceOtherAreaTotal =
			((proposedTotals.proposedOtherAreaTotal - currentTotals.currentOtherAreaTotal) /
				currentTotals.currentOtherAreaTotal) *
			100;
		copy.differenceTotalAreaTotal =
			((proposedTotals.proposedTotalAreaTotal - currentTotals.currentTotalAreaTotal) /
				currentTotals.currentTotalAreaTotal) *
			100;
		copy.differenceRentPerYearTotal =
			((proposedTotals.proposedRentPerYearTotal - currentTotals.currentRentPerYearTotal) /
				currentTotals.currentRentPerYearTotal) *
			100;
		copy.differenceRentPerMonthTotal =
			((proposedTotals.proposedRentPerMonthTotal - currentTotals.currentRentPerMonthTotal) /
				currentTotals.currentRentPerMonthTotal) *
			100;

		// kontrola Infinity + zaokrouhleni
		Object.keys(copy).forEach((key: keyof ICurrentVsProposed) => {
			if (!isNaN(copy[key]) && isFinite(copy[key])) {
				copy[key] = Number(copy[key]);
			} else {
				copy[key] = 0;
			}
		});

		setDifference(copy);
	};

	React.useEffect(() => {
		calculateDifference();
	}, [currentTotals, proposedTotals]);

	// vypocet vsech souctu
	const calculateCurrent = (): void => {
		const newTotals = { ...CurrentTotalsDefault };
		const editedFields = cloneDeep(currentFields);
		editedFields.forEach(field => {
			// horni soucet - Total m^2
			let currentTotalArea = 0;
			if (field.currentWarehouseArea) currentTotalArea += Number(field.currentWarehouseArea);
			if (field.currentOfficeArea) currentTotalArea += Number(field.currentOfficeArea);
			if (field.currentOtherArea) currentTotalArea += Number(field.currentOtherArea);
			field.currentTotalArea = currentTotalArea.toString();

			// horni soucet - Total per mth (€/m²)
			if (field.currentRentperYear && field.currentTotalArea) {
				field.currentRentperMonth = ((Number(field.currentRentperYear) * 1000) / 12 / currentTotalArea).toString();
			} else field.currentRentperMonth = '0';

			// spodni soucty hodnot
			if (field.currentWarehouseArea) newTotals.currentWarehouseAreaTotal += Number(field.currentWarehouseArea);
			if (field.currentOfficeArea) newTotals.currentOfficeAreaTotal += Number(field.currentOfficeArea);
			if (field.currentOtherArea) newTotals.currentOtherAreaTotal += Number(field.currentOtherArea);
			if (field.currentTotalArea) newTotals.currentTotalAreaTotal += Number(field.currentTotalArea);
			if (field.currentRentperYear) newTotals.currentRentPerYearTotal += Number(field.currentRentperYear);
			// newTotals.currentRentPerMonthTotal - pocitam az po secteni vsech radku
		});
		setCurrentFields(editedFields);

		// if ((sum(currentRentPerYear / 12) / sum (currentTotalArea) > 0) { (sum(currentRentPerYear / 12) / sum (currentTotalArea) } else { 0 }
		// if (newTotals.currentTotalAreaTotal) // bug todo - pokud je soucet total nula, vypocet je Infinity
		if (newTotals.currentRentPerYearTotal / 12 / newTotals.currentTotalAreaTotal > 0) {
			newTotals.currentRentPerMonthTotal =
				((newTotals.currentRentPerYearTotal / 12) * 1000) / newTotals.currentTotalAreaTotal;
		} else {
			newTotals.currentRentPerMonthTotal = 0;
		}

		// zmena totals vyvola pres useEffect calculateDifference()
		setCurrentTotals(newTotals);
	};

	const CurrentAddField = (): void => {
		setCurrentFields([...currentFields, CurrentDefault]);
	};

	const CurrentDeleteField = (index: number): void => {
		setDeleteCurrentIndex(index);
	};

	const ProposedDeleteField = (index: number): void => {
		setDeleteProposedIndex(index);
	};

	const onDeleteCurrent = (): void => {
		const newFields = [...currentFields];
		newFields.splice(deleteCurrentIndex, 1);
		setCurrentFields(newFields);
		setDeleteCurrentIndex(-1);
		setDeleteCurrentCalled(true);
		calculateDifference();
	};

	const onDismissCurrent = (): void => {
		setDeleteCurrentIndex(-1);
	};

	const onDismissProposed = (): void => {
		setDeleteProposedIndex(-1);
	};

	React.useEffect(() => {
		if (deleteCurrentCalled) {
			calculateCurrent();
			setDeleteCurrentCalled(false);
		}
	}, [deleteCurrentCalled]);

	const CurrentInputChange = (index: number, property: string, value: string | boolean | number | Date): void => {
		const copy = [...currentFields];
		const editField = { ...copy[index], [property]: value };
		copy[index] = editField;
		setCurrentFields(copy);
	};

	/** PROPOSED SITUATION - dynamic fields */
	// vypocet vsech souctu
	const calculateProposed = (): void => {
		const totals = { ...ProposedTotalsDefault };
		const editedFields = cloneDeep(proposedFields);
		editedFields.forEach(field => {
			// rozdil datumu
			if (field.proposedStartDate && field.proposedEndDate) {
				const diffTime = Math.abs(new Date(field.proposedStartDate).getTime() - new Date(field.proposedEndDate).getTime());
				const diffYears = (diffTime / (1000 * 60 * 60 * 24 * 365)).toFixed(2);
				field.proposedLeaseYears = diffYears;
			}

			// horni soucet - Total m^2
			let proposedTotalArea = 0;
			if (field.proposedWarehouseArea) proposedTotalArea += Number(field.proposedWarehouseArea);
			if (field.proposedOfficeArea) proposedTotalArea += Number(field.proposedOfficeArea);
			if (field.proposedOtherArea) proposedTotalArea += Number(field.proposedOtherArea);
			field.proposedTotalArea = proposedTotalArea.toString();

			// horni soucet - Total per mth (€/m²)
			if (field.proposedRentperYear && field.proposedTotalArea) {
				field.proposedRentperMonth = (
					(Number(field.proposedRentperYear) * 1000) /
					12 /
					Number(field.proposedTotalArea)
				).toString();
			} else field.proposedRentperMonth = '0';

			//horni soucet - Total Cost k Euro
			if (field.proposedLeaseYears && field.proposedRentperYear)
				field.proposedTotalCost = (Number(field.proposedLeaseYears) * Number(field.proposedRentperYear)).toString();
			else field.proposedTotalCost = '0';

			// spodni soucty hodnot
			if (field.proposedWarehouseArea) totals.proposedWarehouseAreaTotal += Number(field.proposedWarehouseArea);
			if (field.proposedOfficeArea) totals.proposedOfficeAreaTotal += Number(field.proposedOfficeArea);
			if (field.proposedOtherArea) totals.proposedOtherAreaTotal += Number(field.proposedOtherArea);
			if (field.proposedTotalArea) totals.proposedTotalAreaTotal += Number(field.proposedTotalArea);
			if (field.proposedRentperYear) totals.proposedRentPerYearTotal += Number(field.proposedRentperYear);
			if (field.proposedTotalCost) totals.proposedTotalCostTotal += Number(field.proposedTotalCost);
		});
		setProposedFields(editedFields);

		// if ((sum(proposedRentPerYear / 12) / sum(proposedTotalArea) > 0){ (sum(proposedRentPerYear / 12) * 1000  / sum (proposedTotalArea) } else { 0 }
		// if (newTotals.currentTotalAreaTotal) // bug todo - pokud je soucet total nula, vypocet je Infinity
		if (totals.proposedRentPerYearTotal / 12 / totals.proposedTotalAreaTotal > 0) {
			totals.proposedRentPerMonthTotal =
				((totals.proposedRentPerYearTotal / 12) * 1000) / totals.proposedTotalAreaTotal;
		} else {
			totals.proposedRentPerMonthTotal = 0;
		}

		// zmena totals vyvola pres useEffect calculateDifference()
		setProposedTotals(totals);
	};

	const proposedAddField = (): void => {
		setProposedFields([...proposedFields, ProposedDefault]);
	};

	const onProposedDeleteField = (): void => {
		// setProposedFields(ProposedFields.filter((field: any) => field.id !== id));
		const newFields = [...proposedFields];
		newFields.splice(deleteProposedIndex, 1);
		setProposedFields(newFields);
		setDeleteProposedIndex(-1);
		setDeleteProposedCalled(true);
		calculateDifference();
	};

	React.useEffect(() => {
		if (deleteProposedCalled) {
			calculateProposed();
			setDeleteProposedCalled(false);
		}

	}, [deleteProposedCalled]);

	const proposedInputChange = (index: number, property: string, value: string | number | Date): void => {
		const copy = [...proposedFields];
		const editField = { ...copy[index], [property]: value };
		copy[index] = editField;
		setProposedFields(copy);
	};

	const deleteIcon: IIconProps = { iconName: 'Delete' };
	const addLeaseIcon: IIconProps = { iconName: 'CirclePlus' };

	/** Current Situation */
	const renderFieldsCurrentSituation = (): JSX.Element[] => {
		return currentFields.map((field, index) => {
			const handleEvent =
				(propName: keyof ICurrent): ((event: React.FormEvent<HTMLInputElement>) => void) =>
					(_event: React.FormEvent<HTMLInputElement>, newValue?: string | boolean | number): void => {
						CurrentInputChange(index, propName, newValue);
					};

			const handleDate = (propName: keyof ICurrent) => (date: Date) => {
				CurrentInputChange(index, propName, moment(date).format("MM/DD/YYYY"));
			};

			return (
				<div key={index} style={{ marginTop: 8 }}>
					<Stack className={styles.currentSubHeader}>
						<CustomTextField value={field.currentLocationCity} onChange={handleEvent('currentLocationCity')} />
						<CustomTextField value={field.currentLocationCode} onChange={handleEvent('currentLocationCode')} />
						<Checkbox						
							checked={field.currentOwned}
							className={styles.ownedCheckBox}
							onChange={handleEvent('currentOwned')}
						/>
						<CustomDatePickerField
							val={field.currentExpirationDate}
							onSelectDate={handleDate('currentExpirationDate')}							
						/>
						<TextFieldNumber
							value={field.currentWarehouseArea.toString()}
							onChange={handleEvent('currentWarehouseArea')}
							onBlur={calculateCurrent}
						/>
						<TextFieldNumber
							value={field.currentOfficeArea.toString()}
							onChange={handleEvent('currentOfficeArea')}
							onBlur={calculateCurrent}
						/>
						<TextFieldNumber
							value={field.currentOtherArea.toString()}
							onChange={handleEvent('currentOtherArea')}
							onBlur={calculateCurrent}
						/>
						<TextFieldReadOnly value={formatNumber(field.currentTotalArea)} />
						<TextFieldNumber
							value={field.currentRentperYear}
							onChange={handleEvent('currentRentperYear')}
							onBlur={calculateCurrent}
						/>
						<TextFieldReadOnly value={formatNumber(field.currentRentperMonth)} />
						{currentFields.length > 0 && (
							<Stack>
								<DeleteModal
									isOpen={deleteCurrentIndex === index}
									onDismiss={onDismissCurrent}
									onDelete={onDeleteCurrent}
								/>
								<CommandBarButton
									iconProps={deleteIcon}
									onClick={() => CurrentDeleteField(index)}
									className={styles.noHover}
									style={{ paddingTop: 6 }}
								/>
							</Stack>
						)}
					</Stack>
				</div>
			);
		});
	};

	/** Proposed Situation */
	const renderFieldsProposedSituation = (): JSX.Element[] => {
		return proposedFields.map((field, index) => {
			const handleEvent =
				(propName: keyof IProposed): ((event: React.FormEvent<HTMLInputElement>) => void) =>
					(_event: React.FormEvent<HTMLInputElement>, newValue?: string | number): void => {
						proposedInputChange(index, propName, newValue);
					};

			const handleDate = (propName: keyof IProposed) => (date: Date) => {
				proposedInputChange(index, propName, moment(date).format("MM/DD/YYYY"));
				// volani prepoctu souctu proposed
				setDeleteProposedCalled(true);
			};

			return (
				<div key={index} style={{ marginTop: 8 }}>
					<Stack className={styles.proposedSubHeader}>
						<CustomTextField value={field.proposedCity} onChange={handleEvent('proposedCity')} />
						<CustomDatePickerField							
							val={field.proposedStartDate}
							onSelectDate={handleDate('proposedStartDate')}
						/>
						<CustomDatePickerField
							val={field.proposedEndDate}
							onSelectDate={handleDate('proposedEndDate')}
						/>
						<TextFieldReadOnly value={formatNumber(field.proposedLeaseYears)} />
						<TextFieldNumber
							value={field.proposedWarehouseArea.toString()}
							onChange={handleEvent('proposedWarehouseArea')}
							onBlur={calculateProposed}
						/>
						<TextFieldNumber
							value={field.proposedOfficeArea.toString()}
							onChange={handleEvent('proposedOfficeArea')}
							onBlur={calculateProposed}
						/>
						<TextFieldNumber
							value={field.proposedOtherArea.toString()}
							onChange={handleEvent('proposedOtherArea')}
							onBlur={calculateProposed}
						/>
						<TextFieldReadOnly value={formatNumber(field.proposedTotalArea)} />
						<TextFieldNumber
							value={field.proposedRentperYear.toString()}
							onChange={handleEvent('proposedRentperYear')}
							onBlur={calculateProposed}
						/>
						<TextFieldReadOnly value={formatNumber(field.proposedRentperMonth)} />
						<TextFieldReadOnly value={formatNumber(field.proposedTotalCost)} />
						{proposedFields.length > 0 && (
							<Stack>
								<DeleteModal
									isOpen={deleteProposedIndex === index}
									onDismiss={onDismissProposed}
									onDelete={onProposedDeleteField}
								/>
								<CommandBarButton
									iconProps={deleteIcon}
									onClick={() => ProposedDeleteField(index)}
									className={styles.noHover}
									style={{ paddingTop: 6 }}
								/>
							</Stack>
						)}
					</Stack>
				</div>
			);
		});
	};

	/** SPOLECNA sjednocujici komponenta */
	return (
		<>
			<Stack style={{ paddingTop: 10 }}>
				<FormSection text={'Current Situation'} />
				<ScrollablePane>
					<TextField
						label={'Comment'}
						value={currentComment}
						onChange={e => {
							const target = e.target as HTMLInputElement;
							setCurrentComment(target.value);
						}}
					/>
					<Stack className={styles.currentHeader}>
						<Label />
						<Label />
						<Label>Owned / lease expiration</Label>
						<Label>Space (m²)</Label>
						<Label>Rental cost</Label>
					</Stack>
					<Stack className={styles.currentSubHeader}>
						<Label className={styles.currentSubLabelBold}>Location / City</Label>
						<Label className={styles.currentSubLabelBold}>ID Code</Label>
						<Label className={styles.currentSubLabel}>Owned</Label>
						<Label className={styles.currentSubLabel}>Lease Expiration</Label>
						<Label className={styles.currentSubLabel}>Warehouse</Label>
						<Label className={styles.currentSubLabel}>Office</Label>
						<Label className={styles.currentSubLabel}>Other</Label>
						<Label className={styles.currentSubLabel}>Total m²</Label>
						<Label className={styles.currentSubLabel}>per yr (k€)</Label>
						<Label className={styles.currentSubLabel}>per mth (€/m²)</Label>
					</Stack>
					<Stack>{renderFieldsCurrentSituation()}</Stack>
					<Stack className={styles.currentTotal}>
						<CommandBarButton
							iconProps={addLeaseIcon}
							text="Add another location"
							onClick={CurrentAddField}
							className={styles.noHover}
							style={{ marginTop: 8, textAlign: 'left' }}
						/>
						<Label style={{ alignSelf: 'center', justifySelf: 'end' }}>Total:</Label>
						<TextFieldReadOnly value={formatNumber(currentTotals.currentWarehouseAreaTotal)} />
						<TextFieldReadOnly value={formatNumber(currentTotals.currentOfficeAreaTotal)} />
						<TextFieldReadOnly value={formatNumber(currentTotals.currentOtherAreaTotal)} />
						<TextFieldReadOnly value={formatNumber(currentTotals.currentTotalAreaTotal)} />
						<TextFieldReadOnly value={formatNumber(currentTotals.currentRentPerYearTotal)} />
						<TextFieldReadOnly value={formatNumber(currentTotals.currentRentPerMonthTotal)} />
						<Label />
					</Stack>
				</ScrollablePane>
			</Stack>
			<Stack style={{ paddingTop: 20 }}>
				<FormSection text={'Proposed Situation'} />
				<ScrollablePane>
					<TextField
						label={'Comment'}
						value={proposedComment}
						onChange={e => {
							const target = e.target as HTMLInputElement;
							setProposedComment(target.value);
						}}
					/>
					<Stack className={styles.proposedHeader}>
						<Label />
						<Label>Lease term</Label>
						<Label>Space (m²)</Label>
						<Label>Rental cost</Label>
						<Label>Total cost k€</Label>
						<Label />
					</Stack>
					<Stack className={styles.proposedSubHeader}>
						<Label className={styles.currentSubLabelBold}>City</Label>
						<Label className={styles.currentSubLabel}>Start date</Label>
						<Label className={styles.currentSubLabel}>End date</Label>
						<Label className={styles.currentSubLabel}>Years</Label>
						<Label className={styles.currentSubLabel}>Warehouse</Label>
						<Label className={styles.currentSubLabel}>Office</Label>
						<Label className={styles.currentSubLabel}>Other</Label>
						<Label className={styles.currentSubLabel}>Total m²</Label>
						<Label className={styles.currentSubLabel}>per yr (k€)</Label>
						<Label className={styles.currentSubLabel}>per mth (€/m²)</Label>
						<Label />
					</Stack>
					<Stack>{renderFieldsProposedSituation()}</Stack>
					<Stack className={styles.proposedTotal}>
						<CommandBarButton
							iconProps={addLeaseIcon}
							text="Add another location"
							onClick={proposedAddField}
							className={styles.noHover}
							style={{ marginTop: 8, textAlign: 'left' }}
						/>
						<Label style={{ alignSelf: 'center', justifySelf: 'end' }}>Total:</Label>
						<TextFieldReadOnly value={formatNumber(proposedTotals.proposedWarehouseAreaTotal)} />
						<TextFieldReadOnly value={formatNumber(proposedTotals.proposedOfficeAreaTotal)} />
						<TextFieldReadOnly value={formatNumber(proposedTotals.proposedOtherAreaTotal)} />
						<TextFieldReadOnly value={formatNumber(proposedTotals.proposedTotalAreaTotal)} />
						<TextFieldReadOnly value={formatNumber(proposedTotals.proposedRentPerYearTotal)} />
						<TextFieldReadOnly value={formatNumber(proposedTotals.proposedRentPerMonthTotal)} />
						<TextFieldReadOnly value={formatNumber(proposedTotals.proposedTotalCostTotal)} />
						<Label />
					</Stack>
				</ScrollablePane>
			</Stack>
			<Stack style={{ paddingTop: 20 }}>
				<FormSection text={'Difference'} />
				<ScrollablePane>
					<Stack className={styles.differenceHeader}>
						<Label />
						<Label />
						<Label>Space (m²)</Label>
						<Label>Rental cost</Label>
						<Label />
					</Stack>
					<Stack className={styles.differenceSubHeader}>
						<Label />
						<Label />
						<Label className={styles.currentSubLabel}>Warehouse</Label>
						<Label className={styles.currentSubLabel}>Office</Label>
						<Label className={styles.currentSubLabel}>Other</Label>
						<Label className={styles.currentSubLabel}>Total m²</Label>
						<Label className={styles.currentSubLabel}>per yr (k€)</Label>
						<Label className={styles.currentSubLabel}>per mth (€/m²)</Label>
					</Stack>
					<Stack className={styles.differenceSubHeader}>
						<Label />
						<Label style={{ alignSelf: 'center', justifySelf: 'end' }}>Current vs. Proposed:</Label>
						<TextFieldReadOnly value={formatNumber(difference.differenceWarehouseAreaTotal, 0) + ' %'} />
						<TextFieldReadOnly value={formatNumber(difference.differenceOfficeAreaTotal, 0) + ' %'} />
						<TextFieldReadOnly value={formatNumber(difference.differenceOtherAreaTotal, 0) + ' %'} />
						<TextFieldReadOnly value={formatNumber(difference.differenceTotalAreaTotal, 0) + ' %'} />
						<TextFieldReadOnly value={formatNumber(difference.differenceRentPerYearTotal, 0) + ' %'} />
						<TextFieldReadOnly value={formatNumber(difference.differenceRentPerMonthTotal, 0) + ' %'} />
					</Stack>
				</ScrollablePane>
			</Stack>
			<Stack style={{ paddingTop: 20 }}>
				<TextSection
					text={
						'The calculations displayed on this page are approximate only and are there to compare the current vs the proposed situations. ' +
						'Accurate figures should be entered on the Details and Risks page.'
					}
				/>
			</Stack>
		</>
	);
};
