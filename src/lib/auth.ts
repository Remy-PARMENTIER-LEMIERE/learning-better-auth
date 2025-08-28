import * as argon2 from "argon2";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { z } from "zod";
import { prisma } from "./prisma";
import {
	normalizeName,
	signInSchema,
	signUpSchema,
	VALID_DOMAINS,
} from "./utils";

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
	user: {
		additionalFields: {
			role: {
				type: ["USER", "ADMIN"],
				input: false,
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

				const email = String(parsed.data.email);
				const domain = email.split("@")[1];

				if (!VALID_DOMAINS().includes(domain)) {
					throw new APIError("BAD_REQUEST", {
						status: "error",
						message:
							"Nom de domaine invalide. Veuillez utiliser un email valide.",
					});
				}
				const name = normalizeName(parsed.data.name);
				console.log(name);

				ctx.body = { ...parsed.data, name };
				console.log(ctx.body);
				return ctx;
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
