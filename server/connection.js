const mongoose = require('mongoose')

const connectMongo = (url) =>{
    mongoose.connect(url)
    .then(()=>console.log('Mongodb Connected'))
    .catch((err) => console.log(err))
}

module.exports = connectMongo;
