import * as React from "react";
import { definedProjectTypes, HeritableLandSaleProjectType, LeaseProjectType, OtherProjectType, PurchaseProjectType, SaleAndLeasebackProjectType, SaleProjectType } from "../../../helpers/CommonTypes";
import { useFormStore } from "../../store";
import { DetailAndRiskFormByLease } from "./detailAndRiskByLease/DetailAndRiskFormByLease";
import { DetailAndRiskFormByPurchase } from "./detailAndRiskByPurchase/DetailAndRiskFormByPurchase";
import { DetailAndRiskFormBySale } from "./DetailAndRiskFormBySale/DetailAndRiskFormBySale";

export const DetailAndRiskCreAppStateForm = (): JSX.Element => {

    const projectType = useFormStore.getState().inputs.projectType?.value?.key || undefined;

    if (definedProjectTypes.includes(projectType))
        return (
            <>
                {projectType === LeaseProjectType && <DetailAndRiskFormByLease />}
                {projectType === OtherProjectType && <DetailAndRiskFormByLease />}
                {projectType === PurchaseProjectType && <DetailAndRiskFormByPurchase />}
                {projectType === SaleProjectType && <DetailAndRiskFormBySale />}
                {projectType === SaleAndLeasebackProjectType && <DetailAndRiskFormBySale />}
                {projectType === HeritableLandSaleProjectType && <DetailAndRiskFormBySale />}
            </>
        );
    else return <p style={{ color: "red" }}>Error, unknown Project Type</p>;
};
