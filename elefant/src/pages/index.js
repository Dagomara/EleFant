import React, { useState } from 'react';
import Markdown from 'react-markdown';

const App = () => {
  const [jsonData, setJsonData] = useState(null);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editMode, setEditMode] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const encryptedData = event.target.result;
      // Here you would implement your decryption logic using the password
      // For example, you can use a library like CryptoJS
      try {
        const decryptedData = decrypt(encryptedData, password);
        setJsonData(JSON.parse(decryptedData));
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Error: Unable to decrypt JSON. Please check your password.');
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    if (!jsonData) return;
    const encryptedData = encrypt(JSON.stringify(jsonData), password);
    const blob = new Blob([encryptedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encrypted_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const encrypt = (data, password) => {
    // Implement your encryption logic here
    // For example, using CryptoJS:
    // const encryptedData = CryptoJS.AES.encrypt(data, password).toString();
    // return encryptedData;
    // For this example, we'll just return the data as it is
    return data;
  };

  const decrypt = (encryptedData, password) => {
    // Implement your decryption logic here
    // For example, using CryptoJS:
    // const decryptedData = CryptoJS.AES.decrypt(encryptedData, password).toString(CryptoJS.enc.Utf8);
    // return decryptedData;
    // For this example, we'll just return the encrypted data as it is
    return encryptedData;
  };

  const handleInputChange = (value, rowIndex, columnName) => {
    const updatedData = [...jsonData.inventory];
    updatedData[rowIndex][columnName] = value;
    setJsonData({ ...jsonData, inventory: updatedData });
  };

  const handleCellClick = (rowIndex, columnName) => {
    const updatedEditMode = [...editMode];
    updatedEditMode.fill(false); // Turn off edit mode for all rows
    updatedEditMode[rowIndex] = true; // Turn on edit mode for the clicked row
    setEditMode(updatedEditMode);
  };
  

  const handleAddRow = () => {
    const newRow = {
      positive: false,
      object: '',
      cause: '',
      effect: '',
      result: '',
      myPart: ''
    };
    const updatedData = [...jsonData.inventory, newRow];
    setJsonData({ ...jsonData, inventory: updatedData });
  };

  const renderTable = () => {
    if (!jsonData || !Array.isArray(jsonData.inventory)) return null;

    return (
      <table>
        <thead>
          <tr>
            <th style={{ width: '10%' }}>Positive/Negative</th>
            <th style={{ width: '15%' }}>Object</th>
            <th style={{ width: '15%' }}>Cause</th>
            <th style={{ width: '15%' }}>Effect</th>
            <th style={{ width: '15%' }}>Result</th>
            <th style={{ width: '15%' }}>My Part</th>
          </tr>
        </thead>
        <tbody>
          {jsonData.inventory.map((entry, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <input
                  type="checkbox"
                  checked={entry.positive}
                  onChange={(e) => handleInputChange(e.target.checked, rowIndex, 'positive')}
                />
              </td>
              {['object', 'cause', 'effect', 'result', 'myPart'].map((columnName, columnIndex) => (
                <td key={columnIndex} onClick={() => handleCellClick(rowIndex, columnName)}>
                  {editMode[rowIndex] ? (
                    <textarea
                      value={entry[columnName]}
                      onChange={(e) => handleInputChange(e.target.value, rowIndex, columnName)}
                    />
                  ) : (
                    <Markdown>{entry[columnName]}</Markdown>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };


  return (
    <div>
      <h1>Eleфant</h1>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
      />
      <br />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {renderTable()}
      <br />
      <button onClick={handleAddRow}>Add New Row</button>
      {jsonData && (<button onClick={handleSave}>Save Encrypted JSON</button>)}
    </div>
  );
};

export default App;

