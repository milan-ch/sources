import * as React from 'react';
import { Checkbox, CommandBarButton, Dropdown, IDropdownOption, IIconProps, Label, Separator, Stack, TextField} from '@fluentui/react';
import { FileDropZone } from '../../../general/FileDropZone';
import { FormSection } from '../../../statementSetup/StatementSetup';
import { TwoItemsStack } from '../../../general/TwoItemsStack';
import { RealEstateRelatedRiskComponent } from './RealEstateRelatedRiskComponent';
import styles from '../../../baseData/baseDataByProjectType/baseDataByLease/BaseDataFormByLease.module.scss';
import { DeleteModal } from '../../../general/DeleteModal';
import { useEffect, useState } from 'react';
import { DetailsAndRisksSite } from "../../DetailAndRiskHelper";
import { LookupDropdown } from '../../../../controls/LookupDropdown';
import { WEBPART_CTX } from '../../../../CesDhlCreAppStateFormWebPart';
import { CNBClassificationOptions } from '../../../general/DropdownListOptions';
import { TextFieldNumber } from '../../../general/TextFieldNumber';
import {AddLeaseIcon, DeleteIcon} from "../../../../helpers/CommonStyles";

const SecurityDepositOptions: IDropdownOption[] = [
    { key: 'None', text: 'None' },
    { key: 'LetterOfAwareness', text: 'Letter of awareness' },
    { key: 'LetterOfComfort', text: 'Letter of comfort' },
    { key: 'CorporateGuarantee', text: 'Corporate guarantee' },
    { key: 'BankGuarantee', text: 'Bank guarantee' },
    { key: 'CashDeposit', text: 'Cash deposit' },
    { key: 'Surety', text: 'Surety' },
    { key: 'Other', text: 'Other - Please specify below' }
];

const MaintenanceOptions: IDropdownOption[] = [
    { key: 'NotApplicable', text: 'Not Applicable' },
    { key: 'DoubleNet', text: 'Double Net' },
    { key: 'TripleNet', text: 'Triple Net' },
    { key: 'IncludedInServiceCharge', text: 'Included in service charge' }
];

export const DetailAndRiskFormByLease = (): JSX.Element => {
    const [siteItem, setSiteItem] = useState([]);
    const [deleteSiteItemIndex, setDeleteSiteItemIndex] = useState<number>(-1);

    const onDismissSiteItem = (): void => {
        setDeleteSiteItemIndex(-1);
    };

    const onDeleteSiteItem = (index: number): void => {
        // Add the index parameter
        const newFields = [...siteItem];
        newFields.splice(index, 1); // Use the index parameter here
        setSiteItem(newFields);
        setDeleteSiteItemIndex(-1);
    };

    const SiteItemDeleteField = (index: number): void => {
        setDeleteSiteItemIndex(index);
    };

    const SiteItemAddField = (): void => {
        setSiteItem([...siteItem, { ...DetailsAndRisksSite }]);
    };

    useEffect(() => {
        SiteItemAddField();
    }, []);

    const ctx = React.useContext(WEBPART_CTX);

    return (
        <>
            <Stack>
                {siteItem.map((risk, index) => (                    
                    <Stack key={risk.id}>                        
                        <Stack style={{ paddingTop: index > 0 ? 20 : 0 }}>
                            {index > 0 && <Separator />}
                            <Stack style={{ alignItems: 'end', paddingBottom: 4 }}>
                                <DeleteModal
                                    isOpen={deleteSiteItemIndex === index}
                                    onDismiss={onDismissSiteItem}
                                    onDelete={() => onDeleteSiteItem(index)}
                                />
                                <CommandBarButton
                                    iconProps={DeleteIcon}
                                    onClick={() => SiteItemDeleteField(index)}
                                    className={styles.noHover}
                                    style={{ paddingTop: 6 }}
                                />
                            </Stack>
                            <FormSection text={`Site ${index + 1}`} />
                            <TwoItemsStack
                                leftItemLabel={<Label>Address</Label>}
                                leftItem={
                                    <TextField
                                        multiline style={{ resize: 'vertical' }}
                                        value={risk.address}
                                        onChange={(e, newValue) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].address = newValue || '';
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                                rightItem={
                                    <LookupDropdown
                                        lookupListId={ctx.landlordGroupList}
                                        label="Landlord Group"
                                        selectedKey={risk.landlordGroup}
                                        onChange={(e, option) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].landlordGroup = option?.key?.toString() || '';
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                            />
                            <TwoItemsStack
                                leftItem={
                                    <TextField
                                        label="Landlord (Other)"
                                        value={risk.landlordOther}
                                        onChange={(e, newValue) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].landlordOther = newValue || '';
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                                rightItem={
                                    <LookupDropdown
                                        lookupListId={ctx.currencyList}
                                        label="Contract Currency"
                                        placeholder="Please select currency"
                                        selectedKey={risk.contractCurrency}
                                        onChange={(e, option) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].contractCurrency = option?.key?.toString() || '';
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                            />
                            <TwoItemsStack
                                leftItem={
                                    <TextField
                                        label="Indexation"
                                        value={risk.indexation}
                                        onChange={(e, newValue) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].indexation = newValue || '';
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                                rightItem={
                                    <TextField
                                        label="Break Option"
                                        value={risk.breakOption}
                                        onChange={(e, newValue) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].breakOption = newValue || '';
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                            />
                            <TwoItemsStack
                                leftItem={
                                    <TextField
                                        label="Extension Option"
                                        value={risk.extensionOption}
                                        onChange={(e, newValue) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].extensionOption = newValue || '';
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                                rightItem={
                                    <Dropdown
                                        placeholder="Please select a value..."
                                        label="Maintenance"
                                        options={MaintenanceOptions}
                                        selectedKey={risk.maintenance}
                                        onChange={(e, option) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].maintenance = option?.key?.toString() || '';
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                            />
                            <TwoItemsStack
                                leftItem={
                                    <TextField
                                        label="Incentives"
                                        value={risk.incentives}
                                        onChange={(e, newValue) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].incentives = newValue || '';
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                                rightItem={
                                    <Dropdown
                                        placeholder="Please select a value..."
                                        label="Security Deposit"
                                        selectedKey={risk.SecurityDeposit}
                                        options={SecurityDepositOptions}
                                        onChange={(e, option) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].SecurityDeposit = option?.key?.toString() || '';
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                            />
                            <TwoItemsStack
                                leftItemLabel={
                                    <Stack>
                                        <Label>Denied Party Screening approved</Label>
                                    </Stack>
                                }
                                leftItem={
                                    <Stack style={{ paddingTop: 7 }}>
                                        <Checkbox
                                            label="If not ticked, state why in Other"
                                            checked={risk.deniedPartyScreening}
                                            onChange={(e, checked) => {
                                                const newRisks = [...siteItem];
                                                newRisks[index].deniedPartyScreening = checked || false;
                                                setSiteItem(newRisks);
                                            }}
                                        />
                                    </Stack>
                                }
                                rightItem={
                                    <TextField
                                        label="Security Deposit (Other)"
                                        value={risk.SecurityDepositOther}
                                        onChange={(e, newValue) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].SecurityDepositOther = newValue || '';
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                            />
                            <TwoItemsStack
                                leftItem={
                                    <Stack style={{ paddingTop: 18 }}>
                                        <FileDropZone />
                                    </Stack>
                                }
                                rightItem={
                                    <Checkbox
                                        label="View GoGreen Minimum Standards"
                                        checked={risk.gogreenMinStandards}
                                        onChange={(e, checked) => {
                                            const newRisks = [...siteItem];
                                            newRisks[index].gogreenMinStandards = checked || false;
                                            setSiteItem(newRisks);
                                        }}
                                    />
                                }
                                rightItemLabel={<Label>GoGreen Min Standards Applied</Label>}
                            />
                            <TextField
                                label="Other"
                                multiline style={{ resize: 'vertical' }}
                                value={risk.otherInfo}
                                onChange={(e, newValue) => {
                                    const newRisks = [...siteItem];
                                    newRisks[index].otherInfo = newValue || '';
                                    setSiteItem(newRisks);
                                }}
                            />
                        </Stack>
                        <TwoItemsStack
                            leftItem={
                                <Stack style={{ paddingTop: 20 }}>
                                    <FormSection text="Real Estate One Off costs" />
                                    <TwoItemsStack
                                        leftItem={
                                            <TextFieldNumber
                                                label="Make Good (k€)"                                                
                                                value={risk.makeGoodValue}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].makeGoodValue = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                        rightItem={
                                            <TextField
                                                label="Comment"
                                                value={risk.makeGoodComment}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].makeGoodComment = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                    />
                                    <TwoItemsStack
                                        leftItem={
                                            <TextFieldNumber
                                                label="Other (k€)"                                                
                                                value={risk.otherOneOffValue}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].otherOneOffValue = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                        rightItem={
                                            <TextField
                                                label="Comment"
                                                value={risk.otherOneOffComment}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].otherOneOffComment = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                    />
                                </Stack>
                            }
                            rightItem={
                                <Stack style={{ paddingTop: 20 }}>
                                    <FormSection text="Real Estate CapEx" />
                                    <TwoItemsStack
                                        leftItem={
                                            <TextFieldNumber
                                                label="Dilapidations (k€)"
                                                value={risk.dilapidationsValue}                                                
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].dilapidationsValue = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                        rightItem={
                                            <TextField
                                                label="Comment"
                                                value={risk.dilapidationsComment}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].dilapidationsComment = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                    />
                                    <TwoItemsStack
                                        leftItem={
                                            <TextFieldNumber
                                                label="LHI / Construction (k€)"                                                
                                                value={risk.LHIValue}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].LHIValue = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                        rightItem={
                                            <TextField
                                                label="Comment"
                                                value={risk.LHIComment}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].LHIComment = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                    />
                                    <TwoItemsStack
                                        leftItem={
                                            <TextFieldNumber
                                                label="Other (k€)"
                                                value={risk.otherCapexValue}                                                
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].otherCapexValue = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                        rightItem={
                                            <TextField
                                                label="Comment"
                                                value={risk.otherCapexComment}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].otherCapexComment = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                    />
                                </Stack>
                            }
                        />
                        <TwoItemsStack
                            leftItem={
                                <Stack style={{ paddingTop: 20 }}>
                                    <FormSection text="Real Estate Ongoing costs" />
                                    <TwoItemsStack
                                        leftItem={
                                            <TextFieldNumber
                                                label="Total rent (k€)"
                                                value={risk.totalRentValue}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].totalRentValue = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                        rightItem={
                                            <TextField
                                                label="Comment"
                                                value={risk.totalRentComments}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].totalRentComments = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                    />
                                    <TwoItemsStack
                                        leftItem={
                                            <TextFieldNumber
                                                label="Other (k€)"
                                                value={risk.otherOngoingValue}                                                
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].otherOngoingValue = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                        rightItem={
                                            <TextField
                                                label="Comment"
                                                value={risk.otherOngoingComments}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].otherOngoingComments = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                    />
                                </Stack>
                            }
                            rightItem={
                                <Stack style={{ paddingTop: 20 }}>
                                    <FormSection text="Real Estate Deprecation" />
                                    <TwoItemsStack
                                        leftItem={
                                            <TextFieldNumber
                                                label="per year (k€)"
                                                value={risk.depreciationPerYearValue}                                                
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].depreciationPerYearValue = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                        rightItem={
                                            <TextField
                                                label="Comment"
                                                value={risk.depreciationPerYearComment}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].depreciationPerYearComment = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                    />
                                    <TwoItemsStack
                                        leftItem={
                                            <TextFieldNumber
                                                label="per month (€/m²)"
                                                value={risk.depreciationPerMonth}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].depreciationPerMonth = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                        rightItem={
                                            <TextField
                                                label="Comment"
                                                value={risk.depreciationPerMonthComment}
                                                onChange={(e, newValue) => {
                                                    const newRisks = [...siteItem];
                                                    newRisks[index].depreciationPerMonthComment = newValue || '';
                                                    setSiteItem(newRisks);
                                                }}
                                            />
                                        }
                                    />
                                </Stack>
                            }
                        />
                    </Stack>
                ))}
            </Stack>
            <CommandBarButton
                iconProps={AddLeaseIcon}
                text="Add another site"
                onClick={SiteItemAddField}
                className={styles.noHover}
                style={{ marginTop: 8, width: 180 }}
            />
            <Stack style={{ paddingTop: 20 }}>
                <FormSection text="Real Estate Related Risk" />
                <RealEstateRelatedRiskComponent />
            </Stack>
            <Stack style={{ paddingTop: 20 }}>
                <FormSection text="Sustainability / Carbon Neutral Building Classification" />
                <Dropdown
                    placeholder="Please select a value..."
                    label="CNB Rating"
                    options={CNBClassificationOptions}
                />
            </Stack>
        </>
    );
};
