// Saves options to chrome.storage
function save_options() {
    var key = document.getElementById("key").value;
    localStorage.setItem("key", key);
    alert("succ");
}

function restore_options() {
    document.getElementById("key").value = localStorage.getItem("key");
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);