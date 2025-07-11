const express= require('express')
const app= express()
app.disable('x-powered-by'); // Prevents information exposure through headers
require ('dotenv').config()
const cors= require('cors')

const playlistRoutes= require('./routes/playlistRoutes')
const port= 3000

app.use(cors())
app.use(express.json())

    
app.use('/api',playlistRoutes)
    
app.listen(port, ()=>{
    console.log(`server is running on port: ${port}...`)
})
