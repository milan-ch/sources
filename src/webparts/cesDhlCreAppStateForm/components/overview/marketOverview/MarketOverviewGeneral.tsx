import * as React from 'react';
import { useState } from 'react';
import { CommandBarButton, IconButton, IIconProps, Label, Separator, Stack, TextField } from '@fluentui/react';
import * as moment from 'moment';
import styles from '../Overview.module.scss';
import { DeleteModal } from '../../general/DeleteModal';
import { MultilineVerticalTextField } from '../../general/MultilineVerticalTextField';
import { CustomDatePickerField } from '../../general/CustomDatePickerField';
import {IMarketOverviewItem} from "../OverviewTypes";
import { AddLeaseIcon, DeleteIcon } from "../../../helpers/CommonStyles";

export const MarketOverviewGeneral = (props: {marketOverItems : React.Dispatch<React.SetStateAction<IMarketOverviewItem[]>> }): JSX.Element => {
const [formFields, setFormFields] = useState<IMarketOverviewItem[]>(
    Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        marketOverviewAddress: '',
        marketOverviewLeaseStart: null,
        marketOverviewLeaseTerm: '',
        marketOverviewSpaceOffice: '',
        marketOverviewSpaceWarehouse: '',
        marketOverviewSpaceTotal: '',
        marketOverviewRent: '',
        marketOverviewIncentive: '',
        marketOverviewComment: ''
        }))
    );

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number>(0);

    const handleAddField = (): void => {
        setFormFields([...formFields, {
            id: Date.now(),
            marketOverviewAddress: '',
            marketOverviewLeaseStart: null,
            marketOverviewLeaseTerm: '',
            marketOverviewSpaceOffice: '',
            marketOverviewSpaceWarehouse: '',
            marketOverviewSpaceTotal: '',
            marketOverviewRent: '',
            marketOverviewIncentive: '',
            marketOverviewComment: ''
        }]);
    };

    const handleDeleteField = (id: number): void => {
        setSelectedItemId(id);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = (): void => {
        setFormFields(formFields.filter((field: any) => field.id !== selectedItemId));
        setDeleteModalOpen(false);
    };

    const handleInputChangeValue = (name: string, value: any): void => {
        const newFields = [...formFields];      
        const index = newFields.findIndex((field: IMarketOverviewItem) => 
            Object.prototype.hasOwnProperty.call(field, name));

        const updatedField = {
            ...newFields[index],
            [name]: value
        };

        console.log(updatedField);

        newFields[index] = updatedField;
        setFormFields(newFields);
    };

    const handleInputChange = (event: any): void => {
        const { name, value } = event.target;
        handleInputChangeValue(name, value);
    };

    const renderFields = (): JSX.Element[] => {
        return formFields.map(field => {
            return (
                <div key={field.id} style={{ marginTop: 8 }}>
                    <Stack>
                        <Separator />
                    </Stack>
                    <Stack style={{ alignItems: 'end', marginTop: -10 }}>
                        <IconButton
                            iconProps={DeleteIcon}
                            title="Delete"
                            ariaLabel="Delete"
                            onClick={() => handleDeleteField(field.id)}
                            className={styles.noHover}
                        />
                    </Stack>
                    <Stack className={styles.subHeaderMarketOverview}>
                        <TextField name="marketOverviewAddress" onChange={event => handleInputChange(event)} />
                        <CustomDatePickerField id="marketOverviewLeaseStart" val="" 
                            onSelectDate={date => handleInputChangeValue("marketOverviewLeaseStart", moment(date).format("MM/DD/YYYY"))}
                        />
                        <TextField name="marketOverviewLeaseTerm" onChange={event => handleInputChange(event)} />
                        <TextField name="marketOverviewSpaceOffice" onChange={event => handleInputChange(event)} />
                        <TextField name="marketOverviewSpaceWarehouse" onChange={event => handleInputChange(event)} />
                        <TextField name="marketOverviewSpaceTotal" onChange={event => handleInputChange(event)} />
                        <TextField name="marketOverviewRent" onChange={event => handleInputChange(event)} />
                        <TextField name="marketOverviewIncentive" onChange={event => handleInputChange(event)} />
                    </Stack>
                    <Stack
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Label
                            style={{
                                fontWeight: 400
                            }}
                        >
                            Comment
                        </Label>
                    </Stack>
                    <MultilineVerticalTextField name="marketOverviewComment" onChange={event => handleInputChange(event)} rows={2} />
                </div>
            );
        });
    };

    return (
        <Stack>
            {renderFields()}
            <CommandBarButton
                iconProps={AddLeaseIcon}
                text="Add another lease"
                onClick={handleAddField}
                style={{ marginTop: 8, width: 160 }}
                className={styles.noHover}
            />
            <DeleteModal
                isOpen={deleteModalOpen}
                onDismiss={() => setDeleteModalOpen(false)}
                onDelete={() => handleDeleteConfirm()}
            />
        </Stack>
    );
};