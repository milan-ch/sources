import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react';
import * as React from 'react';
import { useState } from 'react';
import { WEBPART_CTX } from '../CesDhlCreAppStateFormWebPart';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { CustomModal } from './general/CustomModal';
import { TInput, TInputs, useFormStore } from './store';
import { useDataStore } from './tStore';
import { MOBILE_WIDTH } from './statementSetup/StatementSetup';
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import {IOverviewCreAppState} from "./overview/OverviewTypes";
import { serialize } from '../helpers/CommonHelper';

interface CesDhlCreAppStateFooterProps {
	onPreviousPage?: () => void;
	onNextPage?: () => void;

	showPreviousPageButton?: boolean;
	showNextPageButton?: boolean;
}

export const CesDhlCreAppStateFooter: React.FC<CesDhlCreAppStateFooterProps> = ({
	onPreviousPage, onNextPage,
	showPreviousPageButton = true, showNextPageButton = true }) => {

	const { width: windowWidth } = useWindowDimensions();
	const isMobile = windowWidth <= MOBILE_WIDTH;
	const [showModalDialog, setShowModalDialog] = useState(false);
	const [leaveForm, setLeaveForm] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
	const ctx = React.useContext(WEBPART_CTX);

	const buttonStyles: React.CSSProperties = {
		width: isMobile ? 'auto' : 180
	};

	const leave = () => {
		window.location.href = ctx.urlRedirectAfterSave;
	}

	const onDismiss = async () => {
		setShowModalDialog(false);

		if (leaveForm) {
			leave();
		}
	}

	const getUserSaveValue = async (field: TInput, multi?: boolean): Promise<any> => {

		if (field.value?.length) {
			const ensureUser = await ctx.sp.web.ensureUser(field.value[0].id);
			return multi ? [ensureUser.data.Id] : ensureUser.data.Id;
		}

		if (multi)
			return [];

		return null;
	}

	const saveFormData = async (leaveForm: boolean) => {

		const inputs: TInputs = useFormStore.getState().inputs;

		if (inputs.Title?.value?.length === 0) {
			setModalMessage("Project Title field is required before saving");
			setShowModalDialog(true);
			return;
		}

		setLeaveForm(leaveForm);

		const overView: IOverviewCreAppState = useDataStore.getState().forms.Overview;
		const projectContextSplitSerialized = await serialize(useDataStore.getState().forms.Overview.projectContextSplit);

		const detailsAndRisksPurchaseSerialized = await serialize(useDataStore.getState().forms.DetailsAndRisks.Purchase);

		const detailsAndRisksSale = useDataStore.getState().forms.DetailsAndRisks.Sale;
		const detailsAndRisksSaleSerialized = await serialize(detailsAndRisksSale);

		const baseDataLeaseCurrentSerialized = await serialize(useDataStore.getState().forms.BaseData.Lease.currentFields);
		const baseDataLeaseProposedSerialized = await serialize(useDataStore.getState().forms.BaseData.Lease.proposedFields);

		const baseDataPurchase = useDataStore.getState().forms.BaseData.Purchase;
		const baseDataPurchaseSerialized = await serialize(baseDataPurchase);

		const baseDataSale = useDataStore.getState().forms.BaseData.Sale;
		const baseDataSaleSerialized = await serialize(baseDataSale);

		const heritableSales = useDataStore.getState().forms.HeritableSales;
		const heritableSerialized = await serialize(heritableSales);

		const approvalStatementList = await ctx.sp.web.lists.getById(ctx.statementApprovalsList);

		const data = {
			Title: inputs.Title.value,
			projectType: inputs.projectType.value.key,
			Business_x0020_Unit_x0020_2Id: inputs.Business_x0020_Unit_x0020_2.value.key,
			Country: inputs.Country.value?.text,
			CRE_x0020_Project_x0020_Volume: inputs.CRE_x0020_Project_x0020_Volume.value,
			BU_x0020_Project_x0020_Volume: inputs.BU_x0020_Project_x0020_Volume.value,
			Statement_x0020_Remarks: inputs.Statement_x0020_Remarks.value,
			property_address: inputs.property_address.value,
			BU_x0020_BCA_x0020_Reference: inputs.BU_x0020_BCA_x0020_Reference.value,
			BU_x0020_BCA_x0020_Version: inputs.BU_x0020_BCA_x0020_Version.value,
			BackToBack: inputs.BackToBack.value === true ? true : false,
			Sales_x0020_Price: inputs.Sales_x0020_Price.value,
			Purchase_x0020_Price: inputs.Purchase_x0020_Price.value,
			heritableSales: heritableSerialized,
			purchaseBaseTemplate: baseDataPurchaseSerialized,
			salesBaseData: baseDataSaleSerialized,
			salesDetails: detailsAndRisksSaleSerialized,
			purchaseTemplate: detailsAndRisksPurchaseSerialized,
			Current_Situation_Comment: useDataStore.getState().forms.BaseData.Lease.currentComment,
			Proposed_Situation_Comment: useDataStore.getState().forms.BaseData.Lease.proposedComment,
			Current_x0020_Situation_x0020_RS: baseDataLeaseCurrentSerialized,
			Proposed_x0020_Situation_x0020_R: baseDataLeaseProposedSerialized,
			Project_x0020_Context: overView.projectContext,
			marketOverviewRentLow: overView.marketOverViewRentLow,
			marketOverviewRentHigh: overView.marketOverViewRentHigh,
			Market_x0020_Overview: overView.marketOverview,
			marketOverviewSource: overView.marketOverviewSource,
			projectContextSplit: projectContextSplitSerialized,
			CRE_x0020_Role: overView.CRERole,
			Approval_x0020_Type: inputs.Approval_x0020_Type.value.key,
			AuthorsId: await getUserSaveValue(inputs.Authors, true),
			countryCheckerId: await getUserSaveValue(inputs.Country_x0020_Checker),
			Country_x0020_ApproverId: await getUserSaveValue(inputs.Country_x0020_Approver),
			Regional_x0020_CheckerId: await getUserSaveValue(inputs.Regional_x0020_Checker),
			Regional_x0020_ApproverId: await getUserSaveValue(inputs.Regional_x0020_Approver),
			Global_x0020_CheckerId: await getUserSaveValue(inputs.Global_x0020_Checker, true),
			Global_x0020_ManagerId: await getUserSaveValue(inputs.Global_x0020_Manager),
			Global_x0020_ApproverId: await getUserSaveValue(inputs.Global_x0020_Approver),
		};

		console.log(data);

		if (ctx.statementId) {
			const result = await approvalStatementList.items.getById(ctx.statementId);
			await result.update(data);
		}
		else {
			const result = await approvalStatementList.items.add(data);
			// eslint-disable-next-line require-atomic-updates
			ctx.statementId = result.data.ID;
		}

		setModalMessage("Form has been successfully saved");
		setShowModalDialog(true);
	};

	return (
		<Stack style={{ paddingTop: 20 }}>
			<CustomModal
				isOpen={showModalDialog}
				onDismiss={onDismiss}
				message={modalMessage}
			/>
			<Stack style={{ gap: 8, border: '1px solid black', padding: 10 }}>
				<Stack style={{ flexDirection: isMobile ? 'column' : 'row', gap: 8, justifyContent: showPreviousPageButton ? 'space-between' : 'flex-end' }}>
					<DefaultButton text='Previous Page' onClick={onPreviousPage ?? undefined} style={showPreviousPageButton ? buttonStyles : { display: 'none' }} />
					<DefaultButton text='Next Page' onClick={onNextPage ?? undefined} style={showNextPageButton ? buttonStyles : { display: 'none' }} />
				</Stack>
				<Stack style={{ flexDirection: isMobile ? 'column' : 'row', gap: 8, justifyContent: 'space-between' }}>
					<PrimaryButton text={'Exit without saving'} onClick={() => leave()} style={buttonStyles} />
					<Stack style={{ flexDirection: isMobile ? 'column' : 'row', gap: 8 }}>
						<DefaultButton text={'Save & Continue'} disabled={!ctx.hasEditPermission} style={buttonStyles} onClick={() => saveFormData(false)} />
						<DefaultButton text={'Save & Exit'} disabled={!ctx.hasEditPermission} style={buttonStyles} onClick={() => saveFormData(true)} />
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};
