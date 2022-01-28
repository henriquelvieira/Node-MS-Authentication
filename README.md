# Node-MS-Authentication
Microservice criado em Nodejs

npm install --save-dev typescript
npm install --save-dev @types/node 
npm install --save express
npm install --save-dev @types/express
npm install --save-dev ts-node-dev
npm install --save http-status-codes

npm install --save pg
npm install --save-dev @types/pg

npm install --save dotenv
npm install --dev-save @types/dotenv
npm install --save ts-dotenv
npm install --save jsonwebtoken
npm install --save-dev @types/jsonwebtoken 
npm install --save dayjs
npm install --save @types/dayjs

JEST:
npm install --save-dev jest @types/jest ts-jest
jest --init

npm install --save-dev supertest @types/supertest

#Iniciar o TypeScript
tsc --init


#ESLINT
npm install --save-dev @typescript-eslint/eslint-plugin eslint @typescript-eslint/parser

npm install --save uuid
npm install --save-dev @types/uuid

npm install --save-dev prettier

npm install --save pino
npm install --save-dev @types/pino
npm install --save-dev pino-pretty


npm install --save config
npm install --save-dev @types/config


npm install --save express-pino-logger
npm install --save-dev @types/express-pino-logger

npm install --save cors
npm install --save-dev @types/cors


--BANCO DE DADOS POSTGRESQL
https://elephantsql.com

ROUTE:
--REPOSITORIE
---MODEL


Esqueci minha Senha:
	\forgot-password {username?, email?}	

* Validar se os campos necessários foram enviados na requisição
* Gerar código de segurança (UUID)
* Gerar password randomico
* Gravar código de segurança e nova senha na tabela
* Enviar por email

import { v4 as uuid } from 'uuid';


uuid();


Alterar senha:
	\reset_password {security_code: UUID, password: 123}

* Validar se os campos necessários foram enviados na requisição
* Validar se o código de segurança é válido (SELECT COUNT pelo security_code)
* Gravar a nova senha 
* Desbloquear o usuário
* Retornar o uuid do usuário