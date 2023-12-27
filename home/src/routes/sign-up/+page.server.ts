import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';

const schema = z.object({
	name: z.string().email()
});

export const load = async () => {
	const form = await superValidate(schema);

	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, schema);
		console.log('POST', form);

		if (!form.valid) {
			// This is a status message and not a flash message since we have a
			// perfectly fine alert element to stick the message in.
			//
			// As a form validation failure, we will ignore this text in the client
			// since we would like to know the number of errors.
			return message(form, { type: 'error', text: 'Invalid form' });
		}

		throw redirect('/', { type: 'success', text: 'Account successfully created!' }, cookies);
	}
};
