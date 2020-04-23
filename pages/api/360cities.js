import axios from 'axios'
import btoa from 'btoa'

export default async (req, res) => {
  const {handle} = req.query
  const auth = 'vrtuoso_demo:epAsqZC6NDfx4M3Z'
  const hash = btoa(auth)
  const Basic = 'Basic ' + hash
  const {data} = await axios.get(`https://www.360cities.net/api/images/search/${handle}`, {headers : { 'Authorization' : Basic }})
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ ...data }))
}