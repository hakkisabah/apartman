const express = require('express')
const fileUpload = require('express-fileupload');
const helmet = require('helmet')
const cors = require('cors')
const {getItems,addItem,updateItem,deleteItem} = require('./src/s3')
const {login,checkLogin,verifyToken, checkAdminLogin } = require('./src/login')
const app = express()
const bodyParser = require('body-parser')
const expressBearerToken = require('express-bearer-token')

const corsOpts = {
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
};
app.use(helmet())
app.use(cors(corsOpts));
app.use(expressBearerToken())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json())
// default options
app.use(fileUpload());

app.post('/aptapi/additem',checkAdminLogin, addItem)
app.post('/aptapi/updateitem',checkAdminLogin, updateItem)
app.post('/aptapi/deleteitem',checkAdminLogin, deleteItem)
app.post('/aptapi/user/login',login)
app.post('/aptapi/user/verifytoken',verifyToken)
app.get('/aptapi/getitems',checkLogin, async (req,res)=>{
  const items = await getItems()
  return res.status(200).json(items)
})

module.exports = app