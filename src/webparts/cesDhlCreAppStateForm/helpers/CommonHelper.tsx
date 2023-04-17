import * as React from "react";
import { StatementSetup } from "../components/statementSetup/StatementSetup";
import { OverviewCreAppStateForm } from "../components/overview/OverviewCreAppStateForm";
import { BaseDataCreAppStateForm } from "../components/baseData/BaseDataCreAppStateForm";
import { DetailAndRiskCreAppStateForm } from "../components/detailAndRisks/detailAndRiskByProjectType/DetailAndRiskCreAppStateForm";
import { AttachmentsCreAppStateForm } from "../components/attachments/AttachmentsCreAppStateForm";
import { HistoryCreAppStateForm } from "../components/history/HistoryCreAppStateForm";
import { HeritableSalesForm } from "../components/heritableSales/HeritableSalesForm";
import { parseStringPromise as parse, Builder } from 'xml2js';
import {ITabs} from "./CommonTypes";

export const getTabs = (projectTypeValue: string): ITabs[] => {
  const tabs = [
    { headerText: "Statement setup", component: <StatementSetup /> },
    { headerText: "Overview", component: <OverviewCreAppStateForm /> },
    { headerText: "Base Data", component: <BaseDataCreAppStateForm /> },
    { headerText: "Details & Risks", component: <DetailAndRiskCreAppStateForm /> },
    { headerText: "Attachments", component: <AttachmentsCreAppStateForm /> },
    { headerText: "History", component: <HistoryCreAppStateForm /> },
  ];

  switch (projectTypeValue) {
    case "Heritable Land Sale":
      tabs.splice(4, 0, {
        headerText: "Heritable Sales",
        component: <HeritableSalesForm />
      });
      break;
  }

  return tabs;
};

/** formating function DatePicker */
export const formatDate = (date?: Date): string => {
  if (!date) return "";
  const month = date.getMonth() + 1; // + 1 because 0 indicates the first Month of the Year.
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatNumber = (num: string | number, digits: number = 2) => {
  if (num === null || num === undefined || num === "") return "";
  if (typeof num === "number") num = num.toString();
  if (num === "\u221E" || num === "Infinity") return "\u221E";
  if (isNaN(parseFloat(num))) return "";

  return Number(num).toLocaleString('en-US', { maximumFractionDigits: digits }).replace(",", "");
}

export const deserialize = async <T extends object>(xmlData: string): Promise<T> => {
  const parsedData = await parse(xmlData, { explicitArray: false, ignoreAttrs: true });
  return parsedData.RepeaterData.Items.Item as T;
}

export const deserializeArray = async <T extends object>(xmlData: string): Promise<T> => {
  const parsedData = await parse(xmlData, { explicitArray: false, ignoreAttrs: true });
  const resultData = parsedData.RepeaterData.Items.Item as T;
  return Array.isArray(resultData) ? resultData as T : [resultData] as T;
}

export const serialize = async (Item: any): Promise<string> => {
  const builder = new Builder({ headless: true });
  return builder.buildObject({ RepeaterData: { Items: { Item } } });
}