import { IDropdownOption } from 'office-ui-fabric-react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { getDefaultStoreData } from '../helpers/data';

export type TInput = {
	value: any;
	required?: boolean;
	hidden?: boolean;
};
export type ColumnsInternal =
	| 'Title'
	| 'projectType'
	| 'CRE_x0020_Statement_x0020_Refere'	
	| 'Business_x0020_Unit_x0020_2'
	| 'CRE_x0020_Statement_x0020_Versio'
	| 'Country'
	| 'BU_x0020_Project_x0020_Volume'
	| 'CRE_x0020_Project_x0020_Volume'
	| 'BU_x0020_BCA_x0020_Reference'
	| 'Approval_x0020_Required'
	| 'BU_x0020_BCA_x0020_Version'
	| 'BackToBack'
	| 'Purchase_x0020_Price'
	| 'property_address'
	| 'projectContext'

	//####
	| 'ApprovalStatus'
	| 'Approval_x0020_Type'
	| 'Statement_x0020_Remarks'
	| 'Statement_x0020_Author'
	| 'Authors'
	| 'Country_x0020_Checker'
	// Does not exist
	| 'Country_x0020_Approver'
	| 'Regional_x0020_Checker'
	| 'Regional_x0020_Approver'
	| 'Global_x0020_Checker'
	| 'Global_x0020_Manager'
	| 'Sales_x0020_Price'
	| 'Global_x0020_Approver';

export type TInputs = {
	[name in ColumnsInternal]: TInput;
};

type TOptions = Partial<{
	[name in ColumnsInternal]: IDropdownOption[];
}>;

type FormStore = {
	inputs: TInputs;
	options: TOptions;
	inputInitialized: boolean;
	loadingObject: { text: string; loading: boolean };
	setInputInitialized(initialized: boolean): void;
	setInputs(internalName: ColumnsInternal, property: keyof TInput, value: any): void;
	setInputsMultiple(...inputs: { internalName: ColumnsInternal; property: keyof TInput; value: any }[]): void;
	setDropdownOptions(internalName: ColumnsInternal, value: IDropdownOption[]): void;
	setDropdownOptionsMultiple(...options: { internalName: ColumnsInternal; value: IDropdownOption[] }[]): void;
};

export const useFormStore = create<FormStore, [['zustand/immer', never]]>(
	immer((set) => ({
		inputs: getDefaultStoreData(),
		inputInitialized: false,
		options: {
			projectType: [],
			Business_x0020_Unit_x0020_2: [],
			Country: [],
		},
		loadingObject: { text: 'Loading', loading: true },
		setInputInitialized: (initialized) => {
			set((state) => {
				state.inputInitialized = initialized;
			});
		},
		setInputsMultiple: (...inputs) => {
			set((state) => {
				inputs.forEach((input) => (state.inputs[input.internalName][input.property] = input.value));
			});
		},
		setDropdownOptionsMultiple: (...options) => {
			set((state) => {
				options.forEach((input) => (state.options[input.internalName] = input.value));
			});
		},
		setInputs: (internalName, property, value) => {
			set((state) => {
				state.inputs[internalName][property] = value;
			});
		},
		setDropdownOptions: (internalName, options) => {
			set((state) => {
				state.options[internalName] = options;
			});
		},
	}))
);
export const useLoading = () => useFormStore((store) => store.loadingObject);
export const useInputs = () => useFormStore((store) => store.inputs);
export const useInput = (key: ColumnsInternal) => useFormStore((store) => store.inputs[key]);
export const useDropdownOption = (key: ColumnsInternal) => useFormStore((store) => store.options[key]);
export const useDropdownOptions = () => useFormStore((store) => store.options);

export const useInputInitialized = () => useFormStore((store) => store.inputInitialized);
