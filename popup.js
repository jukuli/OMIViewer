function searchId(){
		$("#loading").show("fast",function(){
			var id = $("#searchText").val();
			chrome.runtime.sendMessage({searchId: id}, function(searchJson) {
  				console.log(searchJson);
				$("#results").text(searchJson);
				$("#loading").hide();		
			});		
		});
		/*
				
		*/
		
	
}
document.addEventListener('DOMContentLoaded', function() {
		//$("#loading").hide();
		//hopefullyWorking();
		//var xml = getTestXML("test.xml");
		console.log("WAAT");
		//console.log(xml);
		//chrome.tabs.executeScript({file: "content.js"});
		$("#searchButton").click(function(event){
			event.preventDefault(); // cancel default behavior
			searchId();
		});
		
		$("#testButton").click(function(event){
			event.preventDefault(); // cancel default behavior
			chrome.runtime.sendMessage({omiNodeUrl: "http://localhost:8080/html/webclient/index.html"});
		});
		$("#verifyResponse").click(function(event){
			event.preventDefault(); // cancel default behavior
			chrome.runtime.sendMessage({verifyResponse: true});
		});
});


