function searchHN(url, title, callback) {
    $.getJSON("https://hn.algolia.com/api/v1/search?tags=story&restrictSearchableAttributes=url&query=" + encodeURI(url), function(data) {
        processResults(data, url, title, callback)
    }); 
}

function bestMatch(data) {
    if (data.hits && data.hits.length > 0) {
        console.log('found ' + data.hits.length + ' hit(s)');
        // just return the first hit as the best match for now, this could be tuned in the future
        return data.hits[0];
    } else {
        return null;
    }
}

function processResults(data, url, title, callback) {
    var match = bestMatch(data);
    if (callback) {
        callback(url, title, match);
    } else {
        console.log('best match', match);
    }
}

function navigateToComments(url, title, match) {
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
            searchHN(tab.url, tab.title, navigateToComments);
        });
    };
});