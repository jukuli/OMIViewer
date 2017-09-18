function hopefullyWorking(){
	console.log(nacl);
	console.log(nacl.util);
	console.log(CryptoJS);	
	
	var pub64 = "25X+V4A6uVqXM/CQqKjQKikqvzYDA0Hd27dfXCDH4+s=";
	var pubkey = nacl.util.decodeBase64(pub64);

	console.log("pubkey="+pubkey);
	
	var priv64 = "AYpRDqv26395JcnW1fHOlvkI6435CfoWGAjOfHz/nQPblf5XgDq5Wpcz8JCoqNAqKSq/NgMDQd3bt19cIMfj6w==";
	var privkey = nacl.util.decodeBase64(priv64);
	console.log("privkey="+privkey);
	
	var scalaSig64 = "oRvMDVBOSDmE2Mie3JyeK5fJNzm2Zv3C+eCdtiQHeldKA1RNHiT2FekV6xmk8OcW5I55rmZgsxV2lyfh8PF5DA==";
	var scalaSig = nacl.util.decodeBase64(scalaSig64);
	console.log("ScalaSig64="+scalaSig64);
	console.log("ScalaSig="+scalaSig);
	
	var testString = getTestXML("test.xml");
	console.log(testString);
	var jsHash64 = CryptoJS.SHA512(testString).toString(CryptoJS.enc.Base64);
	console.log("jsHash64="+jsHash64);
	
	var jsHash = nacl.util.decodeBase64(jsHash64);
	
	console.log("jshash bits="+jsHash);	
	
	var jsSigned = nacl.sign.detached(jsHash,privkey);
	console.log("jsSignedBits="+jsSigned);
	console.log("jsSigned64="+nacl.util.encodeBase64(jsSigned));
	console.log("verify jhash vs scalasigned="+nacl.sign.detached.verify(jsHash,scalaSig,pubkey));

}
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
});


