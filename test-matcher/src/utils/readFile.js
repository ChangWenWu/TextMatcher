import XLSX from"xlsx";
export const readCSV = (filePath) => {
    const csvFile = filePath;
    const workbook = XLSX.readFile(csvFile, {
        codepage: 65001
    });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    return XLSX.utils.sheet_to_json(worksheet, {
        header: 1
    })
}

