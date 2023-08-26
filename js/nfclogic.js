document.addEventListener('DOMContentLoaded', () => {

  // const displayError = document.getElementById('display-error');
  // const displayOutput = document.getElementById('display-output');
  const nfcButton = document.getElementById('write-nfc');
  const productList = document.getElementById('product-list');

  function getSelectedRadioButtonId(radioButtons) {
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        return radioButton.id; // Return the id of the selected radio button
      }
    }
    return null; // Return null if no radio button is selected
  }
  nfcButton.addEventListener('click', async () => {
    try {
      const radioButtons = document.querySelectorAll('input[name="optionGroup"]');
      const selectedRadioId = getSelectedRadioButtonId(radioButtons);
      if (selectedRadioId) {
        console.log('Selected radio button ID:', selectedRadioId);
      } else {
        console.log('No radio button is selected.');
      }
      const nfcPermission = await navigator.permissions.query({ name: 'nfc' });

      if (nfcPermission.state === 'granted') {
        // displayOutput.innerHTML += 'NFC permission granted';
        await writeNFCData(selectedRadioId);
      } else if (nfcPermission.state === 'prompt') {
        const result = await navigator.permissions.request({ name: 'nfc' });

        if (result.state === 'granted') {
          await writeNFCData(selectedRadioId);
        } else {
          // displayError.innerHTML += 'NFC permission denied.';
          console.log('NFC permission denied.');
        }
      } else {
        // displayError.innerHTML += 'NFC permission denied.';

        console.log('NFC permission denied.');
      }
    } catch (error) {
      // displayError.innerHTML += 'NFC permission denied.';

      console.error('Error requesting NFC permission:', error);
    }
  });

  async function fetchProducts() {
    try {
      const response = await axios.get('https://dashboard-tau-ivory.vercel.app/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      // displayError.innerHTML += ("\n" + error);
      throw error;
    }
  }

  async function writeNFCData(id) {
    try {
      const nfc = new NDEFReader();
      // const products = await fetchProducts();
      await nfc.write({ records: [{ data: id, recordType: "text" }] });

      // displayOutput.innerHTML += 'NFC data written successfully.';
    } catch (error) {
      console.error('Error writing NFC:', error);
      // displayError.innerHTML += 'Error writing NFC data: ' + error;
    }
  }
  // Call fetchProducts initially to load product data
  fetchProducts().then(products => {
    console.log(products);
    // displayOutput.innerHTML = products;

    const productContainer = document.createElement('div');
    productContainer.classList.add("flex", "flex-col", "justify-between");

    for (const product of products) {
      var htmlContent =
        `
          <div class="flex flex-row"> <!-- Allow to take up available space -->
            <div class="flex flex-col">
              <h2 class="text-black text-2xl font-semibold">
                Product Name
              </h2>
              <p>${product.name}</p>
              
              <h3 class="text-black text-xl font-semibold mt-2">
                Price ($)
              </h3>
              <p>${product.price}</p>
            </div>
          </div>
          <div class="flex flex-col justify-between items-end">
            <input type="radio" name="select-group" id="${product.id}" class="flex peer w-4 h-4 mt-2 left-6 accent-blue-600 rounded-full" />
            <button class="flex text-sky-500 hover:text-sky-700 decoration-solid">
              View More
            </button>
          </div>
        `
      // const productDiv = document.createElement('div');
      // productDiv.innerHTML = htmlContent;
      const productDiv = document.createElement('div');
      productDiv.innerHTML = htmlContent;
      productDiv.classList.add("flex", "flex-row", "justify-between", "w-full", "my-4", "bg-white", "hover:bg-gray-100", "py-2", "px-4", "border", "border-gray-400", "rounded", "shadow");
      productContainer.appendChild(productDiv);

      productContainer.appendChild(productDiv);
      // productDiv.classList.add("flex", "flex-row");
      // productList.appendChild(productDiv);
      // nameList.innerHTML += product.name + "<br>";
      // priceList.innerHTML += product.price + "<br>";
    }
      productList.appendChild(productContainer);

    // You can display products information in a meaningful way here
  });

  // const nfcReader = new NDEFReader();
  // nfcReader.addEventListener('reading', async event => {
  //   const { message } = event;
  //   const textDecoder = new TextDecoder('utf-8');
  //   for (const record of message.records) {
  //     const plainText = textDecoder.decode(record.data);
  //     try {
  //       const response = await axios.get(`https://dashboard-tau-ivory.vercel.app/api/rfid/${plainText}/product`, {
  //         responseType: 'arraybuffer'
  //       });

  //       const name = response.data.name;
  //       const price = response.data.price;
  //       const quantity = response.data.quantity;

  //       const textInput = `${name}. Cost: ${price}. ${quantity} available.`;

  //       try {
  //         // Query backend endpoint
  //         const response = await axios.post('/generate-audio', {
  //           textInput: textInput
  //         }, {
  //           responseType: 'arraybuffer'
  //         });

  //         const audioData = response.data;
  //         const blob = new Blob([audioData], { type: 'audio/mpeg' });

  //         const audioElement = new Audio();
  //         audioElement.src = URL.createObjectURL(blob);

  //         // Play the audio
  //         audioElement.play();
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }

  //   }
  // });
});

  // document.getElementById('startNFCButton').addEventListener('click', async () => {
  //   try {
  //     await nfcReader.scan();
  //     console.log('NFC permissions granted');
  //     // Now you can start reading/writing NFC data
  //   } catch (error) {
  //     console.error('Error requesting NFC permissions:', error);
  //   }
  // });

  // async function writeNFCData(productId) {
  //   try {
  //     const nfc = new NDEFReader();
  //     await nfc.write({records:[{data:"1", recordType: "text"}]});

  //     displayOutput.innerHTML += 'NFC data written successfully.';
  //   } catch (error) {
  //     displayError.innerHTML += 'Error writing NFC data: ' + error;
  //   }
  // }
