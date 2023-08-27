document.addEventListener('DOMContentLoaded', () => {

    const displayOutput = document.getElementById('display-output');

    const nfcReader = new NDEFReader();
    document.getElementById('startNFCButton').addEventListener('click', async () => {
        try {
            await nfcReader.scan();
            console.log('NFC permissions granted');
            // Now you can start reading/writing NFC data
        } catch (error) {
            console.error('Error requesting NFC permissions:', error);
        }
    });
    (async () => {
        try {
            await nfcReader.scan();
            console.error('NFC permissions granted');
            displayOutput.innerHTML += 'NFC permissions granted';
            // Now you can start reading/writing NFC data
        } catch (error) {
            console.error('Error requesting NFC permissions:', error);
        }
    })();

    nfcReader.addEventListener('reading', async event => {
        const { message } = event;

        const textDecoder = new TextDecoder('utf-8');
        for (const record of message.records) {
            const plainText = textDecoder.decode(record.data);
            displayOutput.innerHTML += plainText;
            try {
                const response = await axios.get(`https://dashboard-tau-ivory.vercel.app/api/rfid/${plainText}/product`);
                // const response = await axios.get(`https://dashboard-tau-ivory.vercel.app/api/rfid/${plainText}/product`, {
                //     responseType: 'arraybuffer'
                // });
                displayOutput.innerHTML += "start";
                const name = response.data.name;
                const price = response.data.price;
                const quantity = response.data.quantity;
                const textInput = `${name}. Cost: ${price}. ${quantity} available.`;
                displayOutput.innerHTML += textInput;
                // displayOutput.innerHTML += "start";
                try {
                    // Query backend endpoint
                    const response = await axios.post('https://wthspeech.vercel.app/api/generate-audio', {
                        textInput: textInput
                    }, {
                        responseType: 'arraybuffer',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                    const audioData = response.data;
                    const blob = new Blob([audioData], { type: 'audio/mpeg' });
                    const audioElement = new Audio();
                    audioElement.src = URL.createObjectURL(blob);
                    displayOutput.innerHTML += audioElement.src;
                    displayOutput.innerHTML += "end";
                    // const link = document.createElement('a');
                    // link.href = audioElement.src;
                    // link.download = 'audio.mp3'; // Set the desired file name

                    // // Simulate a click on the link to trigger download
                    // link.click();
                    // Play the audio
                    // audioElement.addEventListener('canplaythrough', () => {
                    //     audioElement.play();
                    // });
                    audioElement.play();
                } catch (error) {
                    console.error(error);
                    displayOutput.innerHTML += "error";
                }
            } catch (error) {
                displayOutput.innerHTML += "error outside";
                displayOutput.innerHTML += error;
                console.error(error);
            }

        }
    });
});