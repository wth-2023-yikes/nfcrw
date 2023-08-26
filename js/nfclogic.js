document.addEventListener('DOMContentLoaded', () => {

  const displayError = document.getElementById('display-error');
  const displayOutput = document.getElementById('display-output');
  const nfcButton = document.getElementById('write-nfc');
  const productList = document.getElementById('product-list');

  
  nfcButton.addEventListener('click', async () => {
    try {
      const nfcPermission = await navigator.permissions.query({ name: 'nfc' });

      if (nfcPermission.state === 'granted') {
        displayOutput.innerHTML += 'NFC permission granted'; 
        await writeNFCData();
      } else if (nfcPermission.state === 'prompt') {
        const result = await navigator.permissions.request({ name: 'nfc' });

        if (result.state === 'granted') {
          await writeNFCData();
        } else {
          displayError.innerHTML += 'NFC permission denied.';
          console.log('NFC permission denied.');
        }
      } else {
        displayError.innerHTML += 'NFC permission denied.';

        console.log('NFC permission denied.');
      }
    } catch (error) {
      displayError.innerHTML += 'NFC permission denied.';

      console.error('Error requesting NFC permission:', error);
    }
  });

    async function fetchProducts() {
      try {
        const response = await axios.get('https://dashboard-tau-ivory.vercel.app/api/products');
        return response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        displayError.innerHTML += ("\n" + error);
        throw error;
      }
    }

    async function writeNFCData() {
      try {
        const nfc = new NDEFReader();
        // const products = await fetchProducts();
        await nfc.write({records:[{data:"2", recordType: "text"}]});
  
        displayOutput.innerHTML += 'NFC data written successfully.';
      } catch (error) {
        displayError.innerHTML += 'Error writing NFC data: ' + error;
      }
    }
    // Call fetchProducts initially to load product data
    fetchProducts().then(products => {
      console.log(products);
      displayOutput.innerHTML = products;
      for (const product of products) {
        var htmlContent = 
        `
        <div class="flex flex-row"> <!-- Allow to take up available space -->
            <div class="flex flex-col">
              <h2 class="text-black text-2xl font-semibold">
                Product Name
              </h2>
              <p>${product.name}</p>
              
              <h3 class="text-black text-xl font-semibold">
                Product Price
              </h3>
              <p>${product.price}</p>
            </div>
          </div>
          <div class="flex flex-col justify-between items-end">
            <input type="checkbox" id="select" class="flex peer w-4 h-4 mt-2 left-6 accent-blue-600 rounded-full" />
            <button class="flex text-sky-500 hover:text-sky-700 decoration-solid">
              View More
            </button>
          </div>
        `
        const productDiv = document.createElement('div');
        productDiv.innerHTML = htmlContent;
        productList.appendChild(productDiv);
        // nameList.innerHTML += product.name + "<br>";
        // priceList.innerHTML += product.price + "<br>";
      }
      // You can display products information in a meaningful way here
    });

  // const nfcReader = new NDEFReader();
  // nfcReader.addEventListener('reading', event => {
  //   const {message} = event;
  //   const textDecoder = new TextDecoder('utf-8');
  //   for (const record of message.records) {
  //     const plainText = textDecoder.decode(record.data);
  //     // displayOutputScan.innerHTML += (plainText);
  //     //query the db api with the id for full info
  //     // return a json object with the info
  //     // {
  //     //  id: 1,
  //     //  name: "name",
  //     //  price: 1.99,
  //     // }
  // }
  // });

  // document.getElementById('startNFCButton').addEventListener('click', async () => {
  //   try {
  //     await nfcReader.scan();
  //     console.log('NFC permissions granted');
  //     // Now you can start reading/writing NFC data
  //   } catch (error) {
  //     console.error('Error requesting NFC permissions:', error);
  //   }
  // });

});

  // async function writeNFCData(productId) {
  //   try {
  //     const nfc = new NDEFReader();
  //     await nfc.write({records:[{data:"1", recordType: "text"}]});

  //     displayOutput.innerHTML += 'NFC data written successfully.';
  //   } catch (error) {
  //     displayError.innerHTML += 'Error writing NFC data: ' + error;
  //   }
  // }
