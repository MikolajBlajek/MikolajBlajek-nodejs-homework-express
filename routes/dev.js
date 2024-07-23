import {Router} from 'express';  
import email from '../modules/email.js'
 
const route = Router(); 

route.post('/send-email', async (req, res, next) => {  

    try {
        await email('test', 'welcome', 'mikolajblajek@gmail.com')
    } catch (error) {
        console.log(err) 
        return next(err);
    } 

    res.send('ok')
})
 
export default route; 

