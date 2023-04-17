import { Label, Dropdown, Checkbox, IDropdownOption } from "@fluentui/react";
import * as React from "react";
import * as helper from "../../../helpers/CommonHelper";
import { TextFieldReadOnly } from "../../general/TextFieldReadOnly";
import { FileDropZone } from "../../general/FileDropZone";
import { useFormStore } from "../../store";
import { LookupDropdown } from "../../../controls/LookupDropdown";
import { WEBPART_CTX } from "../../../CesDhlCreAppStateFormWebPart";
import { TwoItemsStack } from "../../general/TwoItemsStack";
import { OneItemStack } from "../../general/OneItemStack";
import { DealTypeOptions } from "../../general/DropdownListOptions";
import { TextFieldNumber } from "../../general/TextFieldNumber";
import { useDataStore } from "../../tStore";
import { CustomTextField } from "../../general/CustomTextField";
import { CustomDatePickerField } from "../../general/CustomDatePickerField";
import * as moment from "moment";
import {IFormSaleAndLeaseback} from "../BaseDataTypes";

const buildingOwnerShipStatusOptions: IDropdownOption[] = [
    { key: "Freehold", text: "Freehold" },
    { key: "Heritable building right", text: "Heritable building right" },
];

const groundOwnerShipStatusOptions: IDropdownOption[] = [
    { key: "Freehold", text: "Freehold" },
    { key: "Heritable building right", text: "Heritable building right" },
];

export const BaseDataFormBySale = (): JSX.Element => {

    const ctx = React.useContext(WEBPART_CTX);

    const projectType = useFormStore.getState().inputs.projectType?.value?.key || undefined;

    const [saleAndLeaseback, setSaleAndLeaseback] = React.useState(false);
    const [sale, setSale] = React.useState(false);

    const [formData, setFormData] = React.useState<IFormSaleAndLeaseback>({
        siteAreaTBSold: null,
        siteTotalArea: null,
        siteRemainingArea: null,
        lettableArea: null,
        lettableVacantArea: null,
        appraisalValue: "",
        appraisorName: "",
        LeaseBackArea: "",
        LeaseBackPayment: "",
        expectedSellingPrice: "",
        salesRelatedCost: "",
        potentialPurchaser: "",
        brokerName: null,
        otherBroker: null,
        NetBookValue: null,
        annualDepreciation: "",
        PurchaserPartyScreening: false,
        budgetRate: "",
        transactionalCurrency: "",
        EbitImpact: null,
        slbBreakOption: "",
        slbPenaltyCost: "",
        slbIndexation: "",
        slbMaintenance: null
    });

    React.useEffect(() => {
        setSaleAndLeaseback(projectType === "Sale & Leaseback");
        setSale(projectType === "Sale");
        const form = useDataStore.getState().forms.BaseData.Sale;
        setFormData(form);
    }, []);

    React.useEffect(() => {
        useDataStore.getState().setBaseDataSale(formData);
    }, [formData]);

    const saleCalculation = (): void => {
        setFormData((prevState) => {
            return {
                ...prevState,
                EbitImpact: (Number(formData.expectedSellingPrice) - formData.NetBookValue),
                siteRemainingArea: formData.siteTotalArea - formData.siteAreaTBSold,
            };
        });
    };

    const inputChange = (key: keyof IFormSaleAndLeaseback, value: string | boolean | number): void => {
        setFormData((prevState) => {
            return {
                ...prevState,
                [key]: value,
            };
        });
    };

    const handleEvent =
        (propName: keyof IFormSaleAndLeaseback): ((event: React.FormEvent<HTMLInputElement>) => void) =>
            (_event: React.FormEvent<HTMLInputElement>, newValue?: string | boolean | number): void => {
                inputChange(propName, newValue);
            };

    const handleDate = (propName: keyof IFormSaleAndLeaseback) => (date: any) => {
        inputChange(propName, moment(date).format("MM/DD/YYYY"));
    };

    const handleDropdownEvent = (propName: keyof IFormSaleAndLeaseback): ((event: React.FormEvent<HTMLInputElement>) => void) =>
        (_event: React.FormEvent<HTMLInputElement>, newValue?: IDropdownOption): void => {
            inputChange(propName, newValue.key);
        };

    return (
        <>
            <TwoItemsStack
                leftItem={
                    <Dropdown
                        placeholder="Please select a value..."
                        label="Ownership status building"
                        selectedKey={formData.buildingOwnershipStatus}
                        onChange={handleDropdownEvent('buildingOwnershipStatus')}
                        options={buildingOwnerShipStatusOptions}
                    />}
                rightItem={
                    <TextFieldNumber
                        label="Expected selling price (k€)"
                        value={helper.formatNumber(formData.expectedSellingPrice)}
                        onChange={handleEvent("expectedSellingPrice")}
                        onBlur={saleCalculation}
                    />}
            />
            <TwoItemsStack
                leftItem={
                    <Dropdown
                        placeholder="Please select a value..."
                        label="Ownership status ground"
                        selectedKey={formData.groundOwnerhipStatus}
                        onChange={handleDropdownEvent('groundOwnerhipStatus')}
                        options={groundOwnerShipStatusOptions}
                    />}
                rightItem={<TextFieldReadOnly label="Sales related cost (k€)"
                    value={formData.salesRelatedCost} />}
            />
            <TwoItemsStack
                leftItem={
                    <Dropdown
                        placeholder="Please select a value..."
                        label="Type of deal (asset / share)"
                        selectedKey={formData.dealType}
                        onChange={handleDropdownEvent('dealType')}
                        options={DealTypeOptions}
                    />}
                rightItem={
                    <CustomTextField label="Name of potential purchaser" value={formData.potentialPurchaser}
                        onChange={handleEvent("potentialPurchaser")} />}
            />
            <TwoItemsStack
                leftItem={
                    <TextFieldNumber
                        label="Site area to be sold (sqm)"
                        value={helper.formatNumber(formData.siteAreaTBSold)}
                        onChange={handleEvent("siteAreaTBSold")}
                        onBlur={saleCalculation}
                    />}
                rightItem={
                    <Checkbox
                        styles={{ root: { marginTop: 32 } }}
                        label="Denied Party Screening approved"
                        checked={formData.PurchaserPartyScreening}
                        onChange={handleEvent("PurchaserPartyScreening")}
                    />}
            />
            <TwoItemsStack
                leftItem={
                    <TextFieldNumber
                        label="Total site area (sqm)"
                        value={helper.formatNumber(formData.siteTotalArea)}
                        onChange={handleEvent("siteTotalArea")}
                        onBlur={saleCalculation}
                    />}
                rightItemLabel={<Label>Add result</Label>}
                rightItem={<FileDropZone />}
            />
            <TwoItemsStack
                leftItem={<TextFieldReadOnly label="Remaining site area (sqm)"
                    value={helper.formatNumber(formData.siteRemainingArea)} />}
                rightItem={
                    <LookupDropdown
                        lookupListId={ctx.brokerNamesList}
                        label="Name of broker"
                        selectedKey={Number(formData.brokerName)}
                        onChange={handleDropdownEvent('brokerName')}
                    />}
            />
            <TwoItemsStack
                leftItem={
                    <TextFieldNumber
                        value={helper.formatNumber(formData.constructionYear)}
                        onChange={handleEvent("constructionYear")}
                        label="Year of construction"
                    />}
                rightItem={
                    <CustomTextField label="If Other, please specify" value={formData.otherBroker} onChange={handleEvent("otherBroker")} />}
            />
            <TwoItemsStack
                leftItem={
                    <TextFieldNumber label="Total lettable area (sqm)" value={helper.formatNumber(formData.lettableArea)}
                        onChange={handleEvent("lettableArea")} />}
                rightItem={
                    <TextFieldNumber
                        label="Net book value (IAS) (k€)"
                        value={helper.formatNumber(formData.NetBookValue)}
                        onChange={handleEvent("NetBookValue")}
                        onBlur={saleCalculation}
                    />}
            />
            <TwoItemsStack
                leftItem={
                    <TextFieldNumber
                        label="Thereof vacant (sqm)"
                        value={helper.formatNumber(formData.lettableVacantArea)}
                        onChange={handleEvent("lettableVacantArea")}
                    />}
                rightItem={
                    <CustomDatePickerField
                        label="As of"
                        val={formData.netBookValueFrom}
                        onSelectDate={handleDate("netBookValueFrom")}
                    />}
            />
            <TwoItemsStack
                leftItem={
                    <CustomDatePickerField
                        label="Since / As of"
                        val={formData.lettableSince}
                        onSelectDate={handleDate("lettableSince")}
                    />}
                rightItem={
                    <TextFieldNumber
                        label="Annual depreciation (k€)"
                        value={helper.formatNumber(formData.annualDepreciation)}
                        onChange={handleEvent("annualDepreciation")}
                    />}
            />
            <TwoItemsStack
                leftItem={
                    <TextFieldNumber
                        label="Appraisal value (k€)"
                        value={helper.formatNumber(formData.appraisalValue)}
                        onChange={handleEvent("appraisalValue")}
                    />}
                rightItem={
                    <TextFieldNumber label="Budget rate (from investment tool)"
                        value={helper.formatNumber(formData.budgetRate)} onChange={handleEvent("budgetRate")} />}
            />
            <TwoItemsStack
                leftItem={
                    <CustomDatePickerField
                        label="Dated from"
                        val={formData.appraisalDated}
                        onSelectDate={handleDate("appraisalDated")}
                    />}
                rightItem={
                    <LookupDropdown
                        lookupListId={ctx.currencyList}
                        label="Transactional currency"
                        placeholder="Please select a value..."
                        selectedKey={Number(formData.transactionalCurrency)}
                        onChange={handleDropdownEvent('transactionalCurrency')}
                    />}
            />
            <TwoItemsStack
                leftItem={
                    <CustomTextField label="Name of appraisor" value={formData.appraisorName} onChange={handleEvent("appraisorName")} />}
                rightItem={
                    <TextFieldReadOnly label="EBIT Impact (k€)" value={helper.formatNumber(formData.EbitImpact)} />}
            />
            <TwoItemsStack
                leftItemLabel={<Label>Attach appraisal</Label>}
                leftItem={<FileDropZone />}
                rightItem={
                    <CustomDatePickerField
                        label="Signing of contract"
                        val={formData.dateSigningContract}
                        onSelectDate={handleDate("dateSigningContract")}
                    />}
            />
            {sale && (
                <>
                    <OneItemStack rightItem={
                        <CustomDatePickerField label="Payment Date" val={formData.paymentDate} onSelectDate={handleDate("paymentDate")} />}
                    />
                    <OneItemStack rightItem={
                        <CustomDatePickerField
                            label="Transfer of ownership"
                            val={formData.dateOwnershipTransfer}
                            onSelectDate={handleDate("dateOwnershipTransfer")}
                        />}
                    />
                </>
            )}
            {saleAndLeaseback && (
                <>
                    <TwoItemsStack
                        leftItem={
                            <TextFieldNumber
                                label="Lease back area (sqm)"
                                value={helper.formatNumber(formData.LeaseBackArea)}
                                onChange={handleEvent("LeaseBackArea")}
                            />}
                        rightItem={
                            <CustomDatePickerField label="Payment Date" val={formData.paymentDate} onSelectDate={handleDate("paymentDate")} />}
                    />
                    <TwoItemsStack
                        leftItem={
                            <TextFieldNumber
                                label="Lease back payment (k€/a)"
                                value={helper.formatNumber(formData.LeaseBackPayment)}
                                onChange={handleEvent("LeaseBackPayment")}
                            />}
                        rightItem={
                            <CustomDatePickerField
                                label="Transfer of ownership"
                                val={formData.dateOwnershipTransfer}
                                onSelectDate={handleDate("dateOwnershipTransfer")}
                            />}
                    />
                    <TwoItemsStack
                        leftItem={
                            <CustomDatePickerField
                                label="Lease back start"
                                val={formData.LeaseBackPeriodStart}
                                onSelectDate={handleDate("LeaseBackPeriodStart")}
                            />}
                        rightItem={
                            <CustomTextField label="Break option" value={formData.slbBreakOption}
                                onChange={handleEvent("slbBreakOption")} />}
                    />
                    <TwoItemsStack
                        leftItem={
                            <CustomDatePickerField
                                label="Lease back end"
                                val={formData.LeaseBackPeriodEnd}
                                onSelectDate={handleDate("LeaseBackPeriodEnd")}
                            />}
                        rightItem={
                            <TextFieldNumber
                                label="Penalty cost (k€)"
                                value={helper.formatNumber(formData.slbPenaltyCost)}
                                onChange={handleEvent("slbPenaltyCost")}
                            />}
                    />
                    <OneItemStack
                        rightItem={
                            <TextFieldNumber
                                label="Indexation (k€)"
                                value={helper.formatNumber(formData.slbIndexation)}
                                onChange={handleEvent("slbIndexation")}
                            />}
                    />
                    <OneItemStack
                        rightItem={
                            <TextFieldNumber
                                label="Maintenance (k€)"
                                value={helper.formatNumber(formData.slbMaintenance)}
                                onChange={handleEvent("slbMaintenance")}
                            />}
                    />
                </>
            )}
        </>
    );
};
