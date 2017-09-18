console.log("content.js injected");
		
chrome.runtime.sendMessage({omiNodeLoaded: true}, function(response) {
  console.log("no response");
});

// Listen for messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("message received");
	if (request.greeting) {
		console.log("RAIRARI");    
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

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		console.log(mutation);
		console.log("paska"+mutation.target);
		console.log(getResponseText());
		if (mutation.addedNodes && mutation.addedNodes.length > 0) {
			// element added to DOM
			var hasClass = [].some.call(mutation.addedNodes, function(el) {
				return el.classList.contains('.CodeMirror-scroll')
			});
			if (hasClass) {
				// element has class `MyClass`
				console.log("VITU RIPULI");
				console.log('element ".CodeMirror-lines" added');
				console.log("teeekst "+$(".CodeMirror-lines").text());

			}

		}
	});
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};
console.log("rara");
console.log($(".well.response").find(".CodeMirror.cm-s-default.CodeMirror-wrap").first().text());
//console.log(getChildText($(".well.response").first()));
console.log($(".well.response").first().text());
console.log("mitä vittua");
$(".well.response").find(".CodeMirror.cm-s-default.CodeMirror-wrap").first().bind("DOMSubtreeModified", function(){
	try{	
	console.log("responseArea  DOMSubtreeModified changed");
	console.log($(".well.response").first());
	console.log(getResponseText());

	//console.log(getChildText($(".well.response").first()));
	}
	catch(e){
		console.log(e);	
	}
});

function getResponseText(){
	//CodeMirror-linenumber
	console.log("VITTUTUTU"+$(".well.response").text());
	return $(".well.response").filter(".CodeMirror-linenumber").text();
}

$("#responseArea").change(function(){
	console.log("responseArea changed");
	console.log(data);

});
console.log("teeekst "+$("#responseArea").text());
observer.observe($("#responseArea")[0], config);


