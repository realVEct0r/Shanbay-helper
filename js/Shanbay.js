function Shanbay(conf) {
    this.conf = conf;
}

Shanbay.prototype.authorize = function() {
    var url = `${this.conf.ShanbayConf.api_root}${this.conf.ShanbayConf.auth_url}?response_type=token&client_id=${this.conf.AppConf.app_key}`;
    chrome.tabs.create({ url: url }, function(tab) {
        window.Shanbay.tabId = tab.id;
    });
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (tabId != window.Shanbay.tabId) {
            return false;
        }
        if (tab.url.indexOf(window.Conf.ShanbayConf.auth_success_url) != -1) {
            var index = tab.url.indexOf('#') + 1;
            var hash = tab.url.slice(index, tab.url.length);
            hash = JSON.parse('{"' + decodeURI(hash).replace(/&/g, '","').replace(/=/g, '":"') + '"}')
            localStorage.access_token = hash.access_token;
            localStorage.expired_at = new Date((new Date()).getTime() + hash.expires_in * 1000);
            chrome.tabs.remove(tabId);
        }
    });
}

Shanbay.prototype.makeHeader = function() {
    var that = this;
    chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            details.requestHeaders.push({ name: "Authorization", value: "Bearer " + that.access_token() }, );
            details.requestHeaders.push({ name: "Content-Type", value: "application/json" }, );
            return {
                requestHeaders: details.requestHeaders
            }
        }, {
            urls: ["https://api.shanbay.com/*"]
        }, [
            "blocking", "requestHeaders"
        ]);

}

Shanbay.prototype.access_token = function() {
    return localStorage.access_token;
}

Shanbay.prototype.authorized = function() {
    return this.access_token() != undefined;
}

Shanbay.prototype._makeRequest = function(req) {
    var req = {
        method: req.method || "GET",
        url: req.url || "/",
        data: req.data || null,
    };
    var xhr = new XMLHttpRequest;
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.status);
                }
            }
        };
        xhr.open(req.method, req.url);
        xhr.send(JSON.stringify(req.data));
    });
}

Shanbay.prototype.searchWord = async function(word) {
    var url = `${this.conf.ShanbayConf.api_root}${this.conf.ShanbayConf.search_word_url}?word=${word}`;
    return await this._makeRequest({
        method: "GET",
        url: url
    });
}

Shanbay.prototype.profile = async function() {
    var url = `${this.conf.ShanbayConf.api_root}${this.conf.ShanbayConf.profile_url}`;
    return await this._makeRequest({
        method: "GET",
        url: url,
    });
}

Shanbay.prototype.saveWord = async function(id) {
    var url = `${this.conf.ShanbayConf.api_root}${this.conf.ShanbayConf.save_word_url}`;
    return await this._makeRequest({
        method: "POST",
        url: url,
        data: {
            id: id
        }
    })
}