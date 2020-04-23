import { useState, useEffect } from 'react'
import { Button, SearchBody } from '../components'
import axios from 'axios'
import { createTiles } from '../utils'

const Search360 = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [error, setError] = useState([])

  useEffect(() => {
    const online = window ? window.navigator && window.navigator.onLine : false
    online && setIsOnline(online)
  }, [])

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const auth = 'vrtuoso_demo:epAsqZC6NDfx4M3Z'
      const hash = btoa(auth)
      const Basic = 'Basic ' + hash
      const {data} = await axios.get(`https://www.360cities.net/api/images/multires_tiles/${query}`, {headers : { 'Authorization' : Basic }})
      console.log('browser data!!1: ', data)
    } catch(e) {
      console.log('error fetching data in client from 360: ', e)
    }

    try {
      const {data}= await axios.get(`/api/360cities?handle=${query}`)
      setImages(data.results)
    } catch (e){
      console.log('eeee: ', e)
      setError(e)
    }
    setLoading(false)
  }

  const insert = async ({handle}) => {
    try {
      const {data}= await axios.get(`/api/tiles?handle=${handle}`)
      createTiles(data.tiles)
    } catch (e){
      console.log('eeee: ', e)
      setError(e)
    }
  }

  const handleUpdate = e => {
    const {value} = e.target
    setQuery(value)
  }

  const handleClick = () => setIsOpen(!isOpen)

  return (
    <div className="relative">
      <Button {...{handleClick, isOpen}} />
      {isOpen ? <SearchBody {...{insert, images, handleSubmit, handleUpdate, query, isOnline, setIsOpen, loading}}/>: null}
    </div>
  )
}

export default Search360