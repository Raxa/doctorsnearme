/**
 * Created by Amaya on 6/7/2014.
 */

var server = require("./server");
var router = require("./router");
var databaseService =  require("./databaseService");

var handle = {};

handle["/like"] = databaseService.like;
handle["/comment"] = databaseService.comment;

server.start(router.route, handle);