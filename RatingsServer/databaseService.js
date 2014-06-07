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

 function rate(response, query){

     var connection = connect('localhost','root','123','testdb');

    var strQuery = "select * from firsttable";

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

exports.rate = rate;
exports.comment=comment;