const mysql = require ('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const { json } = require('body-parser');

app.use(cors());
app.use(bodyparser.json())

var mysqlConnection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'excellence_technologies',
    multipleStatements: true
})

mysqlConnection.connect((err)=>{
    if(!err)
    console.log("DB connection succeded");
    else
    console.log("Connection Failed \n Error", JSON.stringify(err,undefined,2) );
});
app.listen(4000, ()=> console.log("Express Server Is Running"));

app.get('/candidate', (req,res)=>{
    mysqlConnection.query('SELECT name, email , MAX(first_round + second_round + third_round) AS result from candidate INNER JOIN test_score ON candidate.id = test_score.test_id  ' , (err, rows)=>{
        if(err){
            return err;
        }else{
            const temp = rows ;
            console.log("temp",temp);
            return res.json({
                data:rows
            })
        }
    })
});


app.post('/candidate', (req,res)=>{
    var sql = 'INSERT INTO candidate (id,name,email) VALUES (?,?,?)'
    mysqlConnection.query(sql,[req.body.id,req.body.name,req.body.email], (err)=>{
        if(!err)
            res.send('Inserted Successfully');
        else
            console.log(err);
    })
});

app.post('/test_score', (req,res)=>{
    var sql = 'INSERT INTO test_score (test_id,first_round,second_round,third_round,id) VALUES (?,?,?,?,?)'
    mysqlConnection.query(sql,[req.body.test_id,req.body.first_round,req.body.second_round,req.body.third_round,req.body.id], (err)=>{
        if(!err)
            res.send('Inserted Successfully');
        else
            console.log(err);
    })
});