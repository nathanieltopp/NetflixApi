const jwt = require("jsonwebtoken");

function auth(req, res, next){
    const authHeader = req.headers.token;

    if(!authHeader) return res.status(401).json("You are not authenticated");

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
        if(error) return res.status(403).json("Invalid token");
        req.user = user;
        next();
    });
}

module.exports = auth;