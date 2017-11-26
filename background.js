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

function hopefullyWorking(response){
	
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
	
	//var testString = getTestXML("test.xml");
	var testString = response;	
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
function searchBlockstackExplorer(id){
	//var baseURL = "http://localhost:6270/v1/names/"
	var baseURL = "https://core.blockstack.org/v2/users/"; 	
	var results = getURL("GET",baseURL+id);
	//var results = getURL("POST","testjson.json");
	return results;
}
function parseProfileJson(searchId,jsonString){
	try{	
		var json = $.parseJSON(jsonString);
		var first = json[searchId];
		// get the omiJson Url		
		var profile = first.profile;
		var accounts = profile.account;
		var omiUrl = "";		
		$.each(accounts, function(i,item){
			if(item.service == "omiviewer" && item.identifier =="omi_nodes")
				omiUrl = item.contentUrl;
		});
		chrome.storage.local.set({"omiJsonUrl":omiUrl});		
		console.log(omiUrl);
		
		// get the publickey
		var pubkeystr = "";		
		$.each(first.zone_file.txt,function(i,item){
			if(item.name == "pubkey")
				pubkeystr = item.txt;		
		});
		var pubkey = pubkeystr.split("pubkey:data:")[1];
		chrome.storage.local.set({"user_pubkey":pubkey});		
		console.log("pubkey="+pubkey);
		
	}
	catch(e){
		throw e;	
	}
	console.log(json);	
}
function reloadParseOmiJson(){
	console.log(blockstack);
	chrome.storage.local.get(["omiJsonUrl","user_pubkey"],function(items){
		var url = items["omiJsonUrl"];
		var pubkey = items["user_pubkey"];
		var signedjson = getURL("GET",url);
		console.log(signedjson);
		console.log(pubkey);
		verifyJsonSignature(pubkey,signedjson);
		
		
	}); 	
	
}
function verifyJsonSignature(pubkey,signedjson){
	var index1 = signedjson.indexOf('.');
	var bsk2 = signedjson.substring(0,index1);
	var rest1 = signedjson.substring(index1+1);
	var index2 = rest1.indexOf('.');
	var pubk = rest1.substring(0,index2);
	var rest2 = rest1.substring(index2+1);
	var index3 = rest2.indexOf('.');
	var signature = rest2.substring(0,index3);
	var datatxt = rest2.substring(index3+1);

	var datalen = datatxt.substring(0,datatxt.indexOf(':'));
	var data = datatxt.substring(datatxt.indexOf(':')+1);
	// sometimes a extra \n is added. remove it.
	if(data[data.length-1] == '\n')
		data = data.substring(0,data.length-1);
	if(data[data.length-1] != ',')
		console.log("should throw an error, doesn't end in ,='"+data[data.length-1]+"'");
	
	if(pubkey != pubk)
		console.log("public keys differ. Should throw exception");
	
	data = data.substring(0,data.length-1);
	console.log(nacl.util);
	console.log(nacl);
	console.log(CryptoJS);
	var sigbit = nacl.util.decodeBase64(signature);
	
	console.log("pubkey ='"+pubkey+"'");
	if(pubkey[pubkey.length-1] == '\n'){
		pubkey = pubkey.substring(0,pubkey.length-1);
		console.log("pubkey last was '\n'");
	}

	var pubHex = CryptoJS.enc.Hex.parse(pubkey);
	console.log("pubhex="+pubHex);
	var pub64 = pubHex.toString(CryptoJS.enc.Base64);	
	console.log("pub64="+pub64);	
	var testpub ="VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIDEzIGxhenkgZG9ncy4=";	
	var pubbit = nacl.util.decodeBase64(testpub);
	
	var databit = nacl.util.decodeUTF8(datatxt);
	console.log("sigbit="+sigbit);
	console.log("pubbit="+pubbit+" len="+pubbit.length);	
	
	console.log(nacl.sign.open(databit,pubbit));
	console.log("verify signature="+nacl.sign.detached.verify(databit,sigbit,pubbit));

	datajson = $.parseJSON(data);
	
	console.log(bsk2);
	console.log(pubk);
	console.log(signature);
	console.log(datalen);
	console.log(data);
	console.log(data.length);
	console.log(datajson); 
	/*if(parts.length !=4)
		throw Exception("signedjson didn't split to 4 parts");
	if(parts[0] != "bsk2")
		throw Exception("signed file didn't start with bsk2.");
	
	var jsonpub = parts[1];
	var jsonsig = parts[2];
	var datatxt = parts[3];
	var [datalen,data] = datatxt.split(":",1);
	
	if(jsonpub != pubkey)
		throw Exception("public keys differ");	
	console.log(parts);
	console.log(datatxt);
	console.log(datalen);
	console.log(data);
	*/			
}
function getTestXML(filename){
	xmlStr = getURL("POST",filename);
	xmlStr = removeXMLWhitespaces(xmlStr);

	return xmlStr;
}
function removeXMLWhitespaces(xmlStr){
	xmlStr = xmlStr.replace(/\n*/g, "")
		.replace(/[\s* ]+\</g, "<")
		.replace(/\>[\s* ]+\</g, "><")
		.replace(/\>[\s* ]+$/g, ">")
		.replace(/\u200B/g,'');
	return xmlStr;
}
function verifyResponse(response){
	// remove whitespaces etc	
	var response2 = removeXMLWhitespaces(response);
	
	// parse to XML and get various data
	var xml = $.parseXML(response2);
	var returns = $(xml).find("return");
	var objectsHash = $(returns).attr("objectsHashed");
	
	var hashSigned64 = $(returns).attr("hashSigned");
	var hashSigned = nacl.util.decodeBase64(hashSigned64);
		
	var objectsOuter = $(xml).find("Objects").prop("outerHTML");	
	console.log(objectsOuter);
	
	var pub64 = "25X+V4A6uVqXM/CQqKjQKikqvzYDA0Hd27dfXCDH4+s=";
	var pubkey = nacl.util.decodeBase64(pub64);

		
	var jsHash64 = CryptoJS.SHA512(objectsOuter).toString(CryptoJS.enc.Base64);
	var jsHash = nacl.util.decodeBase64(jsHash64);
		

	var signOpened = nacl.sign.open(hashSigned,pubkey);
	
	console.log(nacl);
	console.log("objectsHash="+objectsHash);
	console.log("jsHash64="+jsHash64);
	console.log("signOpened="+signOpened);
	console.log($(returns).prop("outerHTML"));
	console.log("hashSigned64="+hashSigned64);
	
	console.log("verify jhash vs hashSigned="+nacl.sign.detached.verify(jsHash,hashSigned,pubkey));

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
		parseProfileJson(request.searchId,results);
		reloadParseOmiJson();
		sendResponse(results);
	}
	else if (request.omiNodeUrl){
		console.log("open url request");
		chrome.tabs.create({ url: request.omiNodeUrl },function(tab){
			// save the current tab id
			chrome.storage.local.set({"tabId":tab.id});
			// execute content scripts
			chrome.tabs.executeScript(tab.id,{file:"jquery-3.2.1.js"},function(){
				chrome.tabs.executeScript(tab.id, {file: "content.js"}, function(){
            				chrome.tabs.sendMessage(tab.id, {greeting:"HEELLLOO"});
        			});
			});					
		});
	}
	else if(request.verifyResponse){
		chrome.storage.local.get("tabId",function(objects){
			chrome.tabs.sendMessage(objects.tabId,{getResponse:"true"},verifyResponse);						
		});
	}
	else if(request.omiNodeLoaded){
		console.log("content.js loaded");	
	}
	
});
