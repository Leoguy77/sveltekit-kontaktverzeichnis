export async function GET({locals}:any) {
  try{
    if(!locals?.pb?.authStore?.isValid){
      return new Response('{"message":"Not authenticated"}',{
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
    let eintragTypen=await locals.pb.collection('abteilung').getFullList()
    let res = JSON.stringify(eintragTypen)

    return new Response(res, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  }catch{
    return new Response('{"message":"Internal Error"}',{
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}