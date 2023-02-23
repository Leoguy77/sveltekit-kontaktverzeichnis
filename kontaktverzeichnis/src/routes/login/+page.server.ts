import { error, redirect } from '@sveltejs/kit'

export const actions = {
	login: async ({ request, locals }:any) => {
		const body = Object.fromEntries(await request.formData())
		let forward: boolean
		try {
			await locals.pb.collection('users').authWithPassword(body.email, body.password)
			forward = true
		} catch (err:any) {
			if (err.status?.toString()[0] === "4") {
				return {error: 'Login failed: Username or password incorrect'}
			}else{
				console.log('Error: ', err)
				throw error(500, 'Something went wrong logging in')
			}
		}
		if (forward){
			throw redirect(303, body.previousPage)
		}
	},
	logout: async ({ locals }:any) => {
		locals.pb.authStore.clear()
		locals.user = undefined
	}
};