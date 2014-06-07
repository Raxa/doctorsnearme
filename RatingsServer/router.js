/**
 * Created by Amaya on 6/7/2014.
 */

function route(handle, pathname, response, query){
console.log("About to route a request for "+pathname);

if(typeof handle[pathname]=='function'){
	handle[pathname](response,query);
}else{
	console.log("No request handler found for "+pathname);
	return "404 Not found";
}
}

exports.route = route;