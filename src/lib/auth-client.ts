import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
	baseURL: process.env.NEXTPUBLIC_API_URL,
});

export const { signUp, signIn, signOut, useSession } = authClient;
