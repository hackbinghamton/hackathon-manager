import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { user } = await parent();
	if (!user?.isSignedUp) {
		throw redirect(302, '/login/google');
	}
};
