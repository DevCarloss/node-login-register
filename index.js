const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const bcrypt = require('bcryptjs')
const conexao_db = require('./db/conexao_db')

// Componentes
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Login 
app.post('/login',(req,res) => {
    res.set({'Content-Type': 'application/json'})
    var token = req.header('Authorization')
    if (token == process.env.SECRET_KEY){
        const bodyUser = req.body['username']
        const bodyPassword = req.body['password']
        const checkUsername = 'SELECT * FROM register WHERE username = ' + '"' + bodyUser + '"'
        conexao_db.query(checkUsername,(err,results) => {
            if(err){
                console.log('Mysql ' + err.stack)
                res.status(500)
                return
            }
            else {
                if(results.length == 0){
                    res.status(404).send('Usuario e Senha Invalídos')
                    return
                }
                else {
                    const userdbpassword = results.find(item => item)
                    bcrypt.compare(bodyPassword,userdbpassword.password,(err,sucess) => {
                        if(err){
                            console.log('Bcrypt Compare ' + err.stack)
                            res.status(500)
                            return
                        }
                        else {
                            if(sucess){
                                res.status(200).send('Usuario Logado Com Sucesso')
                                return
                            }
                            else {
                                res.status(404).send('Usuario e Senha Invalídos')
                                return
                                
                            }
                        }
                    })
                }
            }
        })
    }
    else {
        return res.status(401).send({'Erro': 'Token Invalído'})
    }
    
})
// Registro
app.post('/registro',(req,res) => {
    res.set({'Content-Type': 'application/json'})
    var token = req.header('Authorization')
    const bodyUser = req.body['username']
    const bodyPassword = req.body['password']
    const bodyEmail = req.body['email']
    if(token == process.env.SECRET_KEY){
       const checkUsername = 'SELECT * FROM register WHERE username = ' + '"' + bodyUser + '"'
       conexao_db.query(checkUsername,(err,results) => {
        if(err){
            console.log('Mysql ' + err.stack)
            res.status(500)
            return
        }
        else {
            if(results.length == 0){
                const checkEmail = 'SELECT * FROM register WHERE email = ' + '"' + bodyEmail + '"'
                conexao_db.query(checkEmail,(err,results) => {
                    if(err){
                        console.log('Mysql ' + err.stack)
                        res.status(500)
                        return
                    }
                    else {
                      if(results.length == 0){
                          const hashPassword = bcrypt.hash(bodyPassword,10)
                          hashPassword.then((hash) => {
                            const createUser = 'INSERT INTO register VALUES' + '(' + '"' + bodyUser + '"' + ',' + '"' + bodyEmail + '"' + ',' + '"' + hash + '")'
                            conexao_db.query(createUser,(err,result) => {
                                if(err){
                                    console.log('Mysql ' + err.stack)
                                    res.status(500)
                                    return
                                }
                                else {
                                    res.status(200).send('Usuario Cadastrado Com Sucesso')
                                    return
                                }
                            })
                          })
                          hashPassword.catch((err) => {
                            console.log('Hash ' + err.stack)
                            res.status(500)
                            return
                          })
                          
                      }
                      else {
                        res.status(409).send('Email Cadastrado')
                        return
                      }
                    }
                })
            }
            else {
                res.status(409).send('Usuario já cadastrado')
                return
            }
        }
        }) 
   }
   else {
     return res.status(401).send({'Erro': 'Token Invalído'})
   }
})
// Executar A API
app.listen(process.env.PORT || 3000,() => {
    console.log('API Rodando')
})