const errorHandler=(err,req,res,next)=>{
console.error(err.stack);
res.status(500).json({message:"server error"})
};

module.exports=errorHandler;
