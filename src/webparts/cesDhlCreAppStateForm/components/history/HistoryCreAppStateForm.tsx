import * as React from "react";
import { useEffect, useState } from "react";
import { DefaultButton, DetailsList, DetailsListLayoutMode, Label, mergeStyles, Stack } from "@fluentui/react";
import { SelectionMode } from "office-ui-fabric-react";
import { FormSection } from "../statementSetup/StatementSetup";
import { WEBPART_CTX } from "../../CesDhlCreAppStateFormWebPart";
import * as moment from "moment";
import { CustomModal } from "../general/CustomModal";

export const HistoryCreAppStateForm = (): JSX.Element => {

    const [items, setItems] = React.useState<any[]>([]);
    const ctx = React.useContext(WEBPART_CTX);
    const [showModalDialog, setShowModalDialog] = useState(false);

    const onModalDismiss = async () => {
        setShowModalDialog(false);
    }

    const stackPaddingTop10 = mergeStyles({
        paddingTop: 10
    });

    const stackPaddingTop20 = mergeStyles({
        paddingTop: 20
    });

    const buttonStack = mergeStyles({
        paddingTop: 10,
        alignItems: "center"
    });

    const sendToApproval = async () => {

        const data = {
            Title: "Initialize",
            StatementLookupId: ctx.statementId,
            State: "Initialisation"
        };

        const wfStateMachineApprovalList = await ctx.sp.web.lists.getByTitle("WFStateMachineApproval");
        await wfStateMachineApprovalList.items.add(data);

        setShowModalDialog(true);
    };

    useEffect(() => {

        const loadData = async (): Promise<void> => {

            const result = await ctx.sp.web
                .lists
                .getByTitle("Tasks")
                .items
                .select("AssignedTo/Title, Role, Outcome, Modified, Comment")
                .filter(`StatementLookupId eq '${ctx.statementId}'`)
                .orderBy("Modified", true)
                .expand("AssignedTo")();

            result.map((item) => {
                items.push({ Assignee: item.AssignedTo.Title, Role: item.Role, Decision: item.Outcome, Date: moment(new Date(item.Modified)).format("MM/DD/yyyy HH:mm:ss"), Comments: item.Comment });
            });

            setItems(items);
        };

        if (ctx.statementId) {
            //eslint-disable-next-line	
            loadData();
        }
    }, []);

    return (
        <>
            <Stack>
                <CustomModal
                    isOpen={showModalDialog}
                    onDismiss={onModalDismiss}
                    message={"Form has been successfully send to approval"}
                />
                <Stack className={stackPaddingTop10}>
                    <FormSection text={"Document History"} />
                    <DetailsList
                        items={items}
                        columns={[
                            { key: 'Assignee', name: 'Assignee', fieldName: 'Assignee', minWidth: 100, maxWidth: 150 },
                            { key: 'Role', name: 'Role', fieldName: 'Role', minWidth: 100, maxWidth: 150 },
                            { key: 'Decision', name: 'Decision', fieldName: 'Decision', minWidth: 100, maxWidth: 150 },
                            { key: 'Date', name: 'Date', fieldName: 'Date', minWidth: 150, maxWidth: 150 },
                            { key: 'Comments', name: 'Comments', fieldName: 'Comments', minWidth: 100, maxWidth: 1000 },
                        ]}
                        setKey="set"
                        selectionMode={SelectionMode.none}
                        layoutMode={DetailsListLayoutMode.justified}
                        compact={true}
                        selectionPreservedOnEmptyClick={true}
                    />
                </Stack>
                <Stack className={stackPaddingTop20}>
                    <Label style={{ textAlign: "center" }}>Once this form is complete please click here to send for
                        approval. </Label>
                    <Label style={{ textAlign: "center", fontStyle: "italic", fontWeight: 400 }}>(If the &apos;Send for
                        Approval&apos; button is not enabled you will need to save the form first.)</Label>
                    <Stack className={buttonStack}>
                        <DefaultButton style={{ width: "50%", height: 50 }} disabled={ctx.statementId === undefined} text={"Send for Approval"} onClick={() => sendToApproval()} />
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
};
