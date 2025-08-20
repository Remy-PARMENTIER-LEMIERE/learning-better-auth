import * as argon2 from "argon2";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

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
});
