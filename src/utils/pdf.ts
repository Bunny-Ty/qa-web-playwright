import { readFileSync } from 'node:fs';
import { PDFParse } from 'pdf-parse';

export async function readPdfText(filePath: string): Promise <string> {
    const parser = new PDFParse({ data: readFileSync(filePath) });
    try {
        const result = await parser.getText();
        return result.text.replace(/\s+/g, ' ').trim();
    } finally {
        await parser.destroy();
    }
}