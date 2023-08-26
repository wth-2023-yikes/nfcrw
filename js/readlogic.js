document.addEventListener('DOMContentLoaded', () => {

    const displayOutput = document.getElementById('display-output');

    const nfcReader = new NDEFReader();
    // nfcReader.scan();
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
});