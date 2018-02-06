var flag = true;

window.addEventListener("keydown", function(event) {
    if (!flag) {
        return;
    }
    if (event.altKey && document.getSelection()) {
        flag = false;
        setTimeout(() => {
            flag = true;
        }, 2000);
        var word = document.getSelection().toString();
        word = word.match(/[a-zA-Z]+/)[0];

        chrome.runtime.sendMessage({ action: "search", word: word },
            function(response) {
                // console.log(response);
                response = JSON.parse(response);
                var save = confirm(response.data.definition);
                if (save) {
                    chrome.runtime.sendMessage({ action: "save", id: response.data.content_id }, function() {

                    })
                }
            })
    }
});