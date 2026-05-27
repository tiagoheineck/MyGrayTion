# Node + Express + TypeORM

Projeto de exemplo com Node.js, Express, TypeORM e PostgreSQL usando Docker Compose.

## Stack

- Node.js
- Express
- TypeORM
- PostgreSQL
- TypeScript
- Docker Compose

## Como subir o projeto

### Pré-requisitos

- Docker
- Docker Compose

### Subir a aplicação

No diretório do projeto, execute:

```bash
docker compose up --build
```

Depois da primeira subida, para uso no dia a dia, você pode executar:

```bash
docker compose up
```

O serviço `app` usa volume bind em [compose.yml](compose.yml), então o código local é montado dentro do container. Na inicialização, o comando do container executa:

```bash
npm run build && npm start
```

Isso recompila o TypeScript e depois sobe a aplicação.

### Portas padrão

- API: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

### Banco configurado

- Database: `myapp`
- User: `postgres`
- Password: `postgres`

## Como atualizar a aplicação sem rebuild

Se você alterou código TypeScript e o container já está rodando, pode recompilar e reiniciar apenas o serviço da aplicação:

```bash
docker compose exec app npm run build
docker compose restart app
```

Se o serviço ainda não estiver ativo:

```bash
docker compose up
```

## Como criar uma nova entidade

Hoje este projeto está configurado com `synchronize: true` em [app-data-source.ts](app-data-source.ts). Isso significa que o TypeORM sincroniza o schema automaticamente no startup da aplicação.

Na prática, você não precisa gerar migration para uma entidade nova neste projeto. Basta:

1. Criar a classe da entidade dentro da pasta `entities`.
2. Recompilar a aplicação.
3. Reiniciar o serviço `app`.

### Exemplo

Crie um arquivo como `entities/jobs.entity.ts`:

```ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Jobs {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	description: string
}
```

### Persistir a nova entidade no banco

Depois de criar a entidade, execute:

```bash
docker compose exec app npm run build
docker compose restart app
```

Como o datasource está com sincronização automática, ao subir novamente o serviço o TypeORM deve criar a tabela correspondente no PostgreSQL.

Se preferir, você também pode reiniciar tudo:

```bash
docker compose up
```

## Como verificar se a tabela foi criada

Entre no banco:

```bash
docker compose exec db psql -U postgres -d myapp
```

Depois liste as tabelas:

```sql
\dt
```

Para inspecionar a estrutura de uma tabela:

```sql
\d jobs
```

## Observações importantes

- Se a entidade nova não aparecer no banco, confira se ela está decorada com `@Entity()`.
- O projeto procura entidades em `dist/entities`, porque a aplicação roda a versão compilada em JavaScript.
- Por isso, depois de alterar arquivos `.ts`, execute `npm run build` dentro do container antes de reiniciar o app.
- Como `synchronize: true` está habilitado, este projeto está em modo simples de desenvolvimento. Em ambiente mais sério, o ideal é usar migrations versionadas.

## Comandos úteis

Subir os serviços:

```bash
docker compose up
```

Subir reconstruindo a imagem:

```bash
docker compose up --build
```

Abrir shell no container da aplicação:

```bash
docker compose exec app bash
```

Recompilar o projeto manualmente:

```bash
docker compose exec app npm run build
```

Reiniciar apenas a aplicação:

```bash
docker compose restart app
```

## Referência

- TypeORM: https://typeorm.io/docs/guides/example-with-express/

