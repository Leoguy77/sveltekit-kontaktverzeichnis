export const load = ({ locals }: any) => {
  return { user: "testuser" }
  if (locals.user) {
    return { user: locals.user }
  } else {
    return { user: undefined }
  }
}
