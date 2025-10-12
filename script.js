// Initialize the Telegram Mini App
const tg = window.Telegram.WebApp;
tg.ready();
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwIKsk4FFugMd-lGemHw7mP5S_7Fkg3ObIX3DwugIgyODLp4s7qBkvh82KrTKI9WaPe/exec';


const form = document.getElementById('leave-form');

document.addEventListener('ready',function(){
    axios.post(GAS_WEB_APP_URL, {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
})

form.addEventListener('submit', function(event) {
    event.preventDefault();

    // The URL of your Google Apps Script Web App (we will get this in the next step)
 
    const formData = {
        // leaveType: document.getElementById('leave-type').value,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value,
        reason: document.getElementById('reason').value,
        // Pass user data from Telegram
        userData: tg.initDataUnsafe.user
    };

    // Show a confirmation popup
    tg.showConfirm("Are you sure you want to submit this leave request?", function(isConfirmed) {
        if (isConfirmed) {
            // Disable button to prevent multiple submissions
            form.querySelector('button').disabled = true;
            form.querySelector('button').textContent = 'Submitting...';

            fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'submitLeaveRequest',
                    data: formData
                }),
                headers: {
                    // 'Content-Type': 'application/json'
                      'Content-Type': 'text/plain;charset=utf-8'
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    // Send a message back to the user and close the Mini App
                    tg.sendData("Your leave request has been submitted successfully!");
                    tg.close();
                } else {
                    tg.showAlert(`Error: ${result.message}`);
                    form.querySelector('button').disabled = false;
                    form.querySelector('button').textContent = 'Submit Request';
                }
            })
            .catch(error => {
                tg.showAlert(`An error occurred: ${error.message}`);
                form.querySelector('button').disabled = false;
                form.querySelector('button').textContent = 'Submit Request';
            });
        }
    });
});