export const load = async (event: any) => {
  const user = event.locals.user
  return {
    user: user,
  }
}
