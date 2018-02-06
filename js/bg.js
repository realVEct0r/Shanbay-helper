var s = new Shanbay(Conf);
if (!s.authorized()) {
    s.authorize();
}
s.makeHeader();

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {

        switch (message.action) {
            case "search":
                var word = message.word;

                if (word.match(/[a-zA-Z]+/)) {
                    word = word.match(/[a-zA-Z]+/)[0];
                }
                (async() => {
                    var res = await s.searchWord(word);
                    sendResponse(res);
                })();
                break;

            case "save":
                var id = message.id;

                (async() => {
                    await s.saveWord(id);
                })();

                break;
            default:
                break;
        }
        return true;

    }
);