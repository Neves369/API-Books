const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.permitir;
    
    if(!authHeader){
        return res.status(401).send({erro: "Token não informado " });
    }

    const parts = authHeader.split(" ");

    if(!parts.length === 2){
        return res.status(401).send({erro: "Erro no Token" });
    }

    const [ scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({erro: "Token com formato inválido" });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err) return res.status(401).send({erro: "Token inválido"});

        req.userId = decoded.id;
        return next();
    })

   
    
    
}