import React, { useState, useCallback } from "react";
import * as XLSX from "xlsx";

function App() {
  const [rows, setRows] = useState([]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const [sheetName] = workbook.SheetNames;
        const worksheet = workbook.Sheets?.[sheetName];
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const filteredRows = rawRows.filter((row) =>
          row.includes("Indicar com X")
        );
        const [firstRow] = filteredRows;
        const startIndex = firstRow ? rawRows.indexOf(firstRow) + 1 : 0;
        const filteredContents = rawRows.slice(startIndex).filter((row) => row[0]);

        // Transform each item inside transformedRows to the desired format
        const transformedRows = filteredContents.reduce((acc, row) => {
          if (row[0] && row[0][0] === ".") {
            if (acc.tempRow.length > 0) {
              const transformedItems = acc.tempRow.map((item) => ({
                id: item[2],
                description: item[3],
                quantity: item[5],
              }));
              acc.joinedRows.push(transformedItems);
              acc.tempRow = [];
            }
          } else {
            acc.tempRow.push(row);
          }
          return acc;
        }, { tempRow: [], joinedRows: [] });

        if (transformedRows.tempRow.length > 0) {
          const transformedItems = transformedRows.tempRow.map((item) => ({
            id: item[2],
            description: item[3],
            quantity: item[5],
          }));
          transformedRows.joinedRows.push(transformedItems);
        }

        setRows(transformedRows.joinedRows);
      } catch (error) {
        console.error(error);
        setRows([]);
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <ul>
        {rows.map((group, groupIndex) => (
          <li key={groupIndex}>
            {group.map((item, itemIndex) => (
              <span key={itemIndex}>
                {`ID: ${item.id}, Description: ${item.description}, Quantity: ${item.quantity}`}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
