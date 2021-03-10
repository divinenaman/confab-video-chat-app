function checkAuth(req,res,next){
  
    if(req.isAuthenticated()){
          console.log("Auth true")
          next()
      }
      else{
          res.redirect('/login')
      }
}

module.exports = checkAuth