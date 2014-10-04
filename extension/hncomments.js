function searchHN(url, title, callback) {
    $.getJSON("https://hn.algolia.com/api/v1/search?tags=story&restrictSearchableAttributes=url&query=" + encodeURI(url), function(data) {
        processResults(data, url, title, callback)
    }); 
}

function processResults(data, url) {
    var match = _.find(data.hits, function(hit) { return hit.url == url; });
    if (match) {
        var commentURL = 'https://news.ycombinator.com/item?id=' + match.objectID;
        chrome.tabs.update({ url: commentURL });
    } else {
        window.alert('No discussion of ' + url + ' found');
    }
}

chrome.commands.onCommand.addListener(function(command) {
    if (command === 'find-hn-comments') {
        chrome.tabs.getSelected(null, function (tab) {
            if (tab.url.substring(0,9) == 'chrome://') {
                return;
            }
            searchHN(tab.url);
        });
    };
});