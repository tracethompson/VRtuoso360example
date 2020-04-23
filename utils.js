import { findIndex, each } from 'lodash'
import mergeImages from 'merge-images'

const replacer = (string, regex, value) => {
  return string.replace(regex, value)
}

const createFaceImages = (faces) => {
  const result = {}
  each(faces, (urls, face) => {
    mergeImages(urls, {crossOrigin: 'Anonymous'})
      .then(b64 => {
        result[face] = b64
        console.log('result: ', result)
      })
      .catch(e => {
        console.log('error: ', e)
      })
  })
}

const formCubeFace = (faceMap) => {
  // https://github.com/lukechilds/merge-images
  const results = {}
  each(faceMap, (face, key) => {
    results[key] = []
    each(face, (row, yIndex) => {
      let y = yIndex * 512
      let rowArr = []
      each(row, (src, xIndex) => {
        let x = xIndex * 512
        rowArr.push({src, x, y})
      })
      results[key].push(...rowArr)
    })
  }) 

  createFaceImages(results)
}

// NOTE (TRACE): THIS IS A TRANSLATION OF https://gist.github.com/vlad360/e40e353d2910aa231473252672649301
// PROVIDED BY A 360CITIES ENGINEER
export const createTiles = (data) => {
  const {tilesize, tiled_image_sizes, faces, urls} = data
  // Level size that consists from 9 tiles
  // NOTE (TRACE): I don't understand what this is actually doing
  let levelIndex = findIndex(tiled_image_sizes, s => s > tilesize * 2 && s <= tilesize * 3)
  if (levelIndex < 0) {
    levelIndex = tiled_image_sizes.length >= 3 ? 2 : tiled_image_sizes.length - 1
    console.log('The level index calculation failed - setting default level to: ', levelIndex)
  }

  const faceMap = {}
  each(faces, face => faceMap[face] = [])

  each(faces, face => {
    // we have 3x3 tiles per cude side
    const sides = [[0,1,2], [0,1,2], [0,1,2]]
    // horizontal index
    each(sides, (side, horizontalIndex) => {
      let portions = []
      // vertical index
      each(side, verticalIndex => {
        const urlWithFace = replacer(urls, /{face}/gi, face)
        const urlWithLevel = replacer(urlWithFace, /{level}/gi, levelIndex)
        const urlWithR = replacer(urlWithLevel, /%r/gi, horizontalIndex)
        const finalUrl = replacer(urlWithR, /%c/gi, verticalIndex)
        portions.push(finalUrl)
      })
      faceMap[face].push(portions)
    })
  })
  
  formCubeFace(faceMap)
}