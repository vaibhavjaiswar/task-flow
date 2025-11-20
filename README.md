This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

How to setup SQLite with prisma

init prisma files
    npx prisma init --datasource-provider sqlite

Define Your Data Models in schema.prisma file. OR prisma-schema-copy.txt has copy of schema

Add DATABASE_URL="file:./dev.db" in .env file

Install `dotenv`, and add `import "dotenv/config";` to your `prisma.config.ts` file to load environment variables from `.env`.

Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet then goto next step, or read https://pris.ly/d/getting-started 

Run prisma db pull to turn your database schema into a Prisma schema.
or
If DB is not avaialble, then Create/Initialize the Database by following...(check schema.prisma for proper DB schema)
    npx prisma migrate dev --name init



## Setting Up SQLite with Prisma

### 1. **Initialize Prisma**

Run the following command to create your Prisma setup:

    npx prisma init --datasource-provider sqlite

### 2. **Define Your Data Models**

Open the Prisma schema file:

    prisma/schema.prisma
📌 A reference copy of the schema is also available in: `prisma-schema-copy.txt`

### 3. **Configure the Database Connection**

Add this to your `.env` file:

    DATABASE_URL="file:D:\\My Code\\NextJS\\task-flow\\prisma\\dev.db"

### 4. **Pull an Existing Database (Optional)**

If you already have a SQLite file with tables, set the correct path in `.env`, then run:

    npx prisma db pull

### 5. **Create / Initialize a New Database**

_(Skip this if Step 4 is already done)_
If you do not have an existing database, create one based on your Prisma schema:

    npx prisma migrate dev --name init

### 6. **Generate Prisma Client**

Prisma Client is automatically generated during migrations, but you can run it manually:

    npx prisma generate

