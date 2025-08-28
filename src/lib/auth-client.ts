import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";

const authClient = createAuthClient({
	baseURL: process.env.NEXTPUBLIC_API_URL,
	plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signUp, signIn, signOut, useSession } = authClient;
