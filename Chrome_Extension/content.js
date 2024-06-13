// Function to create the transcription popup
function createTranscriptionPopup(transcript) {
    let popup = document.getElementById('transcription-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'transcription-popup';
        popup.style.position = 'fixed';
        popup.style.top = '10px';
        popup.style.right = '10px';
        popup.style.zIndex = '9999';
        popup.style.padding = '10px';
        popup.style.backgroundColor = '#FFFFFF';
        popup.style.border = '1px solid #000000';
        popup.style.borderRadius = '5px';
        popup.style.width = '300px';
        popup.style.height = '400px';
        popup.style.overflowY = 'scroll';
        
        document.body.appendChild(popup);

        popup.innerText = transcript;
        popup.style.display = 'block';

        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy Text';
        copyButton.style.marginTop = '10px';
        copyButton.style.marginRight = '5px';
        copyButton.style.padding = '5px 10px';
        copyButton.style.backgroundColor = '#4CAF50';
        copyButton.style.color = '#FFFFFF';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '3px';
        copyButton.style.cursor = 'pointer';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(transcript)
                .then(() => {
                    console.log('Text copied to clipboard');
                    // Optionally show a message or update button state
                })
                .catch(err => {
                    console.error('Unable to copy text: ', err);
                    // Handle error
                });
        });
        popup.appendChild(copyButton);

        // Add auto-hide button
        const hideButton = document.createElement('button');
        hideButton.innerText = 'Hide';
        hideButton.style.marginTop = '10px';
        hideButton.style.padding = '5px 10px';
        hideButton.style.backgroundColor = '#FF0000';
        hideButton.style.color = '#FFFFFF';
        hideButton.style.border = 'none';
        hideButton.style.borderRadius = '3px';
        hideButton.style.cursor = 'pointer';
        hideButton.addEventListener('click', () => {
            popup.style.display = 'none';
        });
        popup.appendChild(hideButton);
    } else {
        popup.innerText = transcript;
        popup.style.display = 'block';
    }
}

// Function to transcribe the video
function transcribeVideo(videoUrl) {
    console.log('Transcribing video:', videoUrl); // Log the video URL
    let retries = 3; // Number of retries
    let retryDelay = 1000; // Delay between retries in milliseconds

    function sendMessageWithRetry() {
        chrome.runtime.sendMessage({ action: 'transcribe', videoUrl }, (response) => {
            if (response && response.transcript) {
                createTranscriptionPopup(response.transcript);
            } else {
                console.error('Error fetching transcript. Please try again.');
                if (retries > 0) {
                    setTimeout(sendMessageWithRetry, retryDelay);
                    retries--;
                }
            }
        });
    }

    sendMessageWithRetry();
}

// Function to add the transcription button
function addTranscriptionButton() {
    console.log('Attempting to add transcription button'); // Log button addition attempt
    if (document.getElementById('transcription-button')) return;

    const button = document.createElement('button');
    button.id = 'transcription-button';
    button.innerText = 'Transcribe Video';
    button.style.position = 'fixed';
    button.style.top = '50px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#FF0000';
    button.style.color = '#FFFFFF';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);

    button.addEventListener('click', () => {
        const videoUrl = window.location.href;
        transcribeVideo(videoUrl);
    });
}

function initializeContentScript() {
    console.log('Content script loaded'); // Log script load
    addTranscriptionButton();

    const observer = new MutationObserver(() => {
        if (window.location.href.includes('watch')) {
            addTranscriptionButton();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

if (!window.hasRun) {
    window.hasRun = true;
    initializeContentScript();
}




