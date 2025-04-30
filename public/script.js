// Simple front-end alert for OTP timeout
setTimeout(() => {
    const timeoutMsg = document.getElementById("timeout-msg");
    if (timeoutMsg) timeoutMsg.style.display = "block";
}, 60000); // Show timeout warning after 60 seconds