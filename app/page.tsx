"use client"
import React, { useState } from 'react';

export default function Home() {
  const [nfcPermission, setNfcPermission] = useState<string>('prompt');
  const [nfcRecords, setNfcRecords] = useState<any[]>([]);

  const handleNFCButtonClick = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'nfc' as PermissionName });
      setNfcPermission(permission.state);

      if (permission.state === 'granted') {
        readNFCData();
      }
    } catch (error) {
      console.error('Error requesting NFC permission:', error);
    }
  };

  const readNFCData = async () => {
    try {
      const nfc = new NDEFReader();
      await nfc.scan();

      nfc.addEventListener('reading', (event: any) => {
        const { records } = event;
        setNfcRecords(records);
      });

      console.log('Scanning for NFC tags...');
    } catch (error) {
      console.error('Error scanning NFC:', error);
    }
  };
  return (
    <div>
      <h1>NFC Reader App</h1>
      <p>NFC Permission: {nfcPermission}</p>
      <button onClick={handleNFCButtonClick}>Scan NFC</button>
      <div>
        <h2>NFC Records:</h2>
        <ul>
          {nfcRecords.map((record, index) => (
            <li key={index}>Record: {JSON.stringify(record)}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
