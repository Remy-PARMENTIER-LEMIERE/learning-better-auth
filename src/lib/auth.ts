import * as argon2 from "argon2";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, customSession, magicLink } from "better-auth/plugins";
import { z } from "zod";
import { sendEmailAction } from "@/actions/nodemailer/send-email.action";
import { UserRole } from "@/generated/prisma";
import { ac, roles } from "@/lib/permissions";
import { prisma } from "./prisma";
import {
	normalizeName,
	signInSchema,
	signUpSchema,
	VALID_DOMAINS,
} from "./utils";

const options = {
	database: prismaAdapter(prisma, {
		provider: "mysql",
	}),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
	},
	account: {
		accountLinking: {
			enabled: true,
		},
	},
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
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await sendEmailAction({
				to: user.email,
				subject: "Réinitialisez votre mot de passe",
				meta: {
					description:
						"Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe.",
					link: String(url),
				},
			});
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		expiresIn: 60 * 60,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			const link = new URL(url);
			link.searchParams.set("callbackURL", "/auth/verify");

			await sendEmailAction({
				to: user.email,
				subject: "Verify your email address",
				meta: {
					description:
						"Please verify your email address to complete registration.",
					link: String(link),
				},
			});
		},
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					if (!user.email) {
						return false;
					}

					const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];

					if (ADMIN_EMAILS.includes(user.email)) {
						return { data: { ...user, role: "ADMIN" } };
					}

					const normalizedName = normalizeName(user.name);

					return { data: { ...user, name: normalizedName } };
				},
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
		cookieCache: { enabled: true, maxAge: 10 * 60 },
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
					throw new APIError(400, {
						status: "error",
						message:
							"Nom de domaine invalide. Veuillez utiliser un email valide.",
					});
				}
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

			if (ctx.path === "/sign-in/magic-link") {
				const name = normalizeName(ctx.body.name);

				return {
					...ctx,
					body: {
						...ctx.body,
						name,
					},
				};
			}

			if (ctx.path === "/update-user") {
				const name = normalizeName(ctx.body.name);

				return {
					...ctx,
					body: {
						...ctx.body,
						name,
					},
				};
			}
		}),
	},
	plugins: [
		nextCookies(),
		admin({
			defaultRole: UserRole.USER,
			adminRoles: [UserRole.ADMIN],
			ac,
			roles,
		}),
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				await sendEmailAction({
					to: email,
					subject: "Magic Link Login",
					meta: {
						description: "Click the link bellow to login with the magic link !",
						link: String(url),
					},
				});
			},
		}),
	],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
	...options,
	plugins: [
		...(options.plugins ?? []),
		customSession(async ({ user, session }) => {
			return {
				session: {
					expiresAt: session.expiresAt,
					token: session.token,
					userAgent: session.userAgent,
				},
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
					createdAt: user.createdAt,
					role: user.role,
				},
			};
		}, options),
	],
});
