import { Row } from "write-excel-file";
import { ICreateExcelDTO } from "../models/ICreateExcelDTO";

import path from "path";
import writeXlsxFile from "write-excel-file/node";

export async function createExcel({ rows, fileName }: ICreateExcelDTO){
   const HEADER_ROW: Row = [
      {
        value: 'Nome',
        fontWeight: 'bold' as "bold"
      },
      {
        value: 'CPF',
        fontWeight: 'bold' as "bold"
      },
      {
        value: 'Número do processo',
        fontWeight: 'bold' as "bold"
      },
      {
        value: 'RPV',
        fontWeight: 'bold' as "bold"
      },
      {
        value: 'Arquivo',
        fontWeight: 'bold' as "bold"
      }
    ]
    
    const data = [
      HEADER_ROW,
    ];

    rows.forEach(row => data.push(row));

    const filePath = path.resolve(__dirname, `../../../../assets/excelFiles/${fileName}`);

    try{
      await writeXlsxFile(data, { filePath });
    } catch(err){
       console.error(err);
    }
}