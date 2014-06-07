/**
 * Created by Amaya on 6/7/2014.
 */

var http = require("http");
var url= require("url");
var querystring = require("querystring");

function start(route, handle){
	function onRequest(request,response){
        var postData = "";

        var parsedUrl = url.parse(request.url);
        var pathname = parsedUrl.pathname;

        var parsedQuery = querystring.parse(parsedUrl.query);

        console.log("Request for "+pathname+"received.");
        console.log("got query: "+JSON.stringify(parsedQuery));
        console.log(parsedQuery.location);

        route(handle, pathname,response, parsedQuery);

	}
	http.createServer(onRequest).listen(8888);
	console.log("Server has started");
}

exports.start = start;
