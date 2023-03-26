import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";

function App() {
  const [rows, setRows] = useState([]);

  const handleFileUpload = useMemo(() => (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const [sheetName] = workbook.SheetNames;
        const worksheet = workbook.Sheets?.[sheetName];
        const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const filteredRows = allRows.filter((row) =>
          row.includes("Indicar com X")
        );
        const [firstRow] = filteredRows;
        const startIndex = firstRow
          ? allRows.indexOf(firstRow) + 1
          : 0;
        const newRows = allRows.slice(startIndex);
        const contents = [...newRows].filter((row) => row[0]);

        // Transform each item inside joinedRows to the desired format
        const joinedRows = [];
        let tempRow = [];
        for (let row of contents) {
          if (row[0] && row[0][0] === ".") {
            if (tempRow.length > 0) {
              const transformedItems = tempRow.map((item) => ({
                id: item[2],
                description: item[3],
                quantity: item[5],
              }));
              joinedRows.push(transformedItems);
              tempRow = [];
            }
          } else {
            tempRow.push(row);
          }
        }
        if (tempRow.length > 0) {
          const transformedItems = tempRow.map((item) => ({
            id: item[2],
            description: item[3],
            quantity: item[5],
          }));
          joinedRows.push(transformedItems);
        }

        setRows(joinedRows);
        console.log(joinedRows);
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
