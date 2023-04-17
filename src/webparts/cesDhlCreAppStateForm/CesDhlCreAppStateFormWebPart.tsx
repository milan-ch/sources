/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
import { PropertyFieldPeoplePicker, PrincipalType, IPropertyFieldGroupOrPerson } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';
import * as strings from 'CesDhlCreAppStateFormWebPartStrings';
import { CesDhlCreAppStateForm } from './components/CesDhlCreAppStateForm';
import { spfi, SPFI, SPFx } from '@pnp/sp';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { PropertyFieldCodeEditor, PropertyFieldCodeEditorLanguages } from '@pnp/spfx-property-controls/lib/PropertyFieldCodeEditor';
import { IPersonaProps } from '@fluentui/react';
import { IFieldInfo } from '@pnp/sp/fields/types';
import { BrowserRouter } from 'react-router-dom';

import '@pnp/sp/fields';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
export interface ICesDhlCreAppStateFormWebPartProps {
	statementId?: number;
	approvalTaskId?: number;
	hasEditPermission: boolean;
	title: string;
	projectTitleHeaderText: string;
	countryList: string;
	businessUnitList: string;
	currencyList: string;
	brokerNamesList: string;
	landlordGroupList: string;
	statementApprovalsList: string;
	logoUrl: string;
	projectTypes: { type: string }[];
	globalChecker: IPropertyFieldGroupOrPerson[];
	globalApprover: IPropertyFieldGroupOrPerson[];
	complianceManager: IPropertyFieldGroupOrPerson[];
	separatorColor: string;
	selectedProjectType: string;
	imageSiteLocationPlaceholder: string;
	imageSitePhotoPlaceholder: string;
	riskRevenueSalesPlaceholder: string;
	riskPoliticalPlaceholder: string;
	riskPartnerPlaceholder: string;
	riskLegalTaxPlaceholder: string;
	riskOtherPlaceholder: string;
	urlRedirectAfterSave: string;
}
export interface ICesDhlCreAppStateFormProps extends ICesDhlCreAppStateFormWebPartProps {
	context: WebPartContext;
	sp: SPFI;
	statementApprovalsListFields: IFieldInfo[];
	globalCheckerProps: IPersonaProps[];
	globalApproverProps: IPersonaProps[];
	complianceManagerProps: IPersonaProps[];
}

const convertPropertyFieldPersonToPersonaProps = (person: IPropertyFieldGroupOrPerson[]): IPersonaProps[] => {
	if (!person) {
		return [];
	}
	return person.map((p) => ({ id: p.id, imageInitials: p.initials, imageUrl: p.imageUrl, loginName: p.login, secondaryText: p.email, text: p.fullName }));
};
export const WEBPART_CTX = React.createContext<ICesDhlCreAppStateFormProps | undefined>(undefined);

export default class CesDhlCreAppStateFormWebPart extends BaseClientSideWebPart<ICesDhlCreAppStateFormWebPartProps> {
	private _sp: SPFI;
	private _statementApprovalsListFields: IFieldInfo[] = undefined;

	public render(): void {
		const props: ICesDhlCreAppStateFormProps = {
			...this.properties,
			projectTitleHeaderText: this.properties.projectTitleHeaderText || 'Approval Statement',
			projectTypes: this.properties.projectTypes || [],
			statementApprovalsListFields: this._statementApprovalsListFields || [],
			globalApproverProps: convertPropertyFieldPersonToPersonaProps(this.properties.globalApprover),
			globalCheckerProps: convertPropertyFieldPersonToPersonaProps(this.properties.globalChecker),
			complianceManagerProps: convertPropertyFieldPersonToPersonaProps(this.properties.complianceManager),
			separatorColor: this.properties.separatorColor || '#FFCC00',
			logoUrl: this.properties.logoUrl || 'https://logodownload.org/wp-content/uploads/2015/12/dhl-logo-2.png',
			title: this.properties.title || 'DHL CreAppState Form',
			context: this.context,
			sp: this._sp,
			selectedProjectType: undefined,
			hasEditPermission: true
		};

		const element = (
			<BrowserRouter>
				<WEBPART_CTX.Provider value={props}>
					<CesDhlCreAppStateForm />
				</WEBPART_CTX.Provider>
			</BrowserRouter>
		);
		ReactDom.render(element, this.domElement);
	}

	protected async onInit(): Promise<void> {
		this._sp = spfi().using(SPFx(this.context));
				
		if (this._statementApprovalsListFields === undefined && this.properties.statementApprovalsList) {
			this._statementApprovalsListFields = await this._sp.web.lists.getById(this.properties.statementApprovalsList).fields.filter('Hidden eq false')();
		}
		return super.onInit();
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription,
					},
					displayGroupsAsAccordion: true,
					groups: [
						{
							groupName: 'Basic configuration',
							groupFields: [
								PropertyPaneTextField('title', {
									label: 'Form title',
								}),
								PropertyPaneTextField('logoUrl', {
									label: 'Form logo URL',
								}),
								PropertyPaneTextField('projectTitleHeaderText', {
									label: 'Project title header text',
								}),
								PropertyFieldListPicker('statementApprovalsList', {
									label: 'Statement approvals list',
									selectedList: this.properties.statementApprovalsList,
									includeHidden: false,
									orderBy: PropertyFieldListPickerOrderBy.Title,
									disabled: false,
									onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
									properties: this.properties,
									context: this.context as any,
									onGetErrorMessage: null,
									deferredValidationTime: 0,
									key: 'statementApprovalsList',

								}),
								PropertyFieldListPicker('businessUnitList', {
									label: 'Business unit list',
									selectedList: this.properties.businessUnitList,
									includeHidden: false,
									orderBy: PropertyFieldListPickerOrderBy.Title,
									disabled: false,
									onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
									properties: this.properties,
									context: this.context as any,
									onGetErrorMessage: null,
									deferredValidationTime: 0,
									key: 'businessUnitList',
								}),
								PropertyFieldListPicker('countryList', {
									label: 'Country list',
									selectedList: this.properties.countryList,
									includeHidden: false,
									orderBy: PropertyFieldListPickerOrderBy.Title,
									disabled: false,
									onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
									properties: this.properties,
									context: this.context as any,
									onGetErrorMessage: null,
									deferredValidationTime: 0,
									key: 'countryList',
								}),
								PropertyFieldListPicker('brokerNamesList', {
									label: 'Broker names list',
									selectedList: this.properties.brokerNamesList,
									includeHidden: false,
									orderBy: PropertyFieldListPickerOrderBy.Title,
									disabled: false,
									onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
									properties: this.properties,
									context: this.context as any,
									onGetErrorMessage: null,
									deferredValidationTime: 0,
									key: 'brokerNamesList',
								}),
								PropertyFieldListPicker('landlordGroupList', {
									label: 'Landlord Group list',
									selectedList: this.properties.brokerNamesList,
									includeHidden: false,
									orderBy: PropertyFieldListPickerOrderBy.Title,
									disabled: false,
									onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
									properties: this.properties,
									context: this.context as any,
									onGetErrorMessage: null,
									deferredValidationTime: 0,
									key: 'landlordGroupList',
								}),
								PropertyFieldListPicker('currencyList', {
									label: 'Currency list',
									selectedList: this.properties.currencyList,
									includeHidden: false,
									orderBy: PropertyFieldListPickerOrderBy.Title,
									disabled: false,
									onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
									properties: this.properties,
									context: this.context as any,
									onGetErrorMessage: null,
									deferredValidationTime: 0,
									key: 'currencyList',
								}),
								PropertyFieldCollectionData('projectTypes', {
									key: 'collectionData',
									label: 'Project type',
									manageBtnLabel: 'Manage project types',
									value: this.properties.projectTypes,
									fields: [
										{
											id: 'type',
											title: 'Project type',
											type: CustomCollectionFieldType.string,
											required: true,
										},
									],
									panelHeader: '',
								}),
								PropertyFieldCodeEditor('imageSiteLocationPlaceholder', {
									label: 'Site Location Placeholder string',
									panelTitle: 'Edit HTML Code',
									initialValue: this.properties.imageSiteLocationPlaceholder,
									onPropertyChange: this.onPropertyPaneFieldChanged,
									properties: this.properties,
									disabled: false,
									key: 'imageSiteLocationCodeEditorFieldId',
									language: PropertyFieldCodeEditorLanguages.HTML,
									options: {
										wrap: true,
										fontSize: 20
									}
								}),
								PropertyFieldCodeEditor('imageSitePhotoPlaceholder', {
									label: 'Site Photo Placeholder string',
									panelTitle: 'Edit HTML Code',
									initialValue: this.properties.imageSitePhotoPlaceholder,
									onPropertyChange: this.onPropertyPaneFieldChanged,
									properties: this.properties,
									disabled: false,
									key: 'imageSitePhotoCodeEditorFieldId',
									language: PropertyFieldCodeEditorLanguages.HTML,
									options: {
										wrap: true,
										fontSize: 20
									}
								}),
								PropertyPaneTextField('urlRedirectAfterSave', {
									label: 'URL redirect after save',
								}),
							],
							isCollapsed: true,
						},
						{
							groupName: 'Details & Risk configuration',
							groupFields: [
								PropertyFieldCodeEditor('riskRevenueSalesPlaceholder', {
									label: 'Risk Revenue / Sales Placeholder string',
									panelTitle: 'Edit HTML Code',
									initialValue: this.properties.riskRevenueSalesPlaceholder,
									onPropertyChange: this.onPropertyPaneFieldChanged,
									properties: this.properties,
									disabled: false,
									key: 'riskRevenueSalesCodeEditorFieldId',
									language: PropertyFieldCodeEditorLanguages.HTML,
									options: {
										wrap: true,
										fontSize: 20
									}
								}),
								PropertyFieldCodeEditor('riskPoliticalPlaceholder', {
									label: 'Risk Political Placeholder string',
									panelTitle: 'Edit HTML Code',
									initialValue: this.properties.riskPoliticalPlaceholder,
									onPropertyChange: this.onPropertyPaneFieldChanged,
									properties: this.properties,
									disabled: false,
									key: 'riskPoliticalCodeEditorFieldId',
									language: PropertyFieldCodeEditorLanguages.HTML,
									options: {
										wrap: true,
										fontSize: 20
									}
								}),
								PropertyFieldCodeEditor('riskPartnerPlaceholder', {
									label: 'Risk Partner Placeholder string',
									panelTitle: 'Edit HTML Code',
									initialValue: this.properties.riskPartnerPlaceholder,
									onPropertyChange: this.onPropertyPaneFieldChanged,
									properties: this.properties,
									disabled: false,
									key: 'riskPartnerCodeEditorFieldId',
									language: PropertyFieldCodeEditorLanguages.HTML,
									options: {
										wrap: true,
										fontSize: 20
									}
								}),
								PropertyFieldCodeEditor('riskLegalTaxPlaceholder', {
									label: 'Risk Legal/Tax Placeholder string',
									panelTitle: 'Edit HTML Code',
									initialValue: this.properties.riskLegalTaxPlaceholder,
									onPropertyChange: this.onPropertyPaneFieldChanged,
									properties: this.properties,
									disabled: false,
									key: 'riskLegalTaxCodeEditorFieldId',
									language: PropertyFieldCodeEditorLanguages.HTML,
									options: {
										wrap: true,
										fontSize: 20
									}
								}),
								PropertyFieldCodeEditor('riskOtherPlaceholder', {
									label: 'Risk Any Other Placeholder string',
									panelTitle: 'Edit HTML Code',
									initialValue: this.properties.riskOtherPlaceholder,
									onPropertyChange: this.onPropertyPaneFieldChanged,
									properties: this.properties,
									disabled: false,
									key: 'riskOtherCodeEditorFieldId',
									language: PropertyFieldCodeEditorLanguages.HTML,
									options: {
										wrap: true,
										fontSize: 20
									}
								}),
							],
						},
						{ groupName: 'Color configuration', groupFields: [PropertyPaneTextField('separatorColor', { label: 'Separator color string' })] },
						{
							groupName: 'Default values configuration',
							groupFields: [
								PropertyFieldPeoplePicker('globalChecker', {
									label: 'Global checker',
									initialData: this.properties.globalChecker,
									allowDuplicate: false,
									principalType: [PrincipalType.Users],
									onPropertyChange: this.onPropertyPaneFieldChanged,
									context: this.context as any,
									properties: this.properties,
									onGetErrorMessage: null,
									deferredValidationTime: 0,
									key: 'globalCheckerId',
								}),
								PropertyFieldPeoplePicker('globalApprover', {
									label: 'Global approver',
									initialData: this.properties.globalApprover,
									allowDuplicate: false,
									principalType: [PrincipalType.Users],
									onPropertyChange: this.onPropertyPaneFieldChanged,
									context: this.context as any,
									properties: this.properties,
									onGetErrorMessage: null,
									deferredValidationTime: 0,
									key: 'globalApproverId',
								}),
								PropertyFieldPeoplePicker('complianceManager', {
									label: 'Compliance manager',
									initialData: this.properties.complianceManager,
									allowDuplicate: false,
									principalType: [PrincipalType.Users],
									onPropertyChange: this.onPropertyPaneFieldChanged,
									context: this.context as any,
									properties: this.properties,
									onGetErrorMessage: null,
									deferredValidationTime: 0,
									key: 'complianceManagerId',
								}),
							],
						},
					],
				},
			],
		};
	}
}
