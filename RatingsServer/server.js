/**
 * Created by Amaya on 6/7/2014.
 */

var http = require("http");
var url= require("url");

function start(route, handle){
	function onRequest(request,response){
        var postData = "";

        var parsed = url.parse(request.url);
        var pathname = parsed.pathname;

        var query = parsed.query;

        console.log("Request for "+pathname+"received.");
        console.log("got query: "+query);

        route(handle, pathname, query);

	}
	http.createServer(onRequest).listen(8888);
	console.log("Server has started");
}

exports.start = start;
