import { Label, Dropdown, Checkbox, IDropdownOption } from "@fluentui/react";
import * as React from "react";
import { formatNumber } from "../../../helpers/CommonHelper";
import { TextFieldReadOnly } from "../../general/TextFieldReadOnly";
import { FileDropZone } from "../../general/FileDropZone";
import { LookupDropdown } from "../../../controls/LookupDropdown";
import { WEBPART_CTX } from "../../../CesDhlCreAppStateFormWebPart";
import { TwoItemsStack } from "../../general/TwoItemsStack";
import { OneItemStack } from "../../general/OneItemStack";
import { TextFieldNumber } from "../../general/TextFieldNumber";
import { DealTypeOptions } from "../../general/DropdownListOptions";
import { useDataStore } from "../../tStore";
import * as moment from "moment";
import { CustomTextField } from "../../general/CustomTextField";
import { CustomDatePickerField } from "../../general/CustomDatePickerField";
import {IFormDataFormByPurchase} from "../BaseDataTypes";

export const BaseDataFormByPurchase = (): JSX.Element => {

  const [formData, setFormData] = React.useState<IFormDataFormByPurchase>({
  });

  const inputChange = (key: keyof IFormDataFormByPurchase, value: string | boolean | number): void => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };

  const handleDropdownEvent =
    (propName: keyof IFormDataFormByPurchase): ((event: React.FormEvent<HTMLInputElement>) => void) =>
      (_event: React.FormEvent<HTMLInputElement>, newValue?: IDropdownOption): void => {
        inputChange(propName, newValue.key);
      };

  const handleEvent =
    (propName: keyof IFormDataFormByPurchase): ((event: React.FormEvent<HTMLInputElement>) => void) =>
      (_event: React.FormEvent<HTMLInputElement>, newValue?: string | boolean | number): void => {
        inputChange(propName, newValue);
      };

  const handleDate = (propName: keyof IFormDataFormByPurchase) => (date: Date) => {
    inputChange(propName, moment(date).format("MM/DD/YYYY"));
  };

  const saleCalculation = (): void => {
    setFormData((prevState) => {
      return {
        ...prevState,
        //pPurchasedRelatedCost: Number(useDataStore.getState().forms.DetailsAndRisks.Purchase)
        pEbitImpactOneoff: Number(formData.pPurchasePrice) + Number(formData.pPurchasedRelatedCost)
      };
    });
  };

  React.useEffect(() => {
    setFormData(useDataStore.getState().forms.BaseData.Purchase);
  }, []);

  React.useEffect(() => {
    useDataStore.getState().setBaseDataPurchase(formData);
  }, [formData])

  const ctx = React.useContext(WEBPART_CTX);

  return (
    <>
      <TwoItemsStack
        leftItem={
          <TextFieldNumber label="Site area (sqm)" value={formatNumber(formData.pSiteArea)} onChange={handleEvent('pSiteArea')} />}
        rightItem={
          <TextFieldNumber label="Appraisal value (k€)" value={formatNumber(formData.pAppraisalValue)} onChange={handleEvent('pAppraisalValue')} />}
      />
      <TwoItemsStack
        leftItem={
          <Dropdown placeholder="Please select a value..." label="Type of deal" selectedKey={formData.pDealType} onChange={handleDropdownEvent('pDealType')} options={DealTypeOptions} />}
        rightItem=
        {<CustomDatePickerField label="Dated from" val={formData.pFromDate} onSelectDate={handleDate('pFromDate')} />}
      />
      <TwoItemsStack
        leftItem={
          <TextFieldNumber label="Year of construction" value={formatNumber(formData.pConstructionYear)} onChange={handleEvent('pConstructionYear')} />
        }
        rightItem=
        {
          <CustomTextField label="Name of appraisor" value={formData.pAppraisorName} onChange={handleEvent('pAppraisorName')} />
        }
      />
      <TwoItemsStack
        leftItem={
          <TextFieldNumber label="Total usable area (sqm)" value={formatNumber(formData.pTotalUsableArea)} onChange={handleEvent('pTotalUsableArea')} />
        }
        rightItemLabel={<Label>Attach appraisal</Label>}
        rightItem={
          <FileDropZone />
        }
      />
      <TwoItemsStack
        leftItem={
          <TextFieldNumber label="Warehouse / Production (sqm)" value={formatNumber(formData.pWarehouseProd)} onChange={handleEvent('pWarehouseProd')} />
        }
        rightItem={
          <CustomTextField label="Name of broker" value={formatNumber(formData.pbrokerName)} onChange={handleEvent('pbrokerName')} />
        }
      />
      <TwoItemsStack
        leftItem={
          <TextFieldNumber label="Office (sqm)" value={formatNumber(formData.pOffice)} onChange={handleEvent('pOffice')} />
        }
        rightItem={
          <TextFieldNumber label="Purchasing price (k€)" value={formatNumber(formData.pPurchasePrice)} onChange={handleEvent("pPurchasePrice")} onBlur={saleCalculation} />
        }
      />
      <TwoItemsStack
        leftItem={
          <TextFieldNumber label="Others (sqm)" value={formatNumber(formData.pOthers)} onChange={handleEvent('pOthers')} />
        }
        rightItem={
          <TextFieldReadOnly label="Purchased related cost (k€)" value={formatNumber(formData.pPurchasedRelatedCost)} />
        }
      />
      <TwoItemsStack
        leftItem={
          <TextFieldNumber label="Initial vacant area (sqm)" value={formatNumber(formData.pVacantArea)} onChange={handleEvent('pVacantArea')}
          />
        }
        rightItem={
          <TextFieldReadOnly label="EBIT Impact (k€)" value={formatNumber(formData.pEbitImpactOneoff)} />
        }
      />
      <TwoItemsStack
        leftItem={
          <CustomTextField label="Seller" value={formData.pSeller} onChange={handleEvent('pSeller')} />
        }
        rightItem={
          <TextFieldNumber label="Budget rate" value={formatNumber(formData.pBudgetRate)} onChange={handleEvent('pBudgetRate')} />
        }
      />
      <TwoItemsStack
        leftItem={
          <Checkbox label="Denied Party Screening approved" checked={(formData.pBoolDPS)} onChange={handleEvent('pBoolDPS')} styles={{ root: { marginTop: 32 } }} />
        }
        rightItem={
          <LookupDropdown
            lookupListId={ctx.currencyList}
            label="Transactional currency"
            placeholder="Please select a value..."
            onChange={handleDropdownEvent('pCurrency')}
          />
        }
      />
      <TwoItemsStack
        leftItemLabel={<Label>Add result</Label>}
        leftItem={
          <FileDropZone />
        }
        rightItem={
          <CustomDatePickerField label="Signing of contract" val={formData.pContractSigning} onSelectDate={handleDate('pContractSigning')} />
        }
      />
      <TwoItemsStack
        leftItem={
          <CustomTextField label="Feature legal Owner @ DP DHL" value={formData.pFutureDHLOwn} onChange={handleEvent('pFutureDHLOwn')} />
        }
        rightItem={
          <CustomDatePickerField label="Payment Date" val={formData.pPaymentDate} onSelectDate={handleDate('pPaymentDate')} />
        }
      />
      <OneItemStack
        rightItem={
          <CustomDatePickerField label="Transfer of ownership" val={formData.pOwnershipTransfer} onSelectDate={handleDate('pOwnershipTransfer')} />
        }
      />
    </>
  );
};
