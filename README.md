# E-commerce — Refatoração com SOLID

Projeto da disciplina de Arquitetura de Software. O `OrderController` original concentrava validação, cálculo de frete, pagamento, acesso ao banco e envio de e-mail. Ele foi dividido em camadas seguindo os princípios SOLID.

## Estrutura

```text
src/
├── controllers/OrderController.ts      # HTTP: recebe o request, chama o service e responde
├── domain/                             # Regras de negócio
│   ├── IProduct.ts                     # Contrato do produto (+ formato vindo do banco)
│   ├── PhysicalProduct.ts              # Frete fixo de R$ 10
│   ├── DigitalProduct.ts               # Frete zero
│   └── ProductFactory.ts               # Converte o registro do banco no produto correto
├── services/
│   ├── OrderService.ts                 # Fluxo: valida -> calcula -> paga -> salva -> notifica
│   └── NotificationService.ts          # Monta o conteúdo do e-mail
├── providers/
│   ├── IMailProvider.ts                # Contrato de envio de e-mail
│   └── EtherealMailProvider.ts         # Implementação com Nodemailer/Ethereal
├── repositories/
│   ├── IOrderRepository.ts
│   ├── IProductRepository.ts
│   ├── PrismaOrderRepository.ts
│   └── PrismaProductRepository.ts
├── payments/
│   ├── IPaymentMethod.ts               # Contrato de pagamento
│   ├── CreditCardPayment.ts
│   ├── DebitCardPayment.ts
│   ├── PixPayment.ts
│   └── PaymentRegistry.ts              # Mapa nome -> forma de pagamento
├── errors/OrderError.ts                # Erro de negócio com status HTTP
├── lib/logger.ts                       # Winston
├── app.ts                              # Monta as dependências e registra a rota
└── server.ts
```

## Princípios aplicados

- **SRP** — cada classe tem uma única responsabilidade (controller só HTTP, service só orquestra, provider só envia e-mail, repository só acessa o banco).
- **OCP** — para aceitar uma nova forma de pagamento basta criar a classe e dar um `register` no `app.ts`, sem alterar o `OrderService`. O mesmo vale para novos tipos de produto na `ProductFactory`.
- **LSP** — `PhysicalProduct` e `DigitalProduct` podem ser usados no lugar de `IProduct`; o service chama `calculateFreight()` sem checar o tipo.
- **DIP** — o `OrderService` depende de interfaces (`IProductRepository`, `IOrderRepository`) e não do Prisma; o `NotificationService` depende de `IMailProvider` e não do Nodemailer.

## Como rodar

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

O servidor sobe em `http://localhost:3000`. Na primeira execução pode demorar alguns segundos para gerar a conta de teste do Ethereal.

## Testes manuais (cURL)

Livro físico (total esperado: R$ 110, com frete):

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "cliente1@ethereal.email",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

E-book (total esperado: R$ 50, sem frete):

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "cliente2@ethereal.email",
  "items": [{ "productId": 2, "quantity": 1 }],
  "paymentMethod": "pix",
  "paymentDetails": {}
}'
```

A resposta traz `orderId` e `emailPreview` (link para ver o e-mail no Ethereal).
