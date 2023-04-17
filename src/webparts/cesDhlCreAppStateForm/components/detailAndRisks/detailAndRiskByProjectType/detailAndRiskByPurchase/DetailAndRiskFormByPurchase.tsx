import * as React from 'react';
import { Dropdown, Label, Stack, TextField } from '@fluentui/react';
import styles from './DetailAndRiskFormByPurchase.module.scss';
import { FormSection, MOBILE_WIDTH } from '../../../statementSetup/StatementSetup';
import { ProjectRiskComponent } from './ProjectRiskComponent';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { formatNumber } from '../../../../helpers/CommonHelper';
import { CNBClassificationOptions } from '../../../general/DropdownListOptions';
import { WEBPART_CTX } from '../../../../CesDhlCreAppStateFormWebPart';
import { MultilineVerticalTextField } from '../../../general/MultilineVerticalTextField';
import { TextFieldNumber } from '../../../general/TextFieldNumber';
import { TextFieldReadOnly } from '../../../general/TextFieldReadOnly';
import { useDataStore } from '../../../tStore';
import { IDetailAndRiskFormByPurchase } from "../../DetailAndRiskTypes";

export const DetailAndRiskFormByPurchase = (): JSX.Element => {
	const { width: windowWidth } = useWindowDimensions();
	const isMobile = windowWidth <= MOBILE_WIDTH;
	const ctx = React.useContext(WEBPART_CTX);

	const [formData, setFormData] = React.useState<IDetailAndRiskFormByPurchase>({
		pReconstructionCost: null,
		pReconstructionCostRemarks: null,
		pImprovementCost: null,
		pImprovementCostRemarks: null,
		pRelocationCost: null,
		pRelocationCostRemarks: null,
		pBrokerFee: null,
		pBrokerFeeRemarks: null,
		pConsultancyFee: null,
		pConsultancyFeeRemarks: null,
		pTax: null,
		pTaxRemarks: null,
		pPenalty: null,
		pPenaltyRemarks: null,
		pEscrowFee: null,
		pEscrowFeeRemarks: null,
		pProvisions: null,
		pProvisionsRemarks: null,
		pOtherCost: null,
		pOtherCostRemarks: null,
		pTotalOneOffCost: null,
		pTotalOneOffCostRemarks: null,
		pDeprecation: null,
		pDeprecationRemarks: null,
		pMaintenance: null,
		pMaintenanceRemarks: null,
		pOngoingOtherCost: null,
		pOngoingOtherCostRemarks: null,
		pTotalOngoingCost: null,
		pTotalOngoingCostRemarks: null,
		pSublease: null,
		pSubleaseRemarks: null,
		pOtherIncome: null,
		pOtherIncomeRemarks: null,
		pTotalIncome: null,
		pTotalIncomeRemarks: null,
		pDDTechnical: null,
		pDDLegal: null,
		pRevenueSalesRiskDesc: null,
		pPoliticalRiskDesc: null,
		pLegalTaxRiskDesc: null,
		pOtherRiskDesc: null
	});

	const inputChange = (key: keyof IDetailAndRiskFormByPurchase, value: string | boolean | number): void => {
		setFormData(prevState => {
			return {
				...prevState,
				[key]: value
			};
		});
	};

	const handleEvent =
		(propName: keyof IDetailAndRiskFormByPurchase): ((event: React.FormEvent<HTMLInputElement>) => void) =>
			(_event: React.FormEvent<HTMLInputElement>, newValue?: string | boolean | number): void => {
				inputChange(propName, newValue);
			};

	React.useEffect(() => {
		const form = useDataStore.getState().forms.DetailsAndRisks.Purchase;
		setFormData(form);
	}, []);

	React.useEffect(() => {
		useDataStore.getState().setDetailsAndRiskPurchase(formData);
	}, [formData]);


	const recalculateTotalOneOffCost = (): void => {
		setFormData(prevState => {
			return {
				...prevState,
				pTotalOneOffCost:
					Number(formData.pReconstructionCost ?? 0) +
					Number(formData.pImprovementCost ?? 0) +
					Number(formData.pRelocationCost ?? 0) +
					Number(formData.pBrokerFee ?? 0) +
					Number(formData.pConsultancyFee ?? 0) +
					Number(formData.pTax ?? 0) +
					Number(formData.pPenalty ?? 0) +
					Number(formData.pEscrowFee ?? 0) +
					Number(formData.pProvisions ?? 0) +
					Number(formData.pOtherCost ?? 0)
			};
		});
	};

	const recalculateTotalOngoingCost = (): void => {
		setFormData(prevState => {
			return {
				...prevState,
				pTotalOngoingCost:
					Number(formData.pDeprecation ?? 0) + Number(formData.pMaintenance ?? 0) + Number(formData.pOngoingOtherCost ?? 0)
			};
		});
	};

	const recalculateTotalOngoingIncome = (): void => {
		setFormData(prevState => {
			return {
				...prevState,
				pTotalIncome: Number(formData.pSublease ?? 0) + Number(formData.pOtherIncome ?? 0)
			};
		});
	};

	return (
		<>
			<Stack className={isMobile ? '' : styles.effectDueToLayout}>
				<Stack>
					<FormSection text={'One-off effect due to purchase'} />
					<Stack className={styles.oneOffAndOngoingHeader}>
						<Label>One-off cost</Label>
						<Label>k€</Label>
						<Label>Remarks</Label>
					</Stack>
					<Stack className={styles.oneOffItemsLayout}>
						<Label className={styles.fontWeight400}>Reconstruction cost</Label>
						<TextFieldNumber
							value={formatNumber(formData.pReconstructionCost)}
							onChange={handleEvent('pReconstructionCost')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<TextField value={formData.pReconstructionCostRemarks} onChange={handleEvent('pReconstructionCostRemarks')} />
						<Label className={styles.fontWeight400}>Improvement cost</Label>
						<TextFieldNumber
							value={formatNumber(formData.pImprovementCost)}
							onChange={handleEvent('pImprovementCost')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<TextField value={formData.pImprovementCostRemarks} onChange={handleEvent('pImprovementCostRemarks')} />
						<Label className={styles.fontWeight400}>Relocation cost</Label>
						<TextFieldNumber
							value={formatNumber(formData.pRelocationCost)}
							onChange={handleEvent('pRelocationCost')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<TextField value={formData.pRelocationCostRemarks} onChange={handleEvent('pRelocationCostRemarks')} />
						<Label className={styles.fontWeight400}>Broker fee</Label>
						<TextFieldNumber
							value={formatNumber(formData.pBrokerFee)}
							onChange={handleEvent('pBrokerFee')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<TextField value={formData.pBrokerFeeRemarks} onChange={handleEvent('pBrokerFeeRemarks')} />
						<Label className={styles.fontWeight400}>Consultancy fee (agents)</Label>
						<TextFieldNumber
							value={formatNumber(formData.pConsultancyFee)}
							onChange={handleEvent('pConsultancyFee')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<TextField value={formData.pConsultancyFeeRemarks} onChange={handleEvent('pConsultancyFeeRemarks')} />
						<Label className={styles.fontWeight400}>Tax</Label>
						<TextFieldNumber
							value={formatNumber(formData.pTax)}
							onChange={handleEvent('pTax')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<TextField value={formData.pTaxRemarks} onChange={handleEvent('pTaxRemarks')} />
						<Label className={styles.fontWeight400}>Penalty</Label>
						<TextFieldNumber
							value={formatNumber(formData.pPenalty)}
							onChange={handleEvent('pPenalty')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<TextField value={formData.pPenaltyRemarks} onChange={handleEvent('pPenaltyRemarks')} />
						<Label className={styles.fontWeight400}>Title or escrow fee</Label>
						<TextFieldNumber
							value={formatNumber(formData.pEscrowFee)}
							onChange={handleEvent('pEscrowFee')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<TextField value={formData.pEscrowFeeRemarks} onChange={handleEvent('pEscrowFeeRemarks')} />
						<Label className={styles.fontWeight400}>Provisions</Label>
						<TextFieldNumber
							value={formatNumber(formData.pProvisions)}
							onChange={handleEvent('pProvisions')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<TextField value={formData.pProvisionsRemarks} onChange={handleEvent('pProvisionsRemarks')} />
						<Label className={styles.fontWeight400}>Other cost</Label>
						<TextFieldNumber
							value={formatNumber(formData.pOtherCost)}
							onChange={handleEvent('pOtherCost')}
							onBlur={recalculateTotalOneOffCost}
						/>
						<TextField value={formData.pOtherCostRemarks} onChange={handleEvent('pOtherCostRemarks')} />
						<Label className={styles.fontWeight400}>Total one-off cost</Label>
						<TextFieldReadOnly value={formatNumber(formData.pTotalOneOffCost)} />
						<TextField value={formData.pTotalOneOffCostRemarks} onChange={handleEvent('pTotalOneOffCostRemarks')} />
					</Stack>
				</Stack>
				<Stack>
					<FormSection text={'Ongoing effect due to purchase'} />
					<Stack className={styles.oneOffAndOngoingHeader}>
						<Label>Ongoing cost</Label>
						<Label>k€ (pa)</Label>
						<Label>Remarks</Label>
					</Stack>
					<Stack className={styles.ongoingCostsLayout}>
						<Label className={styles.fontWeight400}>Depreciation</Label>
						<TextFieldNumber
							value={formatNumber(formData.pDeprecation)}
							onChange={handleEvent('pDeprecation')}
							onBlur={recalculateTotalOngoingCost}
						/>
						<TextField value={formData.pDeprecationRemarks} onChange={handleEvent('pDeprecationRemarks')} />
						<Label className={styles.fontWeight400}>Maintenance</Label>
						<TextFieldNumber
							value={formatNumber(formData.pMaintenance)}
							onChange={handleEvent('pMaintenance')}
							onBlur={recalculateTotalOngoingCost}
						/>
						<TextField value={formData.pMaintenanceRemarks} onChange={handleEvent('pMaintenanceRemarks')} />
						<Label className={styles.fontWeight400}>Other cost</Label>
						<TextFieldNumber
							value={formatNumber(formData.pOngoingOtherCost)}
							onChange={handleEvent('pOngoingOtherCost')}
							onBlur={recalculateTotalOngoingCost}
						/>
						<TextField value={formData.pOngoingOtherCostRemarks} onChange={handleEvent('pOngoingOtherCostRemarks')} />
						<Label className={styles.fontWeight400}>Total ongoing cost</Label>
						<TextFieldReadOnly value={formatNumber(formData.pTotalOngoingCost)} />
						<TextField value={formData.pTotalOngoingCostRemarks} onChange={handleEvent('pTotalOngoingCostRemarks')} />
					</Stack>
					<Stack className={styles.ongoingIncomeHeader}>
						<Label>Ongoing income</Label>
						<Label>k€</Label>
						<Label>Remarks</Label>
					</Stack>
					<Stack className={styles.ongoingIncomeLayout}>
						<Label className={styles.fontWeight400}>Sublease</Label>
						<TextFieldNumber
							value={formatNumber(formData.pSublease)}
							onChange={handleEvent('pSublease')}
							onBlur={recalculateTotalOngoingIncome}
						/>
						<TextField value={formData.pSubleaseRemarks} onChange={handleEvent('pSubleaseRemarks')} />
						<Label className={styles.fontWeight400}>Other income</Label>
						<TextFieldNumber
							value={formatNumber(formData.pOtherIncome)}
							onChange={handleEvent('pOtherIncome')}
							onBlur={recalculateTotalOngoingIncome}
						/>
						<TextField value={formData.pOtherIncomeRemarks} onChange={handleEvent('pOtherIncomeRemarks')} />
						<Label className={styles.fontWeight400}>Total ongoing income</Label>
						<TextFieldReadOnly value={formatNumber(formData.pTotalIncome)} />
						<TextField value={formData.pTotalIncomeRemarks} onChange={handleEvent('pTotalIncomeRemarks')} />
					</Stack>
				</Stack>
			</Stack>
			<Stack style={{ paddingTop: 10 }}>
				<FormSection text={'Due Diligence'} />
				<MultilineVerticalTextField label={'1) Technical & Environmental'} />
				<MultilineVerticalTextField label={'2) Legal'} />
			</Stack>
			<Stack style={{ paddingTop: 10 }}>
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
