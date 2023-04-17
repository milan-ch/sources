import * as React from 'react';
import { Dropdown, Label, Stack } from '@fluentui/react';
import { FormSection, MOBILE_WIDTH } from '../../../statementSetup/StatementSetup';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { ProjectRiskComponent } from '../detailAndRiskByPurchase/ProjectRiskComponent';
import styles from './DetailAndRiskFormBySale.module.scss';
import { CNBClassificationOptions } from '../../../general/DropdownListOptions';
import { WEBPART_CTX } from '../../../../CesDhlCreAppStateFormWebPart';
import { formatNumber } from '../../../../helpers/CommonHelper';
import { TextFieldReadOnly } from '../../../general/TextFieldReadOnly';
import { TextFieldNumber } from '../../../general/TextFieldNumber';
import { useDataStore } from '../../../tStore';
import { CustomTextField } from '../../../general/CustomTextField';
import { MultilineVerticalTextField } from '../../../general/MultilineVerticalTextField';
import {IDetailAndRiskFormBySale} from "../../DetailAndRiskTypes";

export const DetailAndRiskFormBySale = (): JSX.Element => {
	const { width: windowWidth } = useWindowDimensions();
	const isMobile = windowWidth <= MOBILE_WIDTH;
	const ctx = React.useContext(WEBPART_CTX);

	const [formData, setFormData] = React.useState<IDetailAndRiskFormBySale>({
		sFacilityQuittingCost: null,
		sFacilityQuittingCostRemarks: null,
		sBrokerFee: null,
		sBrokerFeeRemarks: null,
		sConsultancyFee: null,
		sConsultancyFeeRemarks: null,
		sNotaryCost: null,
		sNotaryCostRemarks: null,
		sEscrowFee: null,
		sEscrowFeeRemarks: null,
		sAccruals: null,
		sAccrualsRemarks: null,
		sOtherCost: null,
		sOtherCostRemarks: null,
		sTotalOneOffCost: null,
		sTotalOneOffCostRemarks: null,
		sLostRevenuesSubletting: null,
		sLostRevenuesSublettingRemarks: null,
		sLeaseBackCost: null,
		sLeaseBackCostRemarks: null,
		sOtherCost1: null,
		sOtherCost1Remarks: null,
		sTotalOngoingCost: null,
		sTotalOngoingCostRemarks: null,
		sMaintenanceCost: null,
		sMaintenanceCostRemarks: null,
		sDepreciation: null,
		sDepreciationRemarks: null,
		sPropertyTax: null,
		sPropertyTaxRemarks: null,
		sOtherCost2: null,
		sOtherCost2Remarks: null,
		sTotalOngoingSavings: null,
		sTotalOngoingSavingsRemarks: null,
		sRemarks: null
	});

	const inputChange = (key: keyof IDetailAndRiskFormBySale, value: string | boolean | number): void => {
		setFormData(prevState => {
			return {
				...prevState,
				[key]: value
			};
		});
	};

	const handleEvent =
		(propName: keyof IDetailAndRiskFormBySale): ((event: React.FormEvent<HTMLInputElement>) => void) =>
			(_event: React.FormEvent<HTMLInputElement>, newValue?: string | boolean | number): void => {
				inputChange(propName, newValue);
			};

	const recalculateTotalOneOffCost = (): void => {
		setFormData(prevState => {
			return {
				...prevState,
				sTotalOneOffCost:
					Number(formData.sFacilityQuittingCost ?? 0) +
					Number(formData.sBrokerFee ?? 0) +
					Number(formData.sConsultancyFee ?? 0) +
					Number(formData.sNotaryCost ?? 0) +
					Number(formData.sEscrowFee ?? 0) +
					Number(formData.sAccruals ?? 0) +
					Number(formData.sOtherCost ?? 0)
			};
		});
	};

	const recalculateTotalOngoingCost = (): void => {
		setFormData(prevState => {
			return {
				...prevState,				
				sTotalOngoingCost: Number(formData.sLostRevenuesSubletting?? 0) + Number(formData.sOtherCost1?? 0) + Number(formData.sLeaseBackCost?? 0)
			};
		});
	};

	const recalculateTotalOngoingSavings = (): void => {
		setFormData(prevState => {
			return {
				...prevState,
				sTotalOngoingSavings:
					Number(formData.sMaintenanceCost ?? 0) +
					Number(formData.sDepreciation ?? 0) +
					Number(formData.sPropertyTax ?? 0) +
					Number(formData.sOtherCost2 ?? 0)
			};
		});
	};
	
	React.useEffect(() => {
		const form = useDataStore.getState().forms.DetailsAndRisks.Sale;
		const formData = useDataStore.getState().forms.BaseData.Sale;
		inputChange("sLeaseBackCost", formData.LeaseBackPayment);
		setFormData(form);
		recalculateTotalOngoingCost();
	}, []);

	React.useEffect(() => {
		useDataStore.getState().setDetailsAndRiskSale(formData);
	}, [formData]);

	return (
		<>
			<Stack className={isMobile ? '' : styles.effectDueToLayout}>
				<Stack>
					<FormSection text={'One-off effect due to sale'} />
					<Stack className={styles.oneOffAndOngoingHeader}>
						<Label>One-off cost</Label>
						<Label>k€</Label>
						<Label>Remarks</Label>
					</Stack>
					<Stack className={styles.oneOffItemsLayout}>
						<Label className={styles.fontWeight400}>Facility quitting cost</Label>
						<TextFieldNumber
							value={formatNumber(formData.sFacilityQuittingCost)}
							onChange={handleEvent('sFacilityQuittingCost')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<CustomTextField value={formData.sFacilityQuittingCostRemarks} onChange={handleEvent('sFacilityQuittingCostRemarks')} />
						<Label className={styles.fontWeight400}>Broker fee</Label>
						<TextFieldNumber
							value={formatNumber(formData.sBrokerFee)}
							onChange={handleEvent('sBrokerFee')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<CustomTextField value={formData.sBrokerFeeRemarks} onChange={handleEvent('sBrokerFeeRemarks')} />
						<Label className={styles.fontWeight400}>Consultancy fee (agents)</Label>
						<TextFieldNumber
							value={formatNumber(formData.sConsultancyFee)}
							onChange={handleEvent('sConsultancyFee')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<CustomTextField value={formData.sConsultancyFeeRemarks} onChange={handleEvent('sConsultancyFeeRemarks')} />
						<Label className={styles.fontWeight400}>Notary cost</Label>
						<TextFieldNumber
							value={formatNumber(formData.sNotaryCost)}
							onChange={handleEvent('sNotaryCost')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<CustomTextField value={formData.sNotaryCostRemarks} onChange={handleEvent('sNotaryCostRemarks')} />
						<Label className={styles.fontWeight400}>Title or escrow fee</Label>
						<TextFieldNumber
							value={formatNumber(formData.sEscrowFee)}
							onChange={handleEvent('sEscrowFee')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<CustomTextField value={formData.sEscrowFeeRemarks} onChange={handleEvent('sEscrowFeeRemarks')} />
						<Label className={styles.fontWeight400}>Accruals</Label>
						<TextFieldNumber
							value={formatNumber(formData.sAccruals)}
							onChange={handleEvent('sAccruals')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<CustomTextField value={formData.sAccrualsRemarks} onChange={handleEvent('sAccrualsRemarks')} />
						<Label className={styles.fontWeight400}>Other cost</Label>
						<TextFieldNumber
							value={formatNumber(formData.sOtherCost)}
							onChange={handleEvent('sOtherCost')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<CustomTextField value={formData.sOtherCostRemarks} onChange={handleEvent('sOtherCostRemarks')} />
						<Label className={styles.fontWeight400}>Total one-off cost</Label>
						<TextFieldReadOnly value={formatNumber(formData.sTotalOneOffCost)} />
						<CustomTextField value={formData.sTotalOneOffCostRemarks} onChange={handleEvent('sTotalOneOffCostRemarks')} />
					</Stack>
					<Stack className={styles.remarksLayout}>
						<Label className={styles.fontWeight400}>Remarks</Label>
						<MultilineVerticalTextField value={formData.sRemarks} onChange={handleEvent('sRemarks')} rows={2} resizable={false} style={{ height: 70 }} />
					</Stack>
				</Stack>
				<Stack>
					<FormSection text={'Ongoing annual effect due to sale'} />
					<Stack className={styles.oneOffAndOngoingHeader}>
						<Label>Ongoing cost</Label>
						<Label>k€ (pa)</Label>
						<Label>Remarks</Label>
					</Stack>
					<Stack className={styles.ongoingCostsLayout}>
						<Label className={styles.fontWeight400}>Lease (back) cost</Label>
						<TextFieldReadOnly value={formatNumber(formData.sLeaseBackCost)} />
						<CustomTextField value={formData.sLeaseBackCostRemarks} onChange={handleEvent('sLeaseBackCostRemarks')} />
						<Label className={styles.fontWeight400}>Lost revenues subletting</Label>
						<TextFieldNumber
							value={formatNumber(formData.sLostRevenuesSubletting)}
							onChange={handleEvent('sLostRevenuesSubletting')}
							onBlur={recalculateTotalOngoingCost}
						/>
						<CustomTextField value={formData.sLostRevenuesSublettingRemarks} onChange={handleEvent('sLostRevenuesSublettingRemarks')} />
						<Label className={styles.fontWeight400}>Other cost</Label>
						<TextFieldNumber
							value={formatNumber(formData.sOtherCost1)}
							onChange={handleEvent('sOtherCost1')}
							onBlur={recalculateTotalOngoingCost}
						/>
						<CustomTextField value={formData.sOtherCost1Remarks} onChange={handleEvent('sOtherCost1Remarks')} />
						<Label className={styles.fontWeight400}>Total ongoing cost</Label>
						<TextFieldReadOnly value={formatNumber(formData.sTotalOngoingCost)} />
						<CustomTextField value={formData.sTotalOngoingCostRemarks} onChange={handleEvent('sTotalOngoingCostRemarks')} />
					</Stack>
					<Stack className={styles.ongoingIncomeHeader}>
						<Label>Ongoing savings</Label>
						<Label>k€ (pa)</Label>
						<Label>Remarks</Label>
					</Stack>
					<Stack className={styles.ongoingIncomeLayout}>
						<Label className={styles.fontWeight400}>Maintenance cost</Label>
						<TextFieldNumber
							value={formatNumber(formData.sMaintenanceCost)}
							onChange={handleEvent('sMaintenanceCost')}
							onBlur={recalculateTotalOngoingSavings}
						/>
						<CustomTextField value={formData.sMaintenanceCostRemarks} onChange={handleEvent('sMaintenanceCostRemarks')} />
						<Label className={styles.fontWeight400}>Depreciation</Label>
						<TextFieldReadOnly value={formatNumber(formData.sDepreciation)} />
						<CustomTextField value={formData.sDepreciationRemarks} onChange={handleEvent('sDepreciationRemarks')} />
						<Label className={styles.fontWeight400}>Property tax</Label>
						<TextFieldNumber
							value={formatNumber(formData.sPropertyTax)}
							onChange={handleEvent('sPropertyTax')}
							onBlur={recalculateTotalOngoingSavings}
						/>
						<CustomTextField value={formData.sPropertyTaxRemarks} onChange={handleEvent('sPropertyTaxRemarks')} />
						<Label className={styles.fontWeight400}>Other cost</Label>
						<TextFieldNumber
							value={formatNumber(formData.sOtherCost2)}
							onChange={handleEvent('sOtherCost2')}
							onBlur={recalculateTotalOngoingSavings}
						/>
						<CustomTextField value={formData.sOtherCost2Remarks} onChange={handleEvent('sOtherCost2Remarks')} />
						<Label className={styles.fontWeight400}>Total ongoing savings</Label>
						<TextFieldReadOnly value={formatNumber(formData.sTotalOngoingSavings)} />
						<CustomTextField value={formData.sTotalOngoingSavingsRemarks} onChange={handleEvent('sTotalOngoingSavingsRemarks')} />
					</Stack>
				</Stack>
			</Stack>
			<Stack style={{ paddingTop: 20 }}>
				<FormSection text={'Project Risk'} />
				<Stack className={styles.projectRiskHeader}>
					<Label>General Risk Cluster</Label>
					<Label>Risk Level</Label>
					<Label>Project Specific Risk Description & Mitigation</Label>
				</Stack>
				<Stack className={isMobile ? '' : styles.projectRiskLayout}>
					<ProjectRiskComponent placeHolderText={ctx.riskRevenueSalesPlaceholder} />
					<ProjectRiskComponent placeHolderText={ctx.riskPoliticalPlaceholder} />
					<ProjectRiskComponent placeHolderText={ctx.riskPartnerPlaceholder} />
					<ProjectRiskComponent placeHolderText={ctx.riskLegalTaxPlaceholder} />
					<ProjectRiskComponent placeHolderText={ctx.riskOtherPlaceholder} />
				</Stack>
			</Stack>
			<Stack style={{ paddingTop: 20 }}>
				<FormSection text="Sustainability / Carbon Neutral Building Classification" />
				<Dropdown
					placeholder="Please select a value..."
					label="CNB Rating"
					options={CNBClassificationOptions}
				/>
			</Stack>
		</>
	);
};
