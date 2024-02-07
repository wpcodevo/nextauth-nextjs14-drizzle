setup:
	pnpm create next-app nextauth-nextjs14-drizzle
install-dependencies:
	pnpm add next-auth@beta @auth/core bcryptjs
	pnpm add -D @types/bcryptjs
	pnpm add dotenv
	pnpm add drizzle-orm @auth/drizzle-adapter @neondatabase/serverless
	pnpm add drizzle-kit --save-dev

	pnpm add zod @hookform/resolvers react-hook-form tailwind-merge
	pnpm add react-hot-toast

commands:
	openssl rand -hex 32
	pnpm drizzle-kit generate:pg
	pnpm drizzle-kit push:pg 