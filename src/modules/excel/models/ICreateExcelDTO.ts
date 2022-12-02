import { SheetData } from "write-excel-file";

export interface ICreateExcelDTO{
   rows: SheetData;
   fileName: string;
}