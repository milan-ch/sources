
export interface ISite {
    address: string;
    landlordGroup: string;
    landlordOther: string;
    contractCurrency: string;
    indexation: string;
    breakOption: string;
    extensionOption: string;
    maintenance: string;
    incentives: string;
    SecurityDeposit: string;
    SecurityDepositOther: string;
    deniedPartyScreening: boolean;
    gogreenMinStandards: boolean;
    otherInfo: string;
    makeGoodValue: string;
    makeGoodComment: string;
    otherOneOffValue: string;
    otherOneOffComment: string;
    dilapidationsValue: string;
    dilapidationsComment: string;
    LHIValue: string;
    LHIComment: string;
    otherCapexValue: string;
    otherCapexComment: string;
    totalRentValue: string;
    totalRentComments: string;
    otherOngoingValue: string;
    otherOngoingComments: string;
    depreciationPerYearValue: string;
    depreciationPerYearComment: string;
    depreciationPerMonthValue: string;
    depreciationPerMonthComment: string;
}

export interface IDetailAndRiskFormByPurchase {
    pReconstructionCost?: number;
    pReconstructionCostRemarks: string;
    pImprovementCost?: number;
    pImprovementCostRemarks: string;
    pRelocationCost?: number;
    pRelocationCostRemarks: string;
    pBrokerFee?: number;
    pBrokerFeeRemarks: string;
    pConsultancyFee?: number;
    pConsultancyFeeRemarks: string;
    pTax?: number;
    pTaxRemarks: string;
    pPenalty?: number;
    pPenaltyRemarks: string;
    pEscrowFee?: number;
    pEscrowFeeRemarks: string;
    pProvisions?: number;
    pProvisionsRemarks: string;
    pOtherCost?: number;
    pOtherCostRemarks: string;
    pTotalOneOffCost?: number;
    pTotalOneOffCostRemarks: string;
    pDeprecation?: number;
    pDeprecationRemarks: string;
    pMaintenance?: number;
    pMaintenanceRemarks: string;
    pOngoingOtherCost?: number;
    pOngoingOtherCostRemarks: string;
    pTotalOngoingCost?: number;
    pTotalOngoingCostRemarks: string;
    pSublease?: number;
    pSubleaseRemarks: string;
    pOtherIncome?: number;
    pOtherIncomeRemarks: string;
    pTotalIncome?: number;
    pTotalIncomeRemarks: string;
    pDDTechnical?: string;
    pDDLegal?: string;
    pRevenueSalesRiskDesc: string;
    pPoliticalRiskDesc: string;
    pLegalTaxRiskDesc: string;
    pOtherRiskDesc: string;
}

export interface IDetailAndRiskFormBySale {
    sFacilityQuittingCost?: number;
    sFacilityQuittingCostRemarks: string;
    sBrokerFee?: number;
    sBrokerFeeRemarks: string;
    sConsultancyFee?: number;
    sConsultancyFeeRemarks: string;
    sNotaryCost?: number;
    sNotaryCostRemarks: string;
    sEscrowFee?: number;
    sEscrowFeeRemarks: string;
    sAccruals?: number;
    sAccrualsRemarks: string;
    sOtherCost?: number;
    sOtherCostRemarks: string;
    sTotalOneOffCost?: number;
    sTotalOneOffCostRemarks: string;
    sLostRevenuesSubletting?: number;
    sLostRevenuesSublettingRemarks: string;
    sLeaseBackCost: number;
    sLeaseBackCostRemarks: string;
    sOtherCost1?: number;
    sOtherCost1Remarks: string;
    sTotalOngoingCost?: number;
    sTotalOngoingCostRemarks?: string;
    sMaintenanceCost?: number;
    sMaintenanceCostRemarks: string;
    sDepreciation?: number;
    sDepreciationRemarks?: string;
    sPropertyTax?: number;
    sPropertyTaxRemarks: string;
    sOtherCost2?: number;
    sOtherCost2Remarks: string;
    sTotalOngoingSavings?: number;
    sTotalOngoingSavingsRemarks: string;
    sRemarks: string;
}