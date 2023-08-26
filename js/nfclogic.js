document.addEventListener('DOMContentLoaded', () => {
    const nfcButton = document.getElementById('nfc-button');

    nfcButton.addEventListener('click', async () => {
      try {
        const nfcPermission = await navigator.permissions.query({ name: 'nfc' });

        if (nfcPermission.state === 'granted') {
          readNFCData();
        } else if (nfcPermission.state === 'prompt') {
          const result = await navigator.permissions.request({ name: 'nfc' });

          if (result.state === 'granted') {
            readNFCData();
          } else {
            console.log('NFC permission denied.');
          }
        } else {
          console.log('NFC permission denied.');
        }
      } catch (error) {
        console.error('Error requesting NFC permission:', error);
      }
    });

    async function readNFCData() {
      try {
        const nfc = new NDEFReader();
        await nfc.scan();

        nfc.addEventListener('reading', event => {
          const { records } = event;
          for (const record of records) {
            console.log('NFC Record:', record);
            // Handle the NFC record data as needed.
          }
        });

        console.log('Scanning for NFC tags...');
      } catch (error) {
        console.error('Error scanning NFC:', error);
      }
    }
  });