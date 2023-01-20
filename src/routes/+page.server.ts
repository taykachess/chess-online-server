import type { Actions } from './$types'

export const actions: Actions = {
  logout: async ({ request, cookies }) => {
    console.log('logout')
    cookies.delete('token', {
      path: '/',
      httpOnly: false,
    })

    return { success: true }
  },
}
