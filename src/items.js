const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const port = 3000

const saveData = (data) => {
    const stringifyData = JSON.stringify(data,null,2)
    fs.writeFileSync('dbUser.json', stringifyData)
}

const getUserData = () => {
    const jsonData = fs.readFileSync('dbUser.json')
    return JSON.parse(jsonData)    
}


router.get('/', (req, res) => {
    const users = getUserData()
    res.send(users)
})

router.get('/list/:id', (req,res) => {
    const items = getUserData()
    const accountid = Number(req.params.id)
    const getUserId = items.find((userid) => userid.id === accountid);
    if (!getUserId) {
        res.status(500).send('User Id not found.')
      } else {
        res.json(getUserId);
      }
    
})


router.post('/', (req, res) => {
    const existUsers = getUserData()
    const userData = req.body
    console.log(userData)
    if (userData.id == null || userData.name == null || userData.age == null || userData.address == null) {
        return res.status(401).send({error: true, msg: 'User data missing'})
    }
    
    const findExist = existUsers.find( id => id.id === userData.id )
    if (findExist) {
        return res.status(409).send({error: true, msg: 'id already exist'})
    }
    existUsers.push(userData)
    saveData(existUsers);
    res.send({success: true, msg: 'User data added successfully'})
})


router.delete('/delete/:id?', (req, res) => {
    const userid = req.params.id
    console.log(userid)

    const existUsers = getUserData()
    console.log(existUsers)
  
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
    
    if (filteredUsers.length == 0) {
        res.status(404).send({error: true, msg: 'Data Not Found'})
    }else{
        res.send(filteredUsers);
    }
    
});

module.exports = router