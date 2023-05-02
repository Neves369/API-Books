import jwt from 'jsonwebtoken';

const authMiddleware: any = (req: { headers: { permitir: any; }; userId: any; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { erro: string; }): void; new(): any; }; }; }, next: () => void) => {
    const authHeader = req.headers.permitir;
    
    if(!authHeader){
        return res.status(401).send({erro: "Token não informado " });
    }

    const parts = authHeader.split(" ");

    if(!(parts.length === 2)){
        return res.status(401).send({erro: "Erro no Token" });
    }

    const [ scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({erro: "Token com formato inválido" });
    }

    const secret = process.env.SECRET ? process.env.SECRET : '';

    jwt.verify(token, secret, (err: any, decoded: any) => {
        if(err) return res.status(401).send({erro: "Token inválido"});

        req.userId = decoded.id;
        return next();
    })

   
    
    
}

export default authMiddleware;
