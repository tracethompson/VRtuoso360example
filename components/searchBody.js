import { useState } from 'react'
import classnames from 'classnames'
import Axios from 'axios'

const Spinner = () => <img className="h-12 w-auto mx-auto" src="loading.gif"/>

const NoConnection = ({setIsOpen}) => 
  <div>
    <img src="warning-outline.svg" className="h-8 mb-4 w-auto"/>
    <p>You need internet conection to browse the library</p> 
    <button className="rounded p-2 text-white cursor bg-blue-500 mt-4" onClick={() => setIsOpen(false)}>
      Cancel
    </button>
  </div>

const SearchInput = ({query, handleSubmit, handleUpdate}) =>
  <div className="flex flex-row mt-4">
    <div className="p-2 w-3/4 rounded border border-blue-500">
      <input onChange={handleUpdate} className="w-full h-fit-content h-full focus:outline-none placeholder-login-placeholder text-light-green bg-transparent" id="caption" type="caption" value={query} placeholder={`Search...`}/>
    </div>
    <BasicButton {...{onClick: handleSubmit, copy: 'Search'}}/>
  </div>

const BasicButton = ({onClick, copy}) =>     
  <button onClick={onClick} className="bg-blue-500 text-white py-2 ml-4 px-2 rounded cursor-pointer focus:outline-none">
    {copy}
  </button>

const ResultActions = ({handleInsert, handlePreview}) =>
  <div className="mt-4 flex flex-row items-center">
    <p>Can't find what you're looking for? <a className="text-blue-500 cursor-pointer underline" href="mailto:support@vrtuoso.io">Contact us</a></p>
    <div className="flex flex-row ml-auto">
      <BasicButton onClick={handlePreview} copy="Preview"/>
      <BasicButton onClick={handleInsert} copy="Insert"/>
    </div>
  </div>

const PreviewActions = ({handleBack, handleInsert}) => 
  <div className="mt-4 flex flex-row items-center justify-end">
    <BasicButton onClick={handleBack} copy="Back"/>
    <BasicButton onClick={handleInsert} copy="Insert"/>
  </div>

const SearchBody = ({handleSubmit, handleUpdate, query, isOnline, setIsOpen, images, insert, loading}) => {
  const [preview, setPreview] = useState(null)
  const [selectedImg, setSelectedImg] = useState(null)

  const constructImg = img => {
    const src = extractThumbnailSrc(img)
    const onClick = () => setSelectedImg(img)
    const imgClass = classnames({
      'cursor-pointer': true,
      'border-solid border-4': true,
      'border-gray-200': img.id !== (selectedImg && selectedImg.id),
      'border-blue-500': img.id === (selectedImg && selectedImg.id)
    })

    return (
      <div className={imgClass} onClick={onClick} key={img.id}>
        <img src={src} />
      </div>
    )
  }

  const handlePreview = () => {
    if (selectedImg) {
      setPreview(true)
    }
  }
  
  const handleInsert = ({}) => {
    if (selectedImg) {
      insert(selectedImg)
    }
  }

  const extractThumbnailSrc = (image) => {
    return image.thumbnails[2].url
  }

  return (
    <div className="absolute search__body bg-gray-200 rounded p-4">
      <h1 className="font-bold">360 LIBRARY</h1>
      {isOnline ? <SearchInput {...{query, handleSubmit, handleUpdate}}/> : null}
      <div className="mt-4 bg-gray-100 p-4 overflow-auto">
        {!isOnline ?
          <NoConnection setIsOpen={setIsOpen}/>
          :
          <div>
            {images && images.length ?
                <div>
                  {preview ?
                    <div>
                      <p className="text-sm mb-2 text-gray-600">Click and drag on the image to explore</p>
                      <div className="iframe__wrapper">
                        <iframe src={selectedImg.embed_url}/>
                      </div>
                      <PreviewActions handleBack={() => setPreview(false)} handleInsert={handleInsert}/>
                    </div>
                  : 
                    <div>
                      <div className="grid grid-flow-row grid-rows-3 grid-cols-3 gap-4">
                        {images.map(constructImg)}
                      </div>
                      <ResultActions handlePreview={handlePreview} handleInsert={handleInsert}/>
                    </div>
                  }
                </div>
              : 
                <div className="p-10">
                  {loading ? <Spinner /> : <p className="text-center">Search across 500,000 360° images</p>}
                </div>
            }
          </div>
        }
      </div>
      <style jsx>{`
        .search__body {
          top: 100px;
          width: calc(100vw * .7);
          min-width: 400px;
        }
        .iframe__wrapper {
          position: relative;
          display: block;
          height: 0;
          overflow: hidden;
          padding-top: 45%;
        }

        .iframe__wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          height: 100%;
          width: 100%;
          border: 0;
        }
      `}</style>
    </div>
  )
}

export default SearchBody