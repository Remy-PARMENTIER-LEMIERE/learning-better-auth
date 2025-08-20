import { toNextJsHandler } from "better-auth/next-js";
import * as z from "zod";
import { auth } from "@/lib/auth";

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

async function guardedHandler(req: Request) {
	const url = new URL(req.url);

	// --- POST /sign-up ---
	if (req.method === "POST" && url.pathname.endsWith("/sign-up/email")) {
		const body = await req.json().catch(() => ({}));
		const parsed = signUpSchema.safeParse(body);
		if (!parsed.success) {
			return new Response(
				JSON.stringify({ error: z.treeifyError(parsed.error) }),
				{
					status: 400,
				},
			);
		}
		req = new Request(req.url, {
			method: req.method,
			headers: req.headers,
			body: JSON.stringify(parsed.data),
		});
	}

	// --- POST /sign-in ---
	if (req.method === "POST" && url.pathname.endsWith("/sign-in/email")) {
		const body = await req.json().catch(() => ({}));
		const parsed = signInSchema.safeParse(body);
		if (!parsed.success) {
			return new Response(
				JSON.stringify({ error: z.treeifyError(parsed.error) }),
				{
					status: 400,
				},
			);
		}
		req = new Request(req.url, {
			method: req.method,
			headers: req.headers,
			body: JSON.stringify(parsed.data),
		});
	}

	return auth.handler(req);
}

export const { POST, GET } = toNextJsHandler(guardedHandler);
