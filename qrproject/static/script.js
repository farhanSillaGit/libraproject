//form1 myForm
document.addEventListener('DOMContentLoaded', function() {
    clearLocalFormSubmissions();
    setCurrentDateTime('date', 'time');
    const form = document.getElementById('myForm');
    const feedback = document.getElementById('feedback');

    // Open or create IndexedDB database
    const request = window.indexedDB.open('FormDB', 1);

    // Create object store within the database
    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
        // Define index if needed
        // objectStore.createIndex('siteId', 'siteId', { unique: false });
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Perform client-side validation
            const siteId = document.getElementById('siteId').value.trim();
            const time = document.getElementById('time').value.trim();
            const date = document.getElementById('date').value.trim();
            const employeeId = document.getElementById('employeeId').value.trim();
            const remark = document.getElementById('remark').value.trim();
            const qrCode = document.getElementById('siteCode').value.trim();
            const status = document.querySelector('input[name="status"]:checked');
            const shift = document.querySelector('input[name="shift"]:checked');
            // Extract the value of the selected radio buttons
            const statusValue = status ? status.value : null;
            const shiftValue = shift ? shift.value : null;


            if (!siteId || !time || !status || !date || !shift || !employeeId ) {
                feedback.textContent = 'Please fill out all required fields.';
                feedback.style.color = 'red';
                return;
            }
            console.log('QR Code:', qrCode);
            // Store form data locally using IndexedDB
            const transaction = db.transaction(['forms'], 'readwrite');
            const objectStore = transaction.objectStore('forms');
            const formData = {
                siteId: siteId,
                time: time,
                status: statusValue,
                date: date,
                shift: shiftValue,
                employeeId: employeeId,
                remark: remark,
                qrCode: qrCode,
                formid: 'myForm'
            };
            console.log(formData);
            const request = objectStore.add(formData);

            request.onsuccess = function() {
                // Provide feedback to the user
                feedback.textContent = 'Form submitted successfully and stored locally.';
                feedback.style.color = 'green';
                // Reset the form after successful submission
                form.reset();
                setCurrentDateTime('date', 'time')
            };

            request.onerror = function() {
                feedback.textContent = 'Error storing form data locally.';
                feedback.style.color = 'red';
            };
        });
    };

    request.onerror = function() {
        feedback.textContent = 'Error opening IndexedDB database.';
        feedback.style.color = 'red';
    };
});

//myForm2 domcontentload function
document.addEventListener('DOMContentLoaded', function() {
    setCurrentDateTime('date2', 'time2');
    const form = document.getElementById('myForm2');
    const feedback = document.getElementById('feedback');

    // Open or create IndexedDB database
    const request = window.indexedDB.open('FormDB', 1);

    // Create object store within the database
    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
        // Define index if needed
        // objectStore.createIndex('siteId', 'siteId', { unique: false });
    };

    request.onsuccess = function(event) {
        const db = event.target.result;

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Perform client-side validation
            const siteId = document.getElementById('siteId2').value.trim();
            const time = document.getElementById('time2').value.trim();
            const date = document.getElementById('date2').value.trim();
            const employeeId = document.getElementById('employeeId2').value.trim();
            const status = document.querySelector('input[name="status"]:checked');
            const shift = document.querySelector('input[name="shift"]:checked');
            // Extract the value of the selected radio buttons
            const statusValue = status ? status.value : null;
            const shiftValue = shift ? shift.value : null;


            if (!siteId || !time || !status || !date || !shift || !employeeId ) {
                feedback.textContent = 'Please fill out all required fields.';
                feedback.style.color = 'red';
                return;
            }

            // Store form data locally using IndexedDB
            const transaction = db.transaction(['forms'], 'readwrite');
            const objectStore = transaction.objectStore('forms');
            const formData = {
                siteId: siteId,
                time: time,
                status: statusValue,
                date: date,
                shift: shiftValue,
                employeeId: employeeId,
                formid: 'myForm2'

            };
            console.log(formData);
            const request = objectStore.add(formData);

            request.onsuccess = function() {
                // Provide feedback to the user
                feedback.textContent = 'Form submitted successfully and stored locally.';
                feedback.style.color = 'green';
                // Reset the form after successful submission
                form.reset();
                setCurrentDateTime('date2', 'time2')
            };

            request.onerror = function() {
                feedback.textContent = 'Error storing form data locally.';
                feedback.style.color = 'red';
            };
        });
    };

    request.onerror = function() {
        feedback.textContent = 'Error opening IndexedDB database.';
        feedback.style.color = 'red';
    };
});




// Function to handle QR code scanning
// Function to handle QR code scanning
function startScanner(event) {
    // Prevent the default button click behavior
    event.preventDefault();

    // Access the video stream from the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.createElement('video');
            const scanner = document.getElementById('scanner');
            const siteCodeInput = document.getElementById('siteCode');

            // Attach the video stream to the video element
            video.srcObject = stream;
            video.setAttribute('autoplay', '');
            video.setAttribute('playsinline', '');
            scanner.appendChild(video);

            // Start scanning for QR codes
            const canvasElement = document.createElement('canvas');
            const canvas = canvasElement.getContext('2d');
            const scanFrame = () => {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    // Set the canvas dimensions to match the video
                    canvasElement.width = video.videoWidth;
                    canvasElement.height = video.videoHeight;
                    // Draw the video frame onto the canvas
                    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
                    // Get the image data from the canvas
                    const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                    // Decode the QR code from the image data
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    // If a QR code is detected, set its value to the hidden input field
                    if (code) {
                        siteCodeInput.value = code.data;
                        siteCodeInput.type = 'text'; // Change the input type to make it visible
                        // Stop scanning
                        stream.getTracks().forEach(track => track.stop());
                        // Remove the video element
                        video.remove();
                    }
                }
                // Continue scanning
                requestAnimationFrame(scanFrame);
            };
            // Start scanning
            scanFrame();
        })
        .catch(error => {
            console.error('Error accessing webcam:', error);
        });
}


// Add the new code for setting current date and time
// Function to set current date and time to readonly date and time fields
function setCurrentDateTime(dateId, timeId) {
    var currentDate = new Date().toISOString().slice(0, 10);
    var currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    document.getElementById(dateId).value = currentDate;
    document.getElementById(timeId).value = currentTime;
}

// Call the function when the page loads
//window.onload = setCurrentDateTime;
//window.onload = function() {

    //setCurrentDateTime('date', 'time'); // For myForm
  //  setCurrentDateTime('date2', 'time2'); // For myForm2
//};
// Start the scanner when the button is clicked
//document.getElementById('scanQRCode').addEventListener('click', startScanner);
const scanQRCodeButton = document.getElementById('scanQRCode');
if (scanQRCodeButton) {
    scanQRCodeButton.addEventListener('click', startScanner);
}
//Add a function in your JavaScript code to send the data to the server:
function sendDataToServer(data) {
    console.log(data);

    fetch('http://127.0.0.1:8000/formsubmit/', { // Change the URL to match your server endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // Include CSRF token in request headers
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {

            console.log('Data sent to server successfully');
            clearLocalFormSubmissions();
            feedback.textContent = 'Form submitted successfully.';
            clearLocalFormSubmissions();
        } else {
            console.error('Failed to send data to server');
        }
    })
    .catch(error => {
        console.error('Error sending data to server:', error);
    });

}

// Function to retrieve CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if the cookie name matches the desired name
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                // Extract and decode the cookie value
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    return cookieValue;
}
// Periodically check for internet connectivity and trigger synchronization
setInterval(async () => {
    if (navigator.onLine) {
        console.log('Internet connection detected.');

        const submissions = await retrieveLocalFormSubmissions();
        if (submissions.length > 0) {
            console.log('Submitting local form submissions to server...');
            sendDataToServer(submissions); // Call the function to send data to server
        } else {
            console.log('No local form submissions to submit.');
        }
    } else {
        console.log('No internet connection detected.');
    }
}, 60000); // Check every minute

//data retrival function
function retrieveLocalFormSubmissions() {
    return new Promise((resolve, reject) => {
        // Open or create IndexedDB database
        console.log('Opening IndexedDB database...');
        const request = window.indexedDB.open('FormDB', 1);

        request.onsuccess = function(event) {
            console.log('IndexedDB database opened successfully');
            const db = event.target.result;
            const transaction = db.transaction(['forms'], 'readonly');
            const objectStore = transaction.objectStore('forms');
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = function(event) {
                console.log('Retrieving form submissions from IndexedDB...');
                const submissions = event.target.result;
                console.log('Retrieved form submissions:', submissions);
                resolve(submissions);
            };

            getAllRequest.onerror = function(event) {console.error('Error retrieving form submissions from IndexedDB:', event.target.error);

                reject('Error retrieving form submissions from IndexedDB');
            };
        };

        request.onerror = function(event) {
            console.error('Error opening IndexedDB database:', event.target.error);
            reject('Error opening IndexedDB database');
        };
    });
}

function clearLocalFormSubmissions() {
    const request = window.indexedDB.open('FormDB', 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['forms'], 'readwrite');
        const objectStore = transaction.objectStore('forms');
        const clearRequest = objectStore.clear();

        clearRequest.onsuccess = function(event) {
            console.log('Local form submissions cleared successfully');
        };

        clearRequest.onerror = function(event) {
            console.error('Error clearing local form submissions');
        };
    };

    request.onerror = function(event) {
        console.error('Error opening IndexedDB database');
    };
}
