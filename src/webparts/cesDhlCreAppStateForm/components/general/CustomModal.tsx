import * as React from "react";
import { Modal, Stack, Label, DefaultButton } from "@fluentui/react";
import { FormSection } from "../statementSetup/StatementSetup";

export interface IModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    message: string
}

export const CustomModal: React.FC<IModalProps> = (props: IModalProps) => {
    const {isOpen, onDismiss, message} = props;

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onDismiss}
            isBlocking={false}
            containerClassName="modal-container"
        >
            <Stack style={{width: 400, height: 150}}>
                <Stack>
                    <FormSection text={"Info"}/>
                </Stack>
                <Stack style={{alignItems: "center", paddingTop: 25}}>
                    <Label>{message}</Label>
                </Stack>
                <Stack style={{display: "flex", flexDirection: "row", justifyContent: "space-around", paddingTop: 25}}>                    
                    <DefaultButton style={{width: "40%"}} text={'OK'} onClick={onDismiss}/>
                </Stack>
            </Stack>
        </Modal>
    );
};