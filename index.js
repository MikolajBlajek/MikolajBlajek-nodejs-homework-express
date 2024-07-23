import 'dotenv/config';
import express from 'express';  
import devRoutes from './routes/dev.js'

const app = express();  

app.use('/dev', devRoutes); 

app.get('/main', (req, res) => { 
    res.send('<h1>Hello</h1>')
})
 
app.listen(process.env.PORT, () => console.log('server is running on port', process.env.PORT))