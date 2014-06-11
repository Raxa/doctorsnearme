/**
 * Created by Amaya on 6/7/2014.
 */
var mysql = require('mysql');
var config = require('./config.json');

function connect(){
    var connection = mysql.createConnection(({
        host:config.host,
        user:config.user,
        password:config.password,
        database:config.database
    }));

    connection.connect(function(err){
        console.log(err);
    });

    return connection;
}

function like(response, data){

    var userId = data.user;
    var locationId = data.location;
    var like = data.like;

    var connection = connect();

    var strQuery = "INSERT INTO likes (openmrs_uuid, location_id, status) VALUES ('"+userId+"','"+ locationId+"',"+ like+") ON DUPLICATE KEY UPDATE status="+like;

    connection.query(strQuery, function(err, result){
        if(err){
            setResponseHeaders(response);
            response.write("error");
            response.end();
            console.log("error..........");
            throw err;
        }
        else{
            setResponseHeaders(response);
            response.write(JSON.stringify(result));
            response.end();
            console.log(result);
        }
        connection.end();

    });

}

function comment(response,data){
    console.log("inside comment");
    var userId = data.user;
    var locationId = data.location;
    var comment = data.comment;

    var connection = connect();

    var strQuery ="INSERT INTO comments (openmrs_uuid, location_id, comment) VALUES ('"+userId+"','"+ locationId+"','"+ comment+"')";

    connection.query(strQuery, function(err, result){
        if(err){
            setResponseHeaders(response);
            response.write("Error");
            response.end();
            console.log("error..........");
            throw err;
        }
        else{
            setResponseHeaders(response);
            response.write(JSON.stringify(result));
            response.end();
            console.log(result);
        }
        connection.end();;

    });
}

function getLikes(response,data){
    console.log("inside getlikes");
    console.log(data);
    var locationId = data.location;
    console.log("loc id: "+locationId);
    var connection = connect();

    var strQuery = "SELECT COUNT(*) AS count FROM likes WHERE location_id='"+locationId+ "' && status = 1";

    connection.query(strQuery, function(err, result){
        if(err){
            setResponseHeaders(response);
            response.write("error");
            response.end();
            throw err;

        }else{
            setResponseHeaders(response);
            response.write(JSON.stringify(result[0]));

            response.end();
            console.log(result[0].count);

        }

        connection.end();

    });
}

function getComments(response,data){
    var locationId = data.location;
    console.log("location: "+locationId);
    var connection = connect();

    var strQuery = "SELECT comment FROM comments WHERE location_id ='"+ locationId+"'";

    connection.query(strQuery, function(err, result){
        if(err){
            setResponseHeaders(response);
            response.write("Error");
            response.end();
            throw err;

        }else{
            console.log(JSON.stringify(result));
            setResponseHeaders(response);
            if(result.length!=0)
            {
                response.write(JSON.stringify(result));
            }
            else{
                response.write("Empty result");
            }
            response.end();

        }

        connection.end();

    });
}

function checkLike(response,data){
    var userId = data.user;
    var locationId = data.location;

    var connection = connect();

    var strQuery = "SELECT status FROM likes WHERE openmrs_uuid='"+userId+"' && location_id='"+locationId+"'";

    connection.query(strQuery, function(err, result){
        if(err){
            setResponseHeaders(response);
            response.write("Error");
            response.end();
            throw err;

        }else{
            console.log(result);
            setResponseHeaders(response);
            if(result.length!=0)
            {
                response.write(JSON.stringify(result[0]));
            }
            else{
                response.write("Empty result");
            }
            response.end();
        }

        connection.end();

    });
}

function setResponseHeaders(response){
    response.setHeader('Access-Control-Allow-Origin','*');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
    //response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
}

exports.like = like;
exports.comment=comment;
exports.getLikes = getLikes;
exports.getComments = getComments;
exports.checkLike = checkLike;