export default function tranformForCombobox(obj: any) {
  obj = obj.map((el: any) => {
    el.text = el.bezeichnung
    return el
  })
  return obj
}
