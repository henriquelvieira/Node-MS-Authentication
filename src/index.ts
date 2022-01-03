import express, {Request, Response, NextFunction} from "express";

const APP = express();
const PORT = 3000 || 3333;

APP.get('/status', (req: Request, res: Response, next: NextFunction) => {
    console.log('Chamada da rota /status')
    res.status(200).send({foo: 'bar'}); //Responder a requisição c/ o Status 200

});

APP.listen(PORT, () => {
    console.log('Aplicação em execução na porta ' + PORT)    
});

 