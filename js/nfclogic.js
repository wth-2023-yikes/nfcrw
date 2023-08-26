document.addEventListener('DOMContentLoaded', () => {
  // const nfcButton = document.getElementById('nfc-button');
  // const scanButton = document.getElementById('nfc-button-scan');
  // const displayOutput = document.getElementById('display-output');
  // const displayError = document.getElementById('display-error');
  // const displayError2 = document.getElementById('display-error2');
  // const displayOutputScan = document.getElementById('display-output-scan');

  const nfcReader = new NDEFReader();

  nfcReader.addEventListener('reading', async event => {
    const {message} = event;
    const textDecoder = new TextDecoder('utf-8');
    for (const record of message.records) {
      const plainText = textDecoder.decode(record.data);
      // displayOutputScan.innerHTML += (plainText);
      // query the db api with the id for full info
      // return a json object with the info
      // {
      //  id: 1,
      //  name: "name",
      //  price: 1.99,
      // }
      try {
        const response = await axios.get(`https://dashboard-tau-ivory.vercel.app/api/rfid/${plainText}/product`, {
          responseType: 'arraybuffer'
        });
      
        const name = response.data.name;
        const price = response.data.price;
        const quantity = response.data.quantity;

        const textInput = `${name}. Cost: ${price}. ${quantity} available.`;
        
        try {
          // Query backend endpoint
          const response = await axios.post('/generate-audio', {
              textInput: textInput
          }, {
              responseType: 'arraybuffer'
          });

          const audioData = response.data;
          const blob = new Blob([audioData], { type: 'audio/mpeg' });

          const audioElement = new Audio();
          audioElement.src = URL.createObjectURL(blob);

          // Play the audio
          audioElement.play();
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
      
    }
  });

  // scanButton.addEventListener('click', async () => {
  //   try {
  //     const nfcPermission = await navigator.permissions.query({ name: 'nfc' });

  //     if (nfcPermission.state === 'granted') {
  //       await startScan();
  //     } else if (nfcPermission.state === 'prompt') {
  //       const result = await navigator.permissions.request({ name: 'nfc' });

  //       if (result.state === 'granted') {
  //         await startScan();
  //       } else {
  //         console.log('NFC permission denied.');
  //       }
  //     } else {
  //       console.log('NFC permission denied.');
  //     }
  //   } catch (error) {
  //     console.error('Error requesting NFC permission:', error);
  //   }
  // });

  // async function startScan() {
  //   try {
  //     await nfcReader.scan();
  //     console.log('NFC permissions granted');
  //     // Now you can start reading NFC data
  //   } catch (error) {
  //     displayError2.innerHTML = error;
  //     console.error('Error scanning NFC:', error);
  //   }
  // }

  // async function fetchProducts() {
  //   try {
  //     // wait for cors error resolve from Benedict
  //     const response = await axios.get('https://dashboard-tau-ivory.vercel.app/api/products');
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //     displayError.innerHTML += ("\n" + error);
  //     throw error;
  //   }
  // }

  // fetchProducts().then((products) => {
  //   console.log(products);
  //   displayOutput.innerHTML = products;
  //   nfcButton.addEventListener('click', async () => {
  //     try {
  //       const nfcPermission = await navigator.permissions.query({ name: 'nfc' });

  //       if (nfcPermission.state === 'granted') {
  //         await writeNFCData();
  //       } else if (nfcPermission.state === 'prompt') {
  //         const result = await navigator.permissions.request({ name: 'nfc' });

  //         if (result.state === 'granted') {
  //           await writeNFCData();
  //         } else {
  //           console.log('NFC permission denied.');
  //         }
  //       } else {
  //         console.log('NFC permission denied.');
  //       }
  //     } catch (error) {
  //       console.error('Error requesting NFC permission:', error);
  //     }
  //   })
  // }

  // );

  // scanButton.addEventListener('click', async () => {
  //   try {
  //     const nfcPermission = await navigator.permissions.query({ name: 'nfc' });

  //     if (nfcPermission.state === 'granted') {
  //       await readNFCData();
  //     } else if (nfcPermission.state === 'prompt') {
  //       const result = await navigator.permissions.request({ name: 'nfc' });

  //       if (result.state === 'granted') {
  //         await readNFCData();
  //       } else {
  //         console.log('NFC permission denied.');
  //       }
  //     } else {
  //       console.log('NFC permission denied.');
  //     }
  //   } catch (error) {
  //     console.error('Error requesting NFC permission:', error);
  //   }
  // });
  document.getElementById('startNFCButton').addEventListener('click', async () => {
    try {
      await nfcReader.scan();
      console.log('NFC permissions granted');
      // Now you can start reading/writing NFC data
    } catch (error) {
      console.error('Error requesting NFC permissions:', error);
    }
  });

  // async function writeNFCData() {
  //   try {
  //     const nfc = new NDEFWriter();

  //     // Create an example record to write
  //     // I'll query the API at this point to grab the data back
  //     const record = new NDEFRecord({
  //       recordType: "text",
  //       data: "id placeholder"
  //     });

  //     const message = new NDEFMessage([record]);
  //     await nfc.write(message);

  //     console.log('NFC data written successfully.');
  //   } catch (error) {
  //     console.error('Error writing NFC data:', error);
  //   }
  // }

  // async function readNFCData() {
  //   try {
  //     await nfcReader.scan();

  //     nfcReader.addEventListener('reading', event => {
  //       const { records } = event;
  //       displayOutputScan.innerHTML += "test reached";
  //       for (const record of records) {
  //         console.log('NFC Record:', record);
  //         displayOutputScan.innerHTML += (record + "\n");
  //         // Handle the NFC record data as needed.
  //       }
  //     });

  //     console.log('Scanning for NFC tags...');
  //   } catch (error) {
  //     displayError2.innerHTML = error;
  //     console.error('Error scanning NFC:', error);
  //   }
  // }

  // const nfc = new NDEFReader();
  // nfc.addEventListener('reading', event => {
  //     const { records } = event;
  //       displayOutputScan.innerHTML += "test reached";
  //       for (const record of records) {
  //         console.log('NFC Record:', record);
  //         displayOutputScan.innerHTML += (record+"\n");
  //         // Handle the NFC record data as needed.
  //     }
  // });
});
