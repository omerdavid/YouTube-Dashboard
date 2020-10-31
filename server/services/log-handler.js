
const logger ={
    log:(msg)=>{
       console.log(`log not implementd ${msg}`)
    },
   
    debug:(obj=null,msg='')=>{
      console.log(`log :${msg}`,!obj?'':obj);
    }
} //require('pino')()
 




module.exports = logger;
