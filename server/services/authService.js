const  passport  =  require('passport');



//  function  isLoggedIn  (req, res, next)  {
//     if(req.isAuthenticated()){
//         return next()
//     }
//     return res.status(400).json({"statusCode" : 400, "message" : "not authenticated"});
// };

// const auth = () => {
//     return (req, res, next) => {
//         passport.authenticate('local', (error, user, info) => {
//             //if(error)
//           return   res.status(400).json({"statusCode" : 400 ,"message" : "problem mister"});
//             // req.login(user, function(error) {
//             //     if (error) return next(error);
//             //     next();
//             // });
//         })(req, res, next);
//     }
// };

//module.exports={auth};