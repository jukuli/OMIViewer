function testCrypto(){
/*
var keys ={};
crypto.subtle.generateKey({name: "ECDSA", namedCurve: "P-256"}, false, ["sign"])
.then(function(k){keys = k;
console.log(keys);

crypto.subtle.exportKey("jwk", keys.publicKey).then(function(jwk){console.log(JSON.stringify(jwk))})
crypto.subtle.exportKey("raw", keys.publicKey).then(function(raw){
var res = ""; var buf = new Uint8Array(raw); buf.forEach(function(octet){res += String.fromCharCode(octet)}); console.log(btoa(res))
})


})
*/


var testkey = "BLdNhWxy4ZT/gleH0+OyYBF6tXBSoEWdKiNJQ+g6hWVUMjW1pwC8VxeX9PAlbXyYLVG4JjeTXfqOP4wcQ6SZbJY="
var testkeyAB = str2ab(atob(testkey));
var publicKey = "cx>6]*\R,OptU";
var publicKeyB64 = "9GMLeLLOxz42XSr1XJWkUvmy7fvl/5AsD7xP9elwdFU=";
var pubKey = CryptoJS.enc.Base64.parse(publicKeyB64);
var publicKeyAB = str2ab(atob(publicKeyB64));
var pubKeyI = str2ab(atob(pubKey));

console.log(publicKeyAB);
console.log("pubKey="+pubKey);
console.log(testkeyAB);
console.log(pubKeyI);
window.crypto.subtle.importKey(
    "raw",
    testkeyAB,
    {   //these are the algorithm options
        name: "ECDSA",
        namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["verify"] //"verify" for public key import, "sign" for private key imports
)
.then(function(publicKey){
    //returns a publicKey (or privateKey if you are importing a private key)
	console.log("TOIMIIPASKA");
    console.log(publicKey);
})
.catch(function(err){
	
    console.error(err.name + "  "+err.code);
});
}
function bin2String(array) {
  return String.fromCharCode.apply(String, array);
}
function string2Bin(str) {
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return result;
}

function axlsigntest(){
	console.log(axlsign);
	var randomVal = new Uint8Array(32);
	window.crypto.getRandomValues(randomVal);
	var keyPair = axlsign.generateKeyPair(randomVal);
	console.log(keyPair.private);
	console.log(keyPair.public);

	var private64 ="sPFpxfZXJOPqWHuO5Xm2LvHIVNfP3smjusy/hCBIslQ=";
	var public64 = "9GMLeLLOxz42XSr1XJWkUvmy7fvl/5AsD7xP9elwdFU=";	
	
	var priv = str2ab(atob(private64));
	var pub = str2ab(atob(public64));
	console.log("private="+atob(private64));
	console.log("public="+atob(public64));	

	var hash = "64e7b72d4ddf9414e7e2c2d698e4aa1587d0e59500dad7f356bda6258568ba5f2b83964dac250a4d369bb6634da008684b651dcbdd243301aae5f3bc260d4049";

	var testString = getTestXML("test.xml");
	var mes = hash;
	var message = str2ab(mes);
	
	var cryptd = axlsign.signMessage(priv,message);
	var decryptd = axlsign.openMessage(pub,cryptd);
	var decryptmes = bin2String(decryptd);	

	var signed64="PlJekYnjA+TaEVZMjvkjzSco2HpOJHsq34ukSbYsBRwfovDA3CpiG/yJ72dt0Cgz+uh7dQeejO3+kXy9YrT4gw==";
	var signednorm = "[B@7b671daa";	
	var signed = str2ab(atob(signed64));
	var signed2 = str2ab(signednorm);
	var decryp2 = axlsign.openMessage(pub,signed);
	var decryp2mes = bin2String(decryp2);	

	
	console.log(mes);
	console.log(message);
	console.log(cryptd);
	console.log(btoa(bin2String(cryptd)));	
	console.log(decryptd);
	console.log(decryptmes);
	console.log(decryp2);
	console.log(decryp2mes);	
	//console.log(btoa(bin2String(keyPair.public)));

/*
	var signed64 = "rqUzlkU6n0zqZX5lisFCYofbuDXkqjJXIL6O3nNv2vpf4ivh+XbGJUawl+SVicJUIri2g9ESvrn/PtOK9zmUhg==";
	var signedHash = CryptoJS.enc.Base64.parse(signed64);
	var signedAB = str2ab(atob(signedHash));
	var private64 ="sPFpxfZXJOPqWHuO5Xm2LvHIVNfP3smjusy/hCBIslQ=";
	var public64 = "9GMLeLLOxz42XSr1XJWkUvmy7fvl/5AsD7xP9elwdFU=";	
	var publick = CryptoJS.enc.Base64.parse(public64);
	var privatek = CryptoJS.enc.Base64.parse(private64);	
	var public64AB = str2ab(atob(private64));	
	var private64AB = str2ab(atob(public64));	
	
	console.log(publick);
	console.log(privatek);
	console.log(public64AB);
	console.log(private64AB);

	var message = str2ab(atob("test"));
	var crypted = axlsign.signMessage(private64AB,message);
	var decrypted = axlsign.openMessage(public64AB,crypted);
	
	console.log(crypted);		
	console.log(decrypted);
*/	
}
function ed2curveTest(){
	console.log(nacl);
	console.log(nacl.util);
	console.log(CryptoJS);	
	/*console.log(ed2curve);
	var private64 ="sPFpxfZXJOPqWHuO5Xm2LvHIVNfP3smjusy/hCBIslQ=";
	var public64 = "9GMLeLLOxz42XSr1XJWkUvmy7fvl/5AsD7xP9elwdFU=";	
	
	var priv = str2ab(atob(private64));
	var pub = str2ab(atob(public64));

	var pubcur = ed2curve.convertPublicKey(pub);
	console.log(pubcur);
	console.log("private="+atob(private64));
	console.log("public="+atob(public64));	
*/
	var keyPair = nacl.sign.keyPair();
	console.log(keyPair);
	console.log(nacl.util.encodeBase64(keyPair.publicKey));
	console.log(nacl.util.encodeBase64(keyPair.secretKey));
	

	
	var nacpubs = "25X+V4A6uVqXM/CQqKjQKikqvzYDA0Hd27dfXCDH4+s=";
	var nacpub2 = nacl.util.decodeBase64(nacpubs);

	console.log(nacpub2);
	
	var nacprivs = "AYpRDqv26395JcnW1fHOlvkI6435CfoWGAjOfHz/nQPblf5XgDq5Wpcz8JCoqNAqKSq/NgMDQd3bt19cIMfj6w==";
	var nacpriv = str2ab(atob(nacprivs));
	var nacpriv2 = nacl.util.decodeBase64(nacprivs);
	console.log(nacpriv);
	console.log(nacpriv2);
		

	//var hashs ="Glg8EiY8rk+B+kphJ3aTQ9MVyrgsxfyscoKSS/7ytoDvVfTWjn5xsovkPZmHJkDjEYCq7h7l/nBYwbF82BxkZg==";
	
	var testString = "testi";
	var testHash = CryptoJS.SHA512(testString).toString(CryptoJS.enc.Base64);
	var testHash64 = CryptoJS.enc.Hex.parse(testHash);
	console.log(testHash);
	
	var nachash2 = nacl.util.decodeBase64(testHash);
	//nachash2 = str2ab("testi");
	console.log(nachash2);	

	/*
	var nacsigs = "mLW2o8h42m6tbYlwuNYTVLSszuh65h2HLYgT/H104vT1ZnZP7NAxmg1z6ulCEJUB+28/8imkvq3xDy9/rXSsAA==";
	var nacsig = str2ab(atob(nacsigs));
	var nacsig2 = nacl.util.decodeBase64(nacsigs);
	console.log(nacsig);
	console.log(nacsig2);
*/

	//var unsigned = nacl.sign.open(nacsig,nacpub);
	//console.log(unsigned);
	//console.log(nacl.verify(nacsig,nachash,nacpub));
	var signed = nacl.sign.detached(nachash2,nacpriv2);
	console.log(signed);
	console.log(nacl.util.encodeBase64(signed));
	console.log(nacl.sign.detached.verify(nachash2,signed,nacpub2));
	/*
	var hash = "23493a4564180de096cc06f92736bb00f4d44e153bf955204d228f04f93a8e559737e21e99982bc32ee4f5c65cc37a6f64d3a99959d2c8eaf2d7f4a72dce92ac"

	var testString = getTestXML("test.xml");
	var mes = "testi";
	var message = str2ab(mes);
	
	var signednorm = "[B@4e7f334b";	
	var signed2 = str2ab(signednorm);
	
	var mess = nacl.sign.open(signed2,pub);
	//var nacsign = nacl.sign(message,priv);
	console.log(mess);
	//console.log(nacsign);
	*/
}
function str2ab(str) {
  var arrBuff = new ArrayBuffer(str.length);
  var bytes = new Uint8Array(arrBuff);
  for (var iii = 0; iii < str.length; iii++) {
    bytes[iii] = str.charCodeAt(iii);
  }
  return bytes;
}

