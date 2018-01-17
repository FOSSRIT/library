var callbackscriptdmdbase = document.createElement("script");
callbackscriptdmdbase.onload = function(){
 var apiCalldmdbase = document.createElement("script"); 
 apiCalldmdbase.type = "text/javascript"; 
 apiCalldmdbase.src = "//api.demandbase.com/api/v2/ip.json?key=b6b603b47ded9a3eff17c78423bbc773b9817cf6&callback=Dmdbase_CDC.callback"; 
 document.head.appendChild(apiCalldmdbase); 
}

callbackscriptdmdbase.type = "text/javascript"; 
callbackscriptdmdbase.src = "//scripts.demandbase.com/adobeanalytics/X4PVAXm1.min.js"; 
document.head.appendChild(callbackscriptdmdbase); 
