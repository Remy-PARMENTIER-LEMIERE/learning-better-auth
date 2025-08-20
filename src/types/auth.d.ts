import type { ReactNode } from "react";

type Children = {
	children: ReactNode;
};

type AuthContextType = {
	session: {
		user: {
			id: string;
			email: string;
			emailVerified: boolean;
			name: string;
			createdAt: Date;
			updatedAt: Date;
			image?: string | null | undefined;
		};
		session: {
			id: string;
			userId: string;
			expiresAt: Date;
			createdAt: Date;
			updatedAt: Date;
			token: string;
			ipAddress?: string | null | undefined;
			userAgent?: string | null | undefined;
		};
	} | null;
	isPending: boolean;
};
