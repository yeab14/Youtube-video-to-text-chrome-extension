// Function to create the transcription popup
function createTranscriptionPopup(transcript) {
    let popup = document.getElementById('transcription-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'transcription-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50px';  // Adjusted top position for better visibility
        popup.style.right = '50px';  // Adjusted right position for better alignment
        popup.style.zIndex = '9999';
        popup.style.padding = '20px';
        popup.style.backgroundColor = '#f0f0f0';  // Light gray background
        popup.style.border = '2px solid #dc3545';  // Red border
        popup.style.borderRadius = '10px';
        popup.style.width = '400px';  // Increased width for better readability
        popup.style.maxHeight = '80vh';  // Limited maximum height for better scrolling
        popup.style.overflowY = 'auto';  // Added auto scrolling
        popup.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';  // Shadow effect
        popup.style.fontFamily = 'Arial, sans-serif';  // Set font family

        document.body.appendChild(popup);

        // Styling for the transcript text
        const transcriptText = document.createElement('div');
        transcriptText.innerText = transcript;
        transcriptText.style.fontSize = '18px';  // Increased font size
        transcriptText.style.lineHeight = '1.6';  // Improved line height
        transcriptText.style.marginBottom = '20px';  // Added space below text
        popup.appendChild(transcriptText);

        // Stylish copy button
        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy Text';
        copyButton.style.padding = '12px 24px';  // Increased padding
        copyButton.style.marginRight = '10px';
        copyButton.style.backgroundColor = '#28a745';  // Green color
        copyButton.style.color = '#ffffff';  // White text
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
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

        // Stylish hide button
        const hideButton = document.createElement('button');
        hideButton.innerText = 'Hide';
        hideButton.style.padding = '12px 24px';  // Increased padding
        hideButton.style.backgroundColor = '#dc3545';  // Red color
        hideButton.style.color = '#ffffff';  // White text
        hideButton.style.border = 'none';
        hideButton.style.borderRadius = '5px';
        hideButton.style.cursor = 'pointer';
        hideButton.addEventListener('click', () => {
            popup.style.display = 'none';
        });
        popup.appendChild(hideButton);
    } else {
        // Update existing popup with new transcript
        const transcriptText = popup.querySelector('.transcript-text');
        if (transcriptText) {
            transcriptText.innerText = transcript;
        }
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
    button.style.top = '20px';  // Adjusted top position for better visibility
    button.style.right = '20px';  // Adjusted right position for better alignment
    button.style.zIndex = '9999';
    button.style.padding = '15px 30px';
    button.style.backgroundColor = '#dc3545';  // Red color
    button.style.color = '#ffffff';  // White text
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.fontFamily = 'Arial, sans-serif';  // Set font family
    button.style.fontSize = '16px';  // Font size adjustment
    button.style.cursor = 'pointer';
    button.style.transition = 'background-color 0.3s ease';  // Hover effect

    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#c82333';  // Darker red on hover
    });

    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#dc3545';  // Restore original red after hover
    });

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






