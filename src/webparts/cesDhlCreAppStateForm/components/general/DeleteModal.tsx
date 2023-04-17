import * as React from "react";
import { Modal, Stack, Label, DefaultButton } from "@fluentui/react";
import { FormSection } from "../statementSetup/StatementSetup";

export interface IModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    onDelete: () => void;
}

export const DeleteModal: React.FC<IModalProps> = (props: IModalProps) => {
    const {isOpen, onDismiss, onDelete} = props;

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onDismiss}
            isBlocking={false}
            containerClassName="modal-container"
        >
            <Stack style={{width: 400, height: 150}}>
                <Stack>
                    <FormSection text={"Delete"}/>
                </Stack>
                <Stack style={{alignItems: "center", paddingTop: 25}}>
                    <Label>Are you sure you want to delete this item?</Label>
                </Stack>
                <Stack style={{display: "flex", flexDirection: "row", justifyContent: "space-around", paddingTop: 25}}>
                    <DefaultButton style={{width: "40%"}} text={'Delete'} onClick={onDelete}/>
                    <DefaultButton style={{width: "40%"}} text={'Cancel'} onClick={onDismiss}/>
                </Stack>
            </Stack>
        </Modal>
    );
};