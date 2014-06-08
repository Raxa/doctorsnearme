/**
 * Created by Amaya on 6/7/2014.
 */
var mysql = require('mysql');
var config = require('./config.json');

//function connect(host,user,password,database){
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

    var strQuery = "select userID,locationID from ratingsandcomments where userID="+userId+" && locationID="+locationId;
    var strQuery1;
    connection.query(strQuery, function(err, rows){
        if(err){
            setResponseHeaders(response);
            response.write("error");
            response.end();
            throw err;

        }else{
            console.log(rows);
            if(rows.length==0){
                console.log('rows.length: '+rows.length);
                strQuery1="insert into ratingsandcomments set userID ="+ userId+", locationID="+locationId+", likes="+like;
                connection.query(strQuery1, function(err, result){
                    if(err){
                        setResponseHeaders(response);
                        response.write("error");
                        response.end();
                        throw err;

                    }else{
                        setResponseHeaders(response);
                        response.write(JSON.stringify(result));
                        response.end();
                        console.log(result);
                    }

                });
            }
            else{
                strQuery1="update ratingsandcomments set likes="+like+" where userID="+userId+" && locationID="+locationId;
                connection.query(strQuery1);
            }
        }
        connection.end();

    });
//connection.end();

}

function comment(response,data){
console.log("inside comment");
    var userId = data.user;
    var locationId = data.location;
    var comment = data.comment;

    var connection = connect();

    var strQuery = "select userID,locationID from ratingsandcomments where userID="+userId+" && locationID="+locationId;
    var strQuery1;
    connection.query(strQuery, function(err, rows){
        if(err){
            setResponseHeaders(response);
            response.write("error");
            response.end();
            console.log("error..........");
            throw err;

        }else{
            console.log("rows");
            console.log(rows);
            if(rows.length==0){
                console.log("rows.length 0");
                strQuery1="insert into ratingsandcomments set userID ="+ userId+", locationID="+locationId+", comments='"+comment+"'";
                connection.query(strQuery1, function(err, result){
                    if(err){
                        setResponseHeaders(response);
                        response.write("error");
                        response.end();
                        throw err;

                    }else{
                        setResponseHeaders(response);
                        response.write(JSON.stringify(result));
                        response.end();
                        console.log(result);
                    }

                });
            }
            else{
                console.log("rows.length not zero");
                strQuery1="update ratingsandcomments set comments='"+comment+"' where userID="+userId+" && locationID="+locationId;
                connection.query(strQuery1, function(err, result){
                    if(err){
                        setResponseHeaders(response);
                        response.write("error");
                        response.end();
                        throw err;

                    }else{
                        setResponseHeaders(response);
                        response.write(JSON.stringify(result));
                        response.end();
                        console.log(result);
                    }

                });
            }
        }
        connection.end();

    });
    //connection.end();
}

function getLikes(response,data){
    console.log("inside getlikes");
    console.log(data);
    var locationId = data.location;
    console.log("loc id: "+locationId);
    var connection = connect();

    var strQuery = "select count(*) from ratingsandcomments where locationID="+locationId+ " and Likes = 1";

    connection.query(strQuery, function(err, result){
        if(err){
            setResponseHeaders(response);
            response.write("error");
            response.end();
            throw err;

        }else{
            setResponseHeaders(response);
            response.write(JSON.stringify(result));
            response.end();
            console.log(result);

        }

        connection.end();

    });
}

function getComments(response,data){
    var locationId = data.location;
    console.log("location: "+locationId);
    var connection = connect();

    var strQuery = "select comments from ratingsandcomments where locationID ="+ locationId;

    connection.query(strQuery, function(err, result){
        if(err){
            setResponseHeaders(response);
            response.write("error");
            response.end();
            throw err;

        }else{
            console.log(JSON.stringify(result));
            setResponseHeaders(response);
            response.write(JSON.stringify(result));
            response.end();

        }

        connection.end();

    });
}

function checkLike(response,data){
    var userId = data.user;
    var locationId = data.location;

    var connection = connect();

    var strQuery = "select likes from ratingsandcomments where userID="+userId+" && locationID="+locationId;

    connection.query(strQuery, function(err, result){
        if(err){
            setResponseHeaders(response);
            response.write("error");
            response.end();
            throw err;

        }else{
            console.log(result);
            setResponseHeaders(response);
            response.write(JSON.stringify(result));
            response.end();
        }

        connection.end();

    });
}

function setResponseHeaders(response){
    response.setHeader('Access-Control-Allow-Origin','*');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
}

exports.like = like;
exports.comment=comment;
exports.getLikes = getLikes;
exports.getComments = getComments;
exports.checkLike = checkLike;