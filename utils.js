import mergeImages from 'merge-images'

const formatImage = (source, face) => new Promise(resolve => {
  if (face !== 'up' && face !== 'down') return resolve(source)
	const canvas = window.document.createElement('canvas')
  const ctx = canvas.getContext("2d")
  const image = new window.Image()

  image.src = source
  image.onload = function() {
    // NOTE (TRACE): IMAGES NEED TO BE A POWER OF 2 IN ORDER TO BE A TEXTURE
    // image.width = 1024
    // image.height = 1024
    canvas.width = image.width
    canvas.height = image.height
    // NOTE (TRACE): for some reason when rendering the up and down faces in the threejs cubemap, the images are flipped 180
    // I think this is due to a threejs rendering technicality, but i'm not sure
    // if (face === 'up' || face === 'down') {
    ctx.translate(image.width, image.height)
    ctx.rotate(180 * Math.PI / 180)
    // }

    ctx.drawImage(image, 0, 0)
    resolve(canvas.toDataURL('image/png', 0.92))
  }
})

const createFaceImages = async ({up, down, left, right, front, back}, tilesize) => {
  const merge = async (urls, face) => {
    const b64 = await mergeImages(urls, {
      crossOrigin: 'Anonymous',
      width: tilesize * 3,
      height: tilesize * 3
    })

    return formatImage(b64, face)
  }

  const [
    upFace,
    downFace,
    leftFace,
    rightFace,
    frontFace,
    backFace
  ] = await Promise.all([merge(up, 'up'), merge(down, 'down'), merge(left, 'left'), merge(right, 'right'), merge(front, 'front'), merge(back, 'back')])
  
  return {
    up: upFace,
    down: downFace,
    left: leftFace,
    right: rightFace,
    front: frontFace,
    back: backFace
  }
}

// NOTE (TRACE): THIS IS PROVIDED BY A 360CITIES ENGINEER https://gist.github.com/vlad360/eeed7806160b12069724d965cfae5ac1
const createTileUrls = (data) => {
  const {tilesize, tiled_image_sizes, faces, urls} = data
  // Minimum resolution for a cube side.
  const minCubeSideSize = 1024;

  // Size of the smallest level that meets minimum resolution requirement.
  const selectedLevelSize = tiled_image_sizes.sort(function(a, b) { return a - b; }).find(function(e) { return e >= minCubeSideSize; });
  // Index of the smallest level that meets minimum resolution requirement.
  const selectedLevelIndex = tiled_image_sizes.findIndex(function(e) { return e == selectedLevelSize; })
  // Number of tiles in the smallest level that meets minimum resolution requirement.
  const selectedLevelNumTiles = Math.ceil(selectedLevelSize / tilesize);

  let results = {}
  // For each cube side.
  faces.forEach(function(face, faceIndex) {
    results[face] = []
    // For each horizontal tile.
    for (let hIndex = 0; hIndex < selectedLevelNumTiles; hIndex++) {
      let y = hIndex * tilesize
      let rowArr = []
      // For each vertical tile.
      for (let vIndex = 0; vIndex < selectedLevelNumTiles; vIndex++) {
        let x = vIndex * tilesize
        const src = urls
          .replace('{face}', face)
          .replace('{level}', selectedLevelIndex)
          .replace('%r', hIndex)
          .replace('%c', vIndex)
        // create the image source object to call the merge images library
        rowArr.push({src, x, y})
      }
      results[face].push(...rowArr)
    }
  });

  
  return results
}

export const createCubeImages = async (data) => {
  const faceMap = createTileUrls(data)
  return await createFaceImages(faceMap, data.tilesize)
}

