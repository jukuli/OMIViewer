// Regex-pattern to check URLs against. 
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
console.log("background page loaded");
var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?stackoverflow\.com/;

// A function to use as callback
function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
}
function getURL(type,path){
	var xmlStr = $.ajax({
		type: type,       
		url: path,
		dataType: 'text',
		contentType: "text/xml;charset=iso8859-1",
		global: false,
		async:false,
	success: function(data) {
    		return data;
		}
	}).responseText;
	return xmlStr;
}
function searchBlockstackExplorer(id){
	var baseURL = "http://localhost:6270/v1/names/"
	var results = getURL("GET",baseURL+id);
	//var results = getURL("POST","testjson.json");
	return results;
}
function getTestXML(filename){
	xmlStr = getURL("POST",filename);

	xmlStr = xmlStr.replace(/\n/g, "")
		.replace(/[\t ]+\</g, "<")
		.replace(/\>[\t ]+\</g, "><")
		.replace(/\>[\t ]+$/g, ">")

	return xmlStr;
}

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
	console.log("browserbutton clicked");   
	 // ...check the URL of the active tab against our pattern and...
   // if (urlRegex.test(tab.url)) {
        // ...if it matches, send a message specifying a callback too
        chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
    //}
});
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
	if (request.searchId){
		var results = searchBlockstackExplorer(request.searchId);
		sendResponse(results);
	}
	else if (request.omiNodeUrl){
		console.log("open url request");
		chrome.tabs.create({ url: request.omiNodeUrl },function(tab){
			chrome.tabs.executeScript(tab.id,{file:"jquery-3.2.1.js"},function(){
				chrome.tabs.executeScript(tab.id, {file: "content.js"}, function(){
            				chrome.tabs.sendMessage(tab.id, {greeting:"HEELLLOO"});
        			});
			});					
		});
	}
	else if(request.omiNodeLoaded){
		console.log("content.js loaded");	
	}	
});
