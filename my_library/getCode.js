import open from "open"
const getCode = (obj) => {
    console.log(obj.accesUrl)
    open(obj.accesUrl)
}
export default getCode