# Worst Movie API

API para processar e analisar premiações do Golden Raspberry Awards, identificando produtores com menores e maiores intervalos entre prêmios.

## 📌 Tecnologias Utilizadas
- **NestJS** - Framework para Node.js
- **TypeORM** - ORM para interação com banco de dados
- **SQLite** - Banco de dados utilizado nos testes
- **PostgreSQL** - Banco de dados para produção
- **FastCSV** - Leitura e processamento de CSV com streams
- **Workers & Batch Processing** - Para melhor performance no carregamento de dados
- **Caching** - Implementado para otimizar consultas frequentes

## 🏛 Arquitetura
Este projeto foi desenvolvido utilizando **Arquitetura Hexagonal**, garantindo um design modular e desacoplado, facilitando manutenção e extensibilidade. Além disso, foi projetado com foco em **alta performance**, utilizando **streams, workers, processamento em batch e caching**.

## 🚀 Instalação e Execução

### 1️⃣ Clonar o repositório:
```sh
 git clone https://github.com/Gabriel8579/worst-movie-api.git
 cd worst-movie-api
```

### 2️⃣ Instalar dependências:
```sh
npm install
```

### 3️⃣ Configurar variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto e configure suas variáveis conforme o exemplo abaixo:
```sh
PORT= 3000 # Porta em que o servidor irá executar

CSV_LOADER=fastcsv # O driver de CSV a ser utilizado (fastcsv ou worker)

# Opções do worker
WORKERS_BATCH_SIZE=10000 # Número de linhas que um worker irá processar por vez
WORKERS_POOL_SIZE=24 # Número de workers que serão criados para processar os dados

SQL_BATCH_SIZE=900 # Número de linhas que serão inseridas no banco de dados por vez, não exceder 900 por limitação do SQLite
```

### 4️⃣ Rodar a aplicação em modo desenvolvimento:
```sh
npm run start:dev
```

A API estará disponível em `http://localhost:3000`

### 5️⃣ Rodar a aplicação em produção:
```sh
npm run build
npm run start:prod
```

### 6️⃣ Executar os testes
Para rodar os testes E2E:
```sh
npm run test:e2e
```

## 📌 Endpoints

- `GET /producers/awards/intervals` → Retorna os produtores com maior e menor intervalo entre prêmios.

## 📁 Estrutura do Projeto

```
worst-movie-api/
│-- src/
│   │-- application/  # Casos de uso, services e factories
│   │-- domain/       # Entidades e interfaces
│   │-- infrastructure/  # Configurações, drivers e controllers
│   └── main.ts
│-- test/  # Testes automatizados
│-- .env.example  # Exemplo de variáveis de ambiente
│-- package.json  # Dependências do projeto
│-- README.md  # Documentação
```

---
💡 *Projeto desenvolvido com foco em modularidade, performance e escalabilidade!* 🚀

