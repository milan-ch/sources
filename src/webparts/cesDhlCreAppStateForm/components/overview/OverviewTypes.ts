
export interface IOverviewCreAppState {
    //   projectContextSplit?: IProjectContextSplit,
    projectContext?: string,
    marketOverViewRentHigh?: string,
    marketOverViewRentLow?: string,
    marketOverview?: string,
    marketOverviewSource?: string,
    CRERole?: string,
    marketOverviewItems: IMarketOverviewItem[]
}

export interface IMarketOverviewItem {
    id: number;
    marketOverviewAddress: string;
    marketOverviewLeaseStart : string;
    marketOverviewLeaseTerm: string;
    marketOverviewSpaceOffice: string;
    marketOverviewSpaceWarehouse: string;
    marketOverviewSpaceTotal: string;
    marketOverviewRent: string;
    marketOverviewIncentive: string;
    marketOverviewComment: string;
}