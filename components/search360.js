import { useState, useEffect } from 'react'
import { Button, SearchBody } from '../components'
import axios from 'axios'
import { createCubeImages } from '../utils'
import { map } from 'lodash'

const Search360 = ({setCubeFaces}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [error, setError] = useState([])
  const [cubeyFaces, setCubeyFaces] = useState([])

  useEffect(() => {
    const online = window ? window.navigator && window.navigator.onLine : false
    online && setIsOnline(online)
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
  
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
      const res = await createCubeImages(data.tiles)
      setCubeFaces(res)
      setCubeyFaces(res)
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
      {/* {
        map(cubeyFaces, (face, key) => {
          return (
            <>
              <p>{key}</p>
              <img src={face}/>
            </>
          )
      })
      } */}
    </div>
  )
}

export default Search360