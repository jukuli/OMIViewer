chrome.runtime.sendMessage({omiNodeLoaded: true}, function(response) {
  //console.log("no response");
});

// Listen for messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	//console.log("message received");
	if (request.greeting) {
		//console.log("RAIRARI");    
	}
	if(request.getResponse){
		console.log("verify Response");
		sendResponse(getResponseText());
		//console.log(getResponseText());	
	}
});

function getChildText(node){
		
	var text = "";
	if(node != null){
		text = $(node).val();
		$(node).contents().each(function(next){
			text = text + getChildText(next);
		});
	}
	return text;
}

function getResponseText(){
	var clone = $(".well.response").clone();
	$(clone).find(".CodeMirror-linenumber").empty();

	return $(clone).find(".CodeMirror.cm-s-default.CodeMirror-wrap").text();
}

