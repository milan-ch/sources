import { ColumnsInternal } from '../components/store';

export type Field = {
    label: string;
    id: ColumnsInternal;
    type: FieldType;
    width?: string;
    required?: boolean;
    readOnly?: boolean;
    lookupList?: string;
    placeHolder?: string;
    filterView?: string;
    onChanged?: (value: any) => void;
};

export type Section = {
    section: string | null;
    sectionFields: (Field | Field[])[];
};

export enum FieldType {
    TextField,
    Note,
    Dropdown,
    LookupDropdown,
    Checkbox,
    DatePicker,
    PeoplePicker
}

export interface ITabs {
    headerText: string;
    disabled?: boolean;
    component?: JSX.Element;
}

export const LeaseProjectType = "Lease";
export const PurchaseProjectType = "Purchase";
export const SaleProjectType = "Sale";
export const SaleAndLeasebackProjectType = "Sale & Leaseback";
export const HeritableLandSaleProjectType = "Heritable Land Sale";
export const OtherProjectType = "Other";

export const definedProjectTypes = [LeaseProjectType, PurchaseProjectType, SaleProjectType, SaleAndLeasebackProjectType, HeritableLandSaleProjectType, OtherProjectType];