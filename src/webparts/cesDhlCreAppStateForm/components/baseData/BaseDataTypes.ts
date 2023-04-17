
export interface IFormSaleAndLeaseback {
    buildingOwnershipStatus?: string;
    groundOwnerhipStatus?: string;
    dealType?: string;
    siteAreaTBSold?: number;
    siteTotalArea?: number;
    siteRemainingArea?: number;
    constructionYear?: number;
    lettableArea?: number;
    lettableVacantArea?: number;
    lettableSince?: string;
    appraisalValue?: string; // number
    appraisalDated?: string;
    appraisorName?: string;
    appraisalAttachment?: File;
    LeaseBackArea?: string; // number
    LeaseBackPayment: string; // number
    LeaseBackPeriodStart?: string;
    LeaseBackPeriodEnd?: string;
    expectedSellingPrice?: string; // number
    salesRelatedCost?: string; // number
    potentialPurchaser?: string;
    PurchaserPartyScreening?: boolean;
    PurchaserPartyScreeningAttachment?: File;
    brokerName?: string;
    otherBroker?: string;
    NetBookValue?: number;
    netBookValueFrom?: string;
    annualDepreciation?: string; // number
    budgetRate?: string; // number
    transactionalCurrency?: string;
    EbitImpact?: number;
    dateSigningContract?: string;
    paymentDate?: string;
    dateOwnershipTransfer?: string;
    slbBreakOption?: string;
    slbPenaltyCost?: string; // number
    slbIndexation?: string; // number
    slbMaintenance?: string; // number
}

export interface IFormDataFormByPurchase {
    pSiteArea?: number,
    pDealType?: string,
    pConstructionYear?: number;
    pTotalUsableArea?: number;
    pWarehouseProd?: number;
    pOffice?: number;
    pOthers?: number;
    pVacantArea?: number;
    pSeller?: string;
    pBoolDPS?: boolean,
    pAttachDPS?: string;
    pFutureDHLOwn?: string;
    pAppraisalValue?: number;
    pFromDate?: string;
    pAppraisorName?: string;
    pAppraisorNameAttach?: string;
    pbrokerName?: string;
    pPurchasePrice?: string;
    pPurchasedRelatedCost?: string; //pTotalOneoffCost
    pEbitImpactOneoff?: number; //sum (pPurchasePrice + pPurchaseRelatedCost)
    pBudgetRate?: string;
    pCurrency?: string;
    pContractSigning?: string;
    pPaymentDate?: string;
    pOwnershipTransfer?: string;
}

export interface ICurrent {
    currentLocationCity: string;
    currentLocationCode: string;
    currentOwned: boolean;
    currentExpirationDate?: string;
    currentWarehouseArea: string;
    currentOfficeArea: string;
    currentOtherArea: string;
    currentTotalArea: string;
    currentRentperYear: string;
    currentRentperMonth: string;
    color: string;
    isBorderVisible: boolean;
    textContent: string;
    mitigationContent: string;
}

export interface ICurrentTotals {
    currentWarehouseAreaTotal: number;
    currentOfficeAreaTotal: number;
    currentOtherAreaTotal: number;
    currentTotalAreaTotal: number;
    currentRentPerYearTotal: number;
    currentRentPerMonthTotal: number;
}

export interface IProposedTotals {
    proposedWarehouseAreaTotal: number;
    proposedOfficeAreaTotal: number;
    proposedOtherAreaTotal: number;
    proposedTotalAreaTotal: number;
    proposedRentPerYearTotal: number;
    proposedRentPerMonthTotal: number;
    proposedTotalCostTotal: number;
}

export interface ICurrentVsProposed {
    differenceWarehouseAreaTotal: number;
    differenceOfficeAreaTotal: number;
    differenceOtherAreaTotal: number;
    differenceTotalAreaTotal: number;
    differenceRentPerYearTotal: number;
    differenceRentPerMonthTotal: number;
}

export interface IProposed {
    proposedCity: string;
    proposedStartDate?: string;
    proposedEndDate?: string;
    proposedLeaseYears: string;
    proposedWarehouseArea: string;
    proposedOfficeArea: string;
    proposedOtherArea: string;
    proposedTotalArea: string;
    proposedRentperYear: string;
    proposedRentperMonth: string;
    proposedTotalCost: string;
}

export interface IBaseDataLease {
    currentComment: string;
    currentFields: ICurrent[];
    proposedComment: string;
    proposedFields: IProposed[];
}