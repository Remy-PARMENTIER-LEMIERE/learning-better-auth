"use client";

import { createContext, useContext } from "react";
import type { AuthContextType, Children } from "@/types/auth";
import { useSession } from "./auth-client";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: Children) => {
	const { data: session, isPending } = useSession();

	return (
		<AuthContext.Provider value={{ session, isPending }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
