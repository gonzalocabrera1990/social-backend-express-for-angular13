var User = require("../models/users");

const helpers = {}

helpers.testUsers = async (param) => {
    let username = param;   
    let result = await User.findOne({ usuario: username })
    if(!result){
      return new Promise((resolve, reject)=>{
        resolve(username)
      })
    } else {
      let change = username.split('').slice(-1);
      return helpers.testUsers(`${username}${change}`)
    }
  }

helpers.getUsuario = async (test) => {
    let userTest = test.split('@')[0];
    let result = await helpers.testUsers(userTest);
    return new Promise((resolve, reject)=>{
      resolve(result)
    })
  }

helpers.randomNumber = (len) => {
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    let setRandomNumber = 0;
    for (let i = 0; i < len; i++) {
      setRandomNumber += possible.charAt(
            Math.floor(Math.random() * possible.length)
        );
    }
    return setRandomNumber;
};

helpers.measure = (timestamp) => {
    let begin = new Date(timestamp).getTime();
    let now = Date.now();
    let time = now - begin;
    const hours = (Math.floor((time)/1000))/3600;
    return hours;
}

helpers.scopeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = helpers;