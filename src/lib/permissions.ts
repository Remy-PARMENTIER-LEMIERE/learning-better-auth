import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";
import { UserRole } from "@/generated/prisma";

const statements = {
	...defaultStatements,
	post: ["create", "read", "update", "delete", "update:own", "delete:own"],
} as const;

export const ac = createAccessControl(statements);

export const roles = {
	[UserRole.USER]: ac.newRole({
		post: ["create", "read", "update:own", "delete:own"],
	}),
	[UserRole.ADMIN]: ac.newRole({
		...adminAc.statements,
		post: ["create", "read", "update", "delete", "update:own", "delete:own"],
	}),
};
