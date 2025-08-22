import * as argon2 from "argon2";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { z } from "zod";
import { prisma } from "./prisma";

const signUpSchema = z.object({
	name: z.string().min(1).max(80),
	email: z.email(),
	password: z
		.string()
		.min(8, "Min 8 caractères")
		.max(20)
		.refine(
			(pwd) =>
				/[a-z]/.test(pwd) &&
				/[A-Z]/.test(pwd) &&
				/\d/.test(pwd) &&
				/[^a-zA-Z0-9\s]/.test(pwd),
			{
				message:
					"Doit contenir une minuscule, une majuscule, un chiffre et un caractère spécial",
			},
		),
});

const signInSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(8, "Min 8 caractères")
		.max(20)
		.refine(
			(pwd) =>
				/[a-z]/.test(pwd) &&
				/[A-Z]/.test(pwd) &&
				/\d/.test(pwd) &&
				/[^a-zA-Z0-9\s]/.test(pwd),
			{
				message:
					"Doit contenir une minuscule, une majuscule, un chiffre et un caractère spécial",
			},
		),
});

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "mysql",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		password: {
			hash: async (password: string) => {
				return await argon2.hash(password, {
					type: argon2.argon2id,
					memoryCost: 2 ** 17,
					timeCost: 8,
					parallelism: 1,
				});
			},
			verify: async (data: { hash: string; password: string }) => {
				try {
					return await argon2.verify(data.hash, data.password);
				} catch {
					return false;
				}
			},
		},
	},
	session: {
		expiresIn: 30 * 24 * 60 * 60,
	},
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/sign-up/email") {
				const parsed = signUpSchema.safeParse(ctx.body);

				if (!parsed.success) {
					return new Response(
						JSON.stringify({ error: z.treeifyError(parsed.error) }),
						{
							status: 400,
						},
					);
				}
				ctx.body = parsed.data;
			}

			if (ctx.path === "/sign-in/email") {
				const parsed = signInSchema.safeParse(ctx.body);

				if (!parsed.success) {
					return new Response(
						JSON.stringify({ error: z.treeifyError(parsed.error) }),
						{
							status: 400,
						},
					);
				}
				ctx.body = parsed.data;
			}
		}),
	},
});
