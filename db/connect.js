const mongoose = require('mongoose');
const ConnectDB = (uri)=>{
    console.log("Connect");
    
    return mongoose.connect(uri
    )
};

module.exports = ConnectDB;