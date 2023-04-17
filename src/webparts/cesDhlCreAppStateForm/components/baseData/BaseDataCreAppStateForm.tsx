import * as React from "react";
import { definedProjectTypes, HeritableLandSaleProjectType, LeaseProjectType, OtherProjectType, PurchaseProjectType, SaleAndLeasebackProjectType, SaleProjectType } from "../../helpers/CommonTypes";
import { useFormStore } from "../store";
import { BaseDataFormByLease } from "./baseDataByProjectType/baseDataByLease/BaseDataFormByLease";
import { BaseDataFormByPurchase } from "./baseDataByProjectType/BaseDataFormByPurchase";
import { BaseDataFormBySale } from "./baseDataByProjectType/BaseDataFormBySale";

export const BaseDataCreAppStateForm = (): JSX.Element => {
  
  const projectType = useFormStore.getState().inputs.projectType?.value?.key || undefined;

  if (definedProjectTypes.includes(projectType))
    return (
      <>
        {projectType === LeaseProjectType && <BaseDataFormByLease />}
        {projectType === OtherProjectType && <BaseDataFormByLease />}
        {projectType === PurchaseProjectType && <BaseDataFormByPurchase />}
        {projectType === SaleProjectType && <BaseDataFormBySale />}
        {projectType === SaleAndLeasebackProjectType && <BaseDataFormBySale />}
        {projectType === HeritableLandSaleProjectType && <BaseDataFormBySale />}
      </>
    );
  else return <p style={{ color: "red" }}>Error, unknown Project Type</p>;
};
