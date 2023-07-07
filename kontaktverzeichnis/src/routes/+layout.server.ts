export const load = ({ locals }: any) => {
  if (locals.user) {
    return { user: locals.user }
  } else {
    return { user: undefined }
  }
}
