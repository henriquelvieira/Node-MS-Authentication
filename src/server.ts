import { app } from './app';

const PORT = process.env['PORT'] || 3333;

 //Inicialização do Servidor:
app.listen(PORT, () => {
    console.log(`Server is running on port  ${PORT}`);
});


