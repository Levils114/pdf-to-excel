import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { SheetData } from "write-excel-file";
import { regex } from "../../../utils/regex";
import { createExcel } from "../../excel/services/excelServices";
import { IGenerateRowsDTO } from "../models/IGenerateRowsDTO";

async function generateRows({ pdfFiles }: IGenerateRowsDTO): Promise<SheetData>{
   try {
      let rows = [];

      for(const file of pdfFiles){
         const pdfFilePath = path.resolve(__dirname, `../../../../assets/pdfFiles/${file}`);

         let readFileSync = fs.readFileSync(pdfFilePath);

         let { text } = await pdfParse(readFileSync);
         const mainText = text.split("SENTENÇAS PROCEDENTES")[1].split("SENTENÇAS IMPROCEDENTES")[0];

         const cpfArray = [...new Set((mainText.match(regex.CPFRegEX) || [""]))].map(cpf => cpf.replace("CPF: ", "").replace("PJEC ", ""));
         const processNumbersArray = [...new Set((mainText.match(regex.processNumberRegex) || [""]))];
         const namesArray = [...new Set((mainText.match(regex.nameRegex) || [""]))].filter(name => 
            !name.match(regex.CPFRegEX) && 
            !name.match(regex.dateRegex) && 
            !name.match(regex.articleRegex) &&
            !name.match(regex.dipRegex) &&
            !name.match(regex.dibRegex) &&
            !name.match(regex.cpfRemoveRegex) &&
            !name.match(regex.dibRegex) &&
            !name.match(regex.nbRegex) &&
            !name.match(regex.reRegex) &&
            !name.match(regex.ecRegex) &&
            !name.match(regex.derRegex) &&
            !name.match(regex.doRegex) &&
            !name.match(regex.dcbRegex) &&
            !name.match(regex.doAteMesRegex) &&
            !name.match(regex.idosoRegex) &&
            !name.match(regex.loasRegex) &&
            !name.match(regex.seisRegex) &&
            !name.match(regex.cincoRegex) &&
            !name.match(regex.videRegex) &&
            !name.match(regex.urbanoRegex) &&
            !name.match(regex.laudosRegex) &&
            !name.match(regex.sumulaRegex)
         ).map(name => name.replace("(", "").replace(" \n", "").replace(")", ""));
         
         for(let i = 0 ; i < cpfArray.length ; i++){
            rows.push([
               {
                  type: String,
                  value: namesArray[i],
               },
               {
                  type: String,
                  value: cpfArray[i],
               },
               {
                  type: String,
                  value: processNumbersArray[i],
               },
               {
                  type: String,
                  value: undefined,
               },
               {
                  type: String,
                  value: file,
               },
            ]);
         }
      }

      return rows;
   } catch (error) {
      throw error;
   }
}

export async function generatePdf(){
   try{
      const pdfDir = fs.readdirSync(path.resolve(__dirname, '../../../../assets/pdfFiles'));

      const pdfFiles = pdfDir.filter(file => file.includes(".pdf"));

      const rows = await generateRows({ pdfFiles });

      await createExcel({ rows, fileName: "allInOne.xlsx" });
   } catch(err){
      console.error(err);
   }
}

