import { ICesDhlCreAppStateFormProps } from "../CesDhlCreAppStateFormWebPart";
import { TInputs } from "../components/store";
import { FieldType, Section } from "./CommonTypes";

export const getSetupData = (ctx: ICesDhlCreAppStateFormProps): Section[] => {
    return [
        {
            section: null,
            sectionFields: [
                {
                    label: "Project Title",
                    required: true,
                    type: FieldType.TextField,
                    id: "Title",
                },
                [
                    {
                        label: "Project Type",
                        type: FieldType.Dropdown,
                        id: "projectType",
                        onChanged: () => {
                            console.log(
                                "onChangedonChangedonChangedonChangedonChangedonChangedonChangedonChangedonChangedonChangedonChangedonChangedonChangedonChanged"
                            );
                        },
                    },
                    {
                        label: "Real Estate Statement Reference",
                        type: FieldType.TextField,
                        readOnly: true,
                        id: "CRE_x0020_Statement_x0020_Refere",
                    },
                ],
                [
                    {
                        label: "Business Unit",
                        placeHolder: "Please select a value...",
                        lookupList: ctx.businessUnitList,
                        type: FieldType.LookupDropdown,
                        id: "Business_x0020_Unit_x0020_2",
                        filterView: "view"
                    },
                    {
                        label: "Real Estate Statement Version",
                        type: FieldType.TextField,
                        readOnly: true,
                        id: "CRE_x0020_Statement_x0020_Versio",
                    },
                ],
                [
                    {
                        label: "Country",
                        placeHolder: "Please select a value...",
                        lookupList: ctx.countryList,
                        type: FieldType.LookupDropdown,
                        id: "Country",
                    },
                    {
                        label: "BCA Project Volume (k€)",
                        type: FieldType.TextField,
                        id: "BU_x0020_Project_x0020_Volume",
                    },
                ],
                [
                    {
                        label: "Real Estate Project Volume (k€)",
                        type: FieldType.TextField,
                        id: "CRE_x0020_Project_x0020_Volume",
                    },
                    {
                        label: "myBCA Project ID",
                        type: FieldType.TextField,
                        id: "BU_x0020_BCA_x0020_Reference",
                    },
                ],
                [
                    {
                        label: "CRE Approval Level Required",
                        readOnly: true,
                        type: FieldType.TextField,
                        id: "Approval_x0020_Required",
                    },
                    {
                        label: "myBCA Version",
                        type: FieldType.TextField,
                        id: "BU_x0020_BCA_x0020_Version",
                    },
                ],
                [
                    {
                        label: "Purchase Price (k€)",
                        type: FieldType.TextField,
                        id: "Purchase_x0020_Price",
                    },
                    null,
                ],
                [
                    {
                        label: "Sales Price (k€)",
                        type: FieldType.TextField,
                        id: "Sales_x0020_Price",
                    },
                    null,
                ],
                {
                    label: "Property Address",
                    type: FieldType.TextField,
                    id: "property_address",
                },
                [
                    {
                        label: "All Leases Back to Back",
                        type: FieldType.Checkbox,
                        id: "BackToBack",
                    },
                    null,
                ],
            ],
        },
        {
            section: "Approval Type & Status",
            sectionFields: [
                [
                    {
                        label: "Approval Status",
                        type: FieldType.TextField,
                        readOnly: true,
                        id: "ApprovalStatus",
                    },
                    {
                        label: "CRE Recommended Approval Type",
                        type: FieldType.Dropdown,
                        id: "Approval_x0020_Type",
                    },
                ],
                {
                    label: "Statement Remarks (Conditions of Approval)",
                    type: FieldType.Note,
                    id: "Statement_x0020_Remarks",
                },
            ],
        },
        {
            section: "Statement Author(s)",
            sectionFields: [
                {
                    label: "Main Author",
                    type: FieldType.PeoplePicker,
                    id: "Statement_x0020_Author",
                    readOnly: true,
                },
                {
                    label: "Additional Authors",
                    type: FieldType.PeoplePicker,
                    id: "Authors",
                },
            ],
        },
        {
            section: "Statement Checkers & Approvers",
            sectionFields: [
                {
                    label: "Country Checker (optional)",
                    type: FieldType.PeoplePicker,
                    id: "Country_x0020_Checker",
                },
                {
                    label: "Country Approver",
                    type: FieldType.PeoplePicker,
                    id: "Country_x0020_Approver",
                },
                {
                    label: "Regional Checker (optional)",
                    type: FieldType.PeoplePicker,
                    id: "Regional_x0020_Checker",
                },
                {
                    label: "Regional Approver",
                    type: FieldType.PeoplePicker,
                    id: "Regional_x0020_Approver",
                },
                {
                    label: "Global Checker",
                    type: FieldType.PeoplePicker,
                    id: "Global_x0020_Checker",
                },
                {
                    label: "Compliance Manager",
                    type: FieldType.PeoplePicker,
                    id: "Global_x0020_Manager",
                },
                {
                    label: "Global Approver",
                    type: FieldType.PeoplePicker,
                    id: "Global_x0020_Approver",
                },
            ],
        },
    ];
};

export const getDefaultStoreData = () => {
    return {
        Approval_x0020_Required: { value: "" },
        Approval_x0020_Type: { value: "" },
        ApprovalStatus: { value: "" },
        Authors: { value: "" },
        BackToBack: { value: "" },
        Sales_x0020_Price: { value: "", hidden: true },
        BU_x0020_BCA_x0020_Reference: { value: "" },
        BU_x0020_BCA_x0020_Version: { value: "" },
        BU_x0020_Project_x0020_Volume: { value: "" },
        Business_x0020_Unit_x0020_2: { value: "" },
        Country: { value: "" },
        Country_x0020_Approver: { value: [] },
        Purchase_x0020_Price: { value: "", hidden: true },
        property_address: { value: "", hidden: true },
        Country_x0020_Checker: { value: [] },
        CRE_x0020_Project_x0020_Volume: { value: "" },
        CRE_x0020_Statement_x0020_Refere: { value: "" },
        CRE_x0020_Statement_x0020_Versio: { value: "" },
        Global_x0020_Approver: { value: [], hidden: true },
        Global_x0020_Checker: { value: [], hidden: true },
        Global_x0020_Manager: { value: [], hidden: true },
        projectType: { value: "" },
        Regional_x0020_Approver: { value: [], hidden: true },
        Regional_x0020_Checker: { value: [], hidden: true },
        Statement_x0020_Author: { value: [] },
        Statement_x0020_Remarks: { value: "" },
        Title: { value: "", required: true },
    } as TInputs;
};