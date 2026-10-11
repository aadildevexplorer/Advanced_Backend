const express = require('express')
require('dotenv').config()

const app = express()
const PORT = 8080

app.get('/' , (req , res) => {

    res.json({msg : "AI 0.1"})

})

app.listen(PORT , () => {

    console.log('server running')

})