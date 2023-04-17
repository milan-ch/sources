import { Stack, mergeStyles, DefaultButton } from "@fluentui/react";
import * as React from "react";
import { MultilineVerticalTextField } from "../general/MultilineVerticalTextField";
import { CustomModal } from "../general/CustomModal";
import { useState } from "react";
import { WEBPART_CTX } from "../../CesDhlCreAppStateFormWebPart";
import { FormSection, MOBILE_WIDTH } from "../statementSetup/StatementSetup";
import useWindowDimensions from "../../hooks/useWindowDimensions";

export const ApprovalTasksForm = (): JSX.Element => {

    const ctx = React.useContext(WEBPART_CTX);
    const [showModalDialog, setShowModalDialog] = useState(false);
    const [showRejectModalDialog, setShowRejectModalDialog] = useState(false);
    const { width: windowWidth } = useWindowDimensions();
    const isMobile = windowWidth <= MOBILE_WIDTH;

    const [comment, setComment] = useState("");

    const stackPaddingTop10 = mergeStyles({
        paddingTop: 10
    });

    const onModalDismiss = async () => {
        setShowRejectModalDialog(false);
    }

    const onModalDismissWithExit = async () => {
        setShowModalDialog(false);

        window.location.href = ctx.urlRedirectAfterSave;
    }    

    const processAnswer = async (outcome: string) => {

        if (outcome === 'Rejected' && comment?.length === 0)
        {
            setShowRejectModalDialog(true);
            return;
        }
        
        const data = {
            Comment: comment,
            Outcome: outcome,
            Status: 'Completed'
        };

        const tasksList = await ctx.sp.web.lists.getByTitle("Tasks");
        const result = await tasksList.items.getById(ctx.approvalTaskId);
        await result.update(data);

        setShowModalDialog(true);
    };

    return (
        <>
            <Stack>
            <CustomModal
                    isOpen={showRejectModalDialog}
                    onDismiss={onModalDismiss}
                    message={"Comment is required for reject"}
                />
                <CustomModal
                    isOpen={showModalDialog}
                    onDismiss={onModalDismissWithExit}
                    message={"Your answer has been successfully saved"}
                />
                <Stack className={stackPaddingTop10}>
                    <FormSection text={"Approval Comment"} />
                    <MultilineVerticalTextField onBlur={(event) => setComment(event.target.textContent)} rows={5} />
                </Stack>
                <Stack style={{ gap: 8, padding: 10 }}>
                    <Stack style={{ flexDirection: isMobile ? 'column' : 'row', gap: 8, justifyContent: 'space-between' }}>
                        <DefaultButton text='Approve' onClick={() => processAnswer('Approved')} style={{ width: 100 }} />
                        <DefaultButton text='Reject' onClick={() => processAnswer('Rejected')} style={{ width: 100 }} />
                        <DefaultButton text='Conditionally Approve' onClick={() => processAnswer('Conditionally Approved')} style={{ width: 200 }} />
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
}