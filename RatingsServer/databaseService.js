/**
 * Created by Amaya on 6/7/2014.
 */
var mysql = require('mysql');

function connect(host,user,password,database){
    var connection = mysql.createConnection(({
        host:host,
        user:user,
        password:password,
        database:database
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
     
     var connection = connect('localhost','root','123','ratingsdb');

    var strQuery = "select * from ratingsandcomments";

    connection.query(strQuery, function(err, rows){
        if(err){

            throw err;

        }else{
            console.log(rows);
        }


    });
connection.end();

}

function comment(response,query){

}

exports.like = like;
exports.comment=comment;