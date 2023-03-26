import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function FileInput() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const groups = [];
      let currentGroup = [];

      rows.forEach((row) => {
        if (row.some((cell) => typeof cell === 'string' && cell.includes('Indicar com "X"'))) {
          // start a new group if we encounter the "Vinicius" row
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
            currentGroup = [];
          }
        } else if (row.length === 0) {
          // end the current group if we encounter an empty row
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
            currentGroup = [];
          }
        } else {
          // add the row to the current group
          currentGroup.push(row);
        }
      });

      // add the final group if it's not empty
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      const newGroups = groups[2];
      console.log(newGroups);

    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default FileInput;
