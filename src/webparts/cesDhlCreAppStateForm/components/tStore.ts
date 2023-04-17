import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {CurrentDefault, ProposedDefault} from "./baseData/BaseDataHelper";
import {IBaseDataLease, IFormDataFormByPurchase, IFormSaleAndLeaseback} from "./baseData/BaseDataTypes";
import {IDetailAndRiskFormByPurchase, IDetailAndRiskFormBySale, ISite} from "./detailAndRisks/DetailAndRiskTypes";
import {IOverviewCreAppState} from "./overview/OverviewTypes";
import {IHeritableSales} from "./heritableSales/HeritableSaleTypes";

export type TTabName = 'Overview' | 'BaseData' | 'DetailsAndRisks' | 'HeritableSales' | 'Attachments' | 'History';

export type TTabsDataModel = {
	[name in TTabName]: any;
};

type TabsFormsStore = {
	forms: TTabsDataModel;
	setOverview(value: IOverviewCreAppState): void;
	setBaseDataLease(value: IBaseDataLease): void;
	setBaseDataSale(value: IFormSaleAndLeaseback): void;
	setBaseDataPurchase(value: IFormDataFormByPurchase): void;
	setDetailsAndRiskLease(value: ISite): void;
	setDetailsAndRiskSale(value: IDetailAndRiskFormBySale): void;
	setDetailsAndRiskPurchase(value: IDetailAndRiskFormByPurchase): void;
	setHeritableSales(value: IHeritableSales): void;	
};

const getDefaultForms = (): TTabsDataModel => {
	return {
		Overview : { },
		BaseData: {
			Lease: {
				currentComment: '',
				currentFields: [ CurrentDefault ],
				proposedComment: '',
				proposedFields: [ ProposedDefault ],
			},
			Purchase: {},
			Sale: {}
		},
		DetailsAndRisks:  {
			Lease: {
				Fields: [ CurrentDefault ],
				proposedFields: [ ProposedDefault ],
			},
			Purchase: {},
			Sale: {}
		},
		HeritableSales: {},
		Attachments: {},
		History: {}
	}
}

export const useDataStore = create<TabsFormsStore, [['zustand/immer', never]]>(
	immer((set) => ({
		forms: getDefaultForms(),
		setBaseDataLease: (value: IBaseDataLease) => {
			set((state) => {
				state.forms.BaseData.Lease = value;
			});
		},
		setBaseDataSale: (value: IFormSaleAndLeaseback) => {
			set((state) => {
				state.forms.BaseData.Sale = value;
			});
		},
		setBaseDataPurchase: (value: IFormDataFormByPurchase) => {
			set((state) => {
				state.forms.BaseData.Purchase = value;
			});
		},
		setDetailsAndRiskLease: (value: ISite) => {
			set((state) => {
				state.forms.DetailsAndRisks.Lease = value;
			});
		},
		setDetailsAndRiskSale: (value: IDetailAndRiskFormBySale) => {
			set((state) => {
				state.forms.DetailsAndRisks.Sale = value;
			});
		},
		setDetailsAndRiskPurchase: (value: IDetailAndRiskFormByPurchase) => {
			set((state) => {
				state.forms.DetailsAndRisks.Purchase = value;
			});
		},
		setHeritableSales: (value: IHeritableSales) => {
			set((state) => {
				state.forms.HeritableSales = value;
			});
		},
		setOverview: (value: IOverviewCreAppState) => {
			set((state) => {
				state.forms.Overview = value;
			});
		}
	}))
);
