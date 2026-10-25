import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";
import type { auth } from "#/modules/auth/auth.utils";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_API_URL as string,
	plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;