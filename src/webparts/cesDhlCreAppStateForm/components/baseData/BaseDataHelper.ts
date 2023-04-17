import {ICurrent, ICurrentTotals, IProposed, IProposedTotals} from "./BaseDataTypes";

export const CurrentDefault: ICurrent = {
    currentLocationCity: "",
    currentLocationCode: "",
    currentOwned: false,
    currentExpirationDate: "",
    currentWarehouseArea: "",
    currentOfficeArea: "",
    currentOtherArea: "",
    currentTotalArea: "0",
    currentRentperYear: "",
    currentRentperMonth: "0",
    color: "grey",
    isBorderVisible: false,
    textContent: "",
    mitigationContent: "",
};

export const ProposedDefault: IProposed = {
    proposedCity: "",
    // proposedStartDate? - nedefinovano, aby pole bylo prazdne
    // proposedEndDate? - nedefinovano, aby pole bylo prazdne
    proposedLeaseYears: "",
    proposedWarehouseArea: "",
    proposedOfficeArea: "",
    proposedOtherArea: "",
    proposedTotalArea: "0",
    proposedRentperYear: "",
    proposedRentperMonth: "0",
    proposedTotalCost: "0",
};

export const CurrentTotalsDefault: ICurrentTotals = {
    currentWarehouseAreaTotal: 0,
    currentOfficeAreaTotal: 0,
    currentOtherAreaTotal: 0,
    currentTotalAreaTotal: 0,
    currentRentPerYearTotal: 0,
    currentRentPerMonthTotal: 0
};

export const ProposedTotalsDefault: IProposedTotals = {
    proposedWarehouseAreaTotal: 0,
    proposedOfficeAreaTotal: 0,
    proposedOtherAreaTotal: 0,
    proposedTotalAreaTotal: 0,
    proposedRentPerYearTotal: 0,
    proposedRentPerMonthTotal: 0,
    proposedTotalCostTotal: 0
};

export const CurrentVsProposedDefault = {
    differenceWarehouseAreaTotal: 0,
    differenceOfficeAreaTotal: 0,
    differenceOtherAreaTotal: 0,
    differenceTotalAreaTotal: 0,
    differenceRentPerYearTotal: 0,
    differenceRentPerMonthTotal: 0
};
