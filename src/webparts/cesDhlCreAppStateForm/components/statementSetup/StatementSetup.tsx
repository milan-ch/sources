import * as React from 'react';

import { IPersonaProps, Stack } from '@fluentui/react';

import { WEBPART_CTX } from '../../CesDhlCreAppStateFormWebPart';
import { ColumnsInternal, useFormStore, useInputs } from '../store';
import { GeneralFieldMemo } from '../general/Field';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useIsMount } from '../../hooks/useIsMount';
import { getSetupData } from '../../helpers/data';

import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import '@pnp/sp/webs';
import '@pnp/sp/site-users/web';
import "@pnp/sp/lists/web";

import { useDataStore } from '../tStore';
import { IHeritableSales } from "../heritableSales/HeritableSaleTypes";
import { IOverviewCreAppState } from "../overview/OverviewTypes";
import * as moment from 'moment';
import { PermissionKind } from '@pnp/sp/security';
import { deserialize, deserializeArray } from '../../helpers/CommonHelper';
import { ICurrent, IFormSaleAndLeaseback, IProposed } from "../baseData/BaseDataTypes";
import { IDetailAndRiskFormByPurchase, IDetailAndRiskFormBySale } from "../detailAndRisks/DetailAndRiskTypes";

import { IAttachmentInfo } from "@pnp/sp/attachments";
import { IItem } from "@pnp/sp/items/types";


export const FormSection = (props: { text: string }) => {
	const ctx = React.useContext(WEBPART_CTX);
	return (
		<span
			style={{
				fontWeight: '700',
				borderBottom: '1px solid #585858',
				padding: 8,
				textAlign: 'center',
				backgroundColor: ctx.separatorColor
			}}
		>
			{props.text}
		</span>
	);
};

export const TextSection = (props: { text: string }) => {
	return (
		<span
			style={{
				padding: 5,
				textAlign: 'center',
				backgroundColor: '#F5F5F5',
				fontStyle: 'italic',
				fontSize: 13
			}}
		>
			{props.text}
		</span>
	);
};
export const MOBILE_WIDTH = 600;


export const StatementSetup = () => {
	const ctx = React.useContext(WEBPART_CTX);

	const setInputInitialized = useFormStore(store => store.setInputInitialized);
	const setDropdownOptionsMultiple = useFormStore(store => store.setDropdownOptionsMultiple);
	const setInputsMultiple = useFormStore(store => store.setInputsMultiple);
	const setInputs = useFormStore((store) => store.setInputs);
	const inputs = useInputs();
	const isMount = useIsMount();
	const { width: windowWidth } = useWindowDimensions();
	const isMobile = windowWidth <= MOBILE_WIDTH;

	const statementFieldsData = React.useMemo(() => getSetupData(ctx), [ctx]);

	React.useEffect(() => {
		const initializeInput = async () => {
			setDropdownOptionsMultiple(
				{
					internalName: 'projectType',
					value: ctx.projectTypes.map(typeObject => ({
						key: typeObject.type,
						text: typeObject.type
					}))
				},
				{
					internalName: 'Approval_x0020_Type',
					value: ['Approved', 'Conditionally Approved', 'Not Approved'].map(c => ({ key: c, text: c }))
				}
			);

			const currentUser = await ctx.sp.web.currentUser();
			const currentUserPersonaProps: IPersonaProps[] = [
				{
					id: currentUser.LoginName,
					secondaryText: currentUser.Email,
					text: currentUser.Title
				}
			];
			setInputsMultiple(
				{
					internalName: 'projectType',
					property: 'value',
					value: { key: 'Lease', value: 'Lease' }
				},
				{
					internalName: 'Approval_x0020_Type',
					property: 'value',
					value: { key: 'Approved', value: 'Approved' }
				},
				{
					internalName: 'Global_x0020_Approver',
					property: 'value',
					value: ctx.globalApproverProps || []
				},
				{
					internalName: 'Global_x0020_Checker',
					property: 'value',
					value: ctx.globalCheckerProps || []
				},
				{
					internalName: 'Global_x0020_Manager',
					property: 'value',
					value: ctx.complianceManagerProps || []
				},
				{
					internalName: 'Statement_x0020_Author',
					property: 'value',
					value: currentUserPersonaProps || []
				},
				{
					internalName: 'CRE_x0020_Statement_x0020_Refere',
					property: 'value',
					value: 'Assigned upon initial save'
				},
				{
					internalName: 'CRE_x0020_Statement_x0020_Versio',
					property: 'value',
					value: '0.01'
				},
				{
					internalName: 'ApprovalStatus',
					property: 'value',
					value: 'Stage 1: With Author'
				},
				{
					internalName: 'Approval_x0020_Required',
					property: 'value',
					value: 'Complete all above fields'
				}
			);

			setInputInitialized(true);
		};

		const setUserInput = (userField: any, input: ColumnsInternal) => {

			if (userField === undefined) return;

			const personProps: IPersonaProps[] = [];

			if (Array.isArray(userField)) {
				userField.map((item: any) => {
					personProps.push({
						id: item.Name,
						secondaryText: item.EMail,
						text: item.Title
					});
				})
			}
			else {
				personProps.push({
					id: userField.Name,
					secondaryText: userField.EMail,
					text: userField.Title
				});
			}

			setInputs(input, 'value', personProps);
		}

		const loadFormData = async (): Promise<void> => {

			if (ctx.statementId) {
				const result = await ctx.sp.web.lists.getById(ctx.statementApprovalsList)
					.items
					.getById(ctx.statementId)
					.select("*, Country_x0020_Approver/Title, Country_x0020_Approver/Name, Country_x0020_Approver/ID, Country_x0020_Approver/EMail",
						"Regional_x0020_Checker/Title, Regional_x0020_Checker/Name, Regional_x0020_Checker/ID, Regional_x0020_Checker/EMail",
						"Regional_x0020_Approver/Title, Regional_x0020_Approver/Name, Regional_x0020_Approver/ID, Regional_x0020_Approver/EMail",
						"Global_x0020_Checker/Title, Global_x0020_Checker/Name, Global_x0020_Checker/ID, Global_x0020_Checker/EMail",
						"Global_x0020_Manager/Title, Global_x0020_Manager/Name, Global_x0020_Manager/ID, Global_x0020_Manager/EMail",
						"Global_x0020_Approver/Title, Global_x0020_Approver/Name, Global_x0020_Approver/ID, Global_x0020_Approver/EMail",
						"countryChecker/Title, countryChecker/Name, countryChecker/ID, countryChecker/EMail",
						"Authors/Title, Authors/Name, Authors/ID, Authors/EMail")
					.expand("Country_x0020_Approver,Regional_x0020_Checker,Regional_x0020_Approver,Global_x0020_Checker,Global_x0020_Manager,countryChecker,Global_x0020_Approver,Authors")();

				console.log(result);
				const hasEditPermission = await ctx.sp.web.lists.getById(ctx.statementApprovalsList).items.getById(ctx.statementId).currentUserHasPermissions(PermissionKind.EditListItems);
				// eslint-disable-next-line require-atomic-updates
				ctx.hasEditPermission = hasEditPermission;

				let countryId = null;

				if (result.Country !== null) {
					const countryResult = await ctx.sp.web.lists.getById(ctx.countryList).items.filter(`Title eq '${result.Country}'`)();
					countryId = countryResult[0].Id;
				}

				setInputs("Title", 'value', result.Title);
				setInputsMultiple(
					{
						internalName: 'projectType',
						property: 'value',
						value: { key: result.projectType, text: result.projectType }
					},
					{
						internalName: 'Business_x0020_Unit_x0020_2',
						property: 'value',
						value: { key: result.Business_x0020_Unit_x0020_2Id }
					},
					{
						internalName: 'Country',
						property: 'value',
						value: { key: countryId, text: result.Country }
					},
					{
						internalName: 'Approval_x0020_Type',
						property: 'value',
						value: { key: result.Approval_x0020_Type, text: result.Approval_x0020_Type }
					},
				);

				setInputs("Statement_x0020_Remarks", 'value', result.Statement_x0020_Remarks);
				setInputs("property_address", 'value', result.property_address);
				setInputs("property_address", 'hidden', result.projectType !== 'Sale' && result.projectType !== 'Sale & Leaseback' && result.projectType !== 'Heritable Land Sale');
				setInputs("CRE_x0020_Project_x0020_Volume", 'value', result.CRE_x0020_Project_x0020_Volume);
				setInputs("BU_x0020_BCA_x0020_Reference", 'value', result.BU_x0020_BCA_x0020_Reference);
				setInputs("BU_x0020_BCA_x0020_Version", 'value', result.BU_x0020_BCA_x0020_Version);
				setInputs("BU_x0020_Project_x0020_Volume", 'value', result.BU_x0020_Project_x0020_Volume);
				setInputs("BackToBack", 'value', result.BackToBack);
				setInputs("Sales_x0020_Price", 'value', result.Sales_x0020_Price);
				setInputs("Sales_x0020_Price", 'hidden', result.projectType !== 'Sale' && result.projectType !== 'Sale & Leaseback' && result.projectType !== 'Heritable Land Sale');
				setInputs("Purchase_x0020_Price", 'value', result.Purchase_x0020_Price);
				setInputs("Purchase_x0020_Price", 'hidden', result.projectType !== 'Sale' && result.projectType !== 'Sale & Leaseback' && result.projectType !== 'Heritable Land Sale');
				setInputs("CRE_x0020_Statement_x0020_Refere", 'value', moment(new Date(result.Created)).format("yyyy") + '-' + result.Id);
				setInputs("ApprovalStatus", 'value', result.ApprovalStatus);
				setInputs("CRE_x0020_Statement_x0020_Versio", 'value', result.CRE_x0020_Statement_x0020_Versio);

				setUserInput(result.Country_x0020_Approver, "Country_x0020_Approver");
				setUserInput(result.Authors, "Authors");
				setUserInput(result.countryChecker, "Country_x0020_Checker");
				setUserInput(result.Regional_x0020_Checker, "Regional_x0020_Checker");
				setUserInput(result.Regional_x0020_Approver, "Regional_x0020_Approver");
				setUserInput(result.Global_x0020_Checker, "Global_x0020_Checker");
				setUserInput(result.Global_x0020_Manager, "Global_x0020_Manager");
				setUserInput(result.Global_x0020_Approver, "Global_x0020_Approver");

				const purchaseBaseTemplate = await deserialize(result.purchaseBaseTemplate);
				useDataStore.getState().setBaseDataPurchase(purchaseBaseTemplate);

				if (result.heritableSales !== null) {
					useDataStore.getState().setHeritableSales(await deserialize<IHeritableSales>(result.heritableSales));
				}

				if (result.salesBaseData !== null) {
					useDataStore.getState().setBaseDataSale(await deserialize<IFormSaleAndLeaseback>(result.salesBaseData));
				}

				if (result.salesDetails !== null) {
					useDataStore.getState().setDetailsAndRiskSale(await deserialize<IDetailAndRiskFormBySale>(result.salesDetails));
				}

				if (result.purchaseTemplate !== null) {
					useDataStore.getState().setDetailsAndRiskPurchase(await deserialize<IDetailAndRiskFormByPurchase>(result.purchaseTemplate));
				}

				if (result.Current_x0020_Situation_x0020_RS !== null) {
					const currentFieldsData: ICurrent[] = await deserializeArray<any>(result.Current_x0020_Situation_x0020_RS);
					const proposedFieldsData: IProposed[] = await deserializeArray<any>(result.Proposed_x0020_Situation_x0020_R);

					const leaseBaseDate = {
						currentComment: result.Current_Situation_Comment,
						proposedComment: result.Proposed_Situation_Comment,
						proposedFields: proposedFieldsData,
						currentFields: currentFieldsData
					};

					useDataStore.getState().setBaseDataLease(leaseBaseDate);
				}

				const overview: IOverviewCreAppState = {
					//		projectContextSplit: await deserialize<IProjectContextSplit>(result.projectContextSplit),
					projectContext: result.Project_x0020_Context,
					marketOverViewRentLow: result.marketOverviewRentLow,
					marketOverViewRentHigh: result.marketOverviewRentHigh,
					marketOverview: result.Market_x0020_Overview,
					marketOverviewSource: result.marketOverviewSource,
					CRERole: result.CRE_x0020_Role,
					marketOverviewItems: []
				};

				useDataStore.getState().setOverview(overview);

				//attachment loading
				const item: IItem = ctx.sp.web.lists.getById(ctx.statementApprovalsList).items.getById(ctx.statementId);
				const info: IAttachmentInfo[] = await item.attachmentFiles();
				console.log(info);

				//attachment logs loading
				const attachmentsLogs = await ctx.sp.web.lists.getByTitle("Attachment Log").items.filter(`CRE_x0020_Statement_x0020_ID eq 448`)();
				console.log(attachmentsLogs);
			}
		};

		if (!useFormStore.getState().inputInitialized) {
			//eslint-disable-next-line
			initializeInput();
			//eslint-disable-next-line	
			loadFormData();
		}

	}, []);

	React.useEffect(() => {
		if (isMount) {
			return;
		}

		ctx.selectedProjectType = inputs.projectType.value.key;

		let setApprovalLevelToGlobal = false;
		// Project type is filled and is not either 'Other' or 'Lease'
		if (
			inputs.projectType.value.key &&
			inputs.projectType.value.key !== 'Other' &&
			inputs.projectType.value.key !== 'Lease'
		) {
			setApprovalLevelToGlobal = true;
		} else {
			if (parseInt(inputs.BU_x0020_Project_x0020_Volume.value) >= 10000) {
				setApprovalLevelToGlobal = true;
			} else {
				// Threshold value computed based on BackToBack checkbox
				const thresholdValue = inputs.BackToBack.value ? 10000 : 3000;
				if (parseInt(inputs.CRE_x0020_Project_x0020_Volume.value) >= thresholdValue) {
					setApprovalLevelToGlobal = true;
				}
			}
		}

		// Show fields based on whether it is Global or not
		setInputsMultiple(
			{
				internalName: 'Approval_x0020_Required',
				property: 'value',
				value: setApprovalLevelToGlobal ? 'Global' : 'Complete all above fields'
			},
			{
				internalName: 'Regional_x0020_Approver',
				property: 'hidden',
				value: !setApprovalLevelToGlobal
			},
			{
				internalName: 'Regional_x0020_Checker',
				property: 'hidden',
				value: !setApprovalLevelToGlobal
			},
			{
				internalName: 'Global_x0020_Approver',
				property: 'hidden',
				value: !setApprovalLevelToGlobal
			},
			{
				internalName: 'Global_x0020_Checker',
				property: 'hidden',
				value: !setApprovalLevelToGlobal
			},
			{
				internalName: 'Global_x0020_Manager',
				property: 'hidden',
				value: !setApprovalLevelToGlobal
			}
		);
	}, [
		inputs.BackToBack,
		inputs.projectType,
		inputs.CRE_x0020_Project_x0020_Volume,
		inputs.BU_x0020_Project_x0020_Volume
	]);

	return (
		<Stack style={{ gap: 10 }}>
			{statementFieldsData.map((data, index) => {
				return (
					<Stack key={index} style={{ gap: 5 }}>
						{data.section && <FormSection text={data.section} />}
						{data.sectionFields.map((fields, index) => {
							// If `fields` is Array then we want to render elements within this array in a single row
							if (Array.isArray(fields)) {
								// Width for each element if they are in row - in mobile its changed to 1 columnn view
								const width = isMobile ? 100 : 100 / fields.length;
								return (
									<Stack
										key={index}
										style={{
											flexDirection: isMobile ? 'column' : 'row',
											gap: 8
										}}
									>
										{fields.map((field, index) => {
											return (
												<Stack.Item key={index} style={{ width: `${width}%` }}>
													<GeneralFieldMemo field={field} />
												</Stack.Item>
											);
										})}
									</Stack>
								);
							}
							return <GeneralFieldMemo key={index} field={fields} />;
						})}
					</Stack>
				);
			})}
		</Stack>
	);
};
