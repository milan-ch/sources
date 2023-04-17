import * as React from "react";
import { mergeStyles, Stack } from "@fluentui/react";
import { FormSection } from "../statementSetup/StatementSetup";
import { FileDropZone } from "../general/FileDropZone";
import { MultilineVerticalTextField } from "../general/MultilineVerticalTextField";

export const AttachmentsCreAppStateForm = (): JSX.Element => {

    const stackPaddingTop10 = mergeStyles({
        paddingTop: 10
    });
    const stackPaddingTop20 = mergeStyles({
        paddingTop: 20
    });

    return (
        <>
            <Stack>
                <Stack className={stackPaddingTop10}>
                    <FormSection text={"Attachments"}/>
                    <Stack className={stackPaddingTop10}>
                        <FileDropZone/>
                    </Stack>
                </Stack>
                <Stack className={stackPaddingTop20}>
                    <FormSection text={"Additional Information"}/>
                    <Stack className={stackPaddingTop10}>
                        <MultilineVerticalTextField rows={10}/>
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
};
