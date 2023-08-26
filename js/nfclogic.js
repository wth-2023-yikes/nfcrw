document.addEventListener('DOMContentLoaded', () => {
  const nfcButton = document.getElementById('nfc-button');
  const displayOutput = document.getElementById('display-output');
  const displayError = document.getElementById('display-error');
  async function fetchProducts() {
    try {
      // wait for cors error resolve from Benedict
      const response = await axios.get('https://dashboard-tau-ivory.vercel.app/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      displayError.innerHTML =error;
      throw error;
    }
  }

  fetchProducts().then((products) => {
    console.log(products);
    displayOutput.innerHTML = products;
    nfcButton.addEventListener('click', async () => {
      try {
        const nfcPermission = await navigator.permissions.query({ name: 'nfc' });

        if (nfcPermission.state === 'granted') {
          await writeNFCData();
        } else if (nfcPermission.state === 'prompt') {
          const result = await navigator.permissions.request({ name: 'nfc' });

          if (result.state === 'granted') {
            await writeNFCData();
          } else {
            console.log('NFC permission denied.');
          }
        } else {
          console.log('NFC permission denied.');
        }
      } catch (error) {
        console.error('Error requesting NFC permission:', error);
      }
    })
  }

  );

  async function writeNFCData() {
    try {
      const nfc = new NDEFWriter();

      // Create an example record to write
      // I'll query the API at this point to grab the data back
      const record = new NDEFRecord({
        recordType: "text",
        data: "id placeholder"
      });

      const message = new NDEFMessage([record]);
      await nfc.write(message);

      console.log('NFC data written successfully.');
    } catch (error) {
      console.error('Error writing NFC data:', error);
    }
  }
});
