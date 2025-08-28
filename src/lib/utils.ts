import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const signUpSchema = z.object({
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

export const VALID_DOMAINS = () => {
	const domains = ["gmail.com", "yahoo.com", "outlook.com"];

	if (process.env.NODE_ENV === "development") {
		domains.push("test.com");
	}

	return domains;
};

export const normalizeName = (name: string) => {
	return name
		.trim()
		.replace(/\s+/g, " ")
		.replace(/[^\p{L}0-9\s'-]+/gu, "")
		.replace(/(^|\s|'|-)(\p{L})/gu, (_m, sep, ch) => sep + ch.toUpperCase());
};

export const signInSchema = z.object({
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
