# 🏗 Backend - API de Processamento de Pedidos

## 📌 Visão Geral
Este é o **backend NestJS**, responsável por gerenciar **pedidos, pagamentos e reembolsos** no sistema. Ele fornece APIs seguras para administrar o ciclo de vida dos pedidos.

## 🚀 Tecnologias Utilizadas
- **Node.js** (Runtime)
- **NestJS** (Framework)
- **TypeORM** (ORM para gerenciamento do banco)
- **PostgreSQL** (Banco de dados)
- **JWT Authentication** (Segurança)
- **Docker** (Opcional para desenvolvimento containerizado)

## 📂 Configuração do Projeto
Execute os seguintes comandos para configurar e iniciar o backend:

### **Instalação**
```bash
yarn install
```

### **Execução do Projeto**

#### Modo Desenvolvimento
```bash
yarn run start:dev
```

#### Modo Produção
```bash
yarn run start:prod
```

### **Variáveis de Ambiente**
Crie um arquivo `.env` com as configurações necessárias:

```env
DATABASE_URL=sua_url_do_banco
JWT_SECRET=sua_chave_jwt
PORT=3000
```

## 🔍 Endpoints da API

### Pedidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST   | /orders  | Criar um novo pedido |
| GET    | /orders?userId={userId} | Listar pedidos do usuário |
| GET    | /orders/{orderId} | Buscar detalhes do pedido |
| PUT    | /orders/{orderId}/status | Atualizar status do pedido (Apenas admins para SHIPPED) |
| POST   | /orders/{orderId}/pay | Simular pagamento do pedido |
| POST   | /orders/{orderId}/refund/request | Solicitar reembolso |
| PATCH  | /orders/{orderId}/refund | Aprovar ou negar reembolso (Apenas admins) |

## 🧪 Execução de Testes

### Testes Unitários
```bash
yarn run test
```

### Testes E2E
```bash
yarn run test:e2e
```

### Cobertura de Testes
```bash
yarn run test:cov
```

## 🚀 Implantação
Ao implantar em produção, certifique-se de:

- Definir corretamente as variáveis de ambiente
- Executar migrações do banco
- Usar um proxy reverso (exemplo: Nginx) para segurança
- Monitorar logs e seguir boas práticas

## 🛠 Contribuições & Suporte

Se quiser contribuir:

- Faça um fork do repositório
- Abra um Pull Request
- Siga os padrões de commits convencionais

Para suporte, junte-se à nossa Comunidade no Discord ou consulte a documentação oficial do NestJS.

## 📜 Licença
Este projeto é licenciado sob MIT.

---

🚀 **Agora está pronto para uso!** Se quiser adicionar mais detalhes, só me avisar! 🔥
