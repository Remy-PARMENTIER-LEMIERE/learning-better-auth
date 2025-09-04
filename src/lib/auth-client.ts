import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";
import { ac, roles } from "@/lib/permissions";

const authClient = createAuthClient({
	// baseURL: process.env.NEXTPUBLIC_API_URL,
	plugins: [
		inferAdditionalFields<typeof auth>(),
		adminClient({
			ac,
			roles,
		}),
	],
});

export const {
	signUp,
	signIn,
	signOut,
	useSession,
	admin,
	sendVerificationEmail,
	forgetPassword,
	resetPassword,
} = authClient;
