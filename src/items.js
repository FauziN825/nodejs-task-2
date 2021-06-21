const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const port = 3000

const saveData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('dbUser.json', stringifyData)
}
//get the user data from json file
const getUserData = () => {
    const jsonData = fs.readFileSync('dbUser.json')
    return JSON.parse(jsonData)    
}

router.use('/', function (req, res, next){
    console.log('Time: ', Date())
    console.log('Request URL: ', req.originalUrl)
    console.log('Request Type: ', req.method)
    next()
})

router.get('/', (req, res) => {
    const users = getUserData()
    res.send(users)
})

router.get('/list/:id', (req,res) => {
    const items = getUserData()
    const accountid = Number(req.params.id)
    // console.log(req.params.id)
    const getUserId = items.find((userid) => userid.id === accountid);
    if (!getUserId) {
        res.status(500).send('User Id not found.')
      } else {
        res.json(getUserId);
      }
    
})


router.post('/', (req, res) => {
    //get the existing user data
    const existUsers = getUserData()
    
    //get the new user data from post request
    const userData = req.body
    console.log(userData)
    //check if the userData fields are missing
    if (userData.id == null || userData.name == null || userData.age == null || userData.address == null) {
        return res.status(401).send({error: true, msg: 'User data missing'})
    }
    
    //check if the username exist already
    const findExist = existUsers.find( id => id.id === userData.id )
    if (findExist) {
        return res.status(409).send({error: true, msg: 'id already exist'})
    }
    //append the user data
    existUsers.push(userData)
    //save the new user data
    saveData(existUsers);
    res.send({success: true, msg: 'User data added successfully'})
})


router.delete('/delete/:id?', (req, res) => {
    const userid = req.params.id
    console.log(userid)

    
    //get the existing userdata
    const existUsers = getUserData()
    console.log(existUsers)
  
    // //filter the userdata to remove it
    let filterUser = existUsers.filter( (x) => x.id != userid )
    console.log(filterUser)

    
    if ( existUsers.length === filterUser.length ) {
        return res.status(409).send({error: true, msg: 'id does not exist'})
    }
    saveData(filterUser)
    res.send({success: true, msg: 'User removed successfully'})
    
})



router.get('/search', (req, res, next) => {
    const data = getUserData()
    
    const filters = req.query;

    const filteredUsers = data.filter(user => {

        for (key in filters) {
            searchRegExp = new RegExp(filters[key] , 'i');
            return searchRegExp.test(user[key]);
        }
    });
    res.send(filteredUsers);
});

module.exports = router