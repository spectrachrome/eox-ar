const options = {
    geotiff: {
        // Côte d'Azur
        bbox: [5.046, 42.9342, 7.2733, 44.1586],
        resolution: [100, 100],
        url: 'https://eox-ideas.s3.eu-central-1.amazonaws.com/ideas_data/AR2_wildlife_simplify_COG_b1_t_final.tif',
        projection: 'EPSG:4326',
        width: 20,
        height: 20,
    },
};

async function loadGeoTiff(url) {
    const tiff = await GeoTIFF.fromUrl(url);
    const image = await tiff.getImage();
    return image;
}

function toGeoCoords(x_pixel, y_pixel, GT) {
    const longitude = GT[0] + x_pixel * GT[1] + y_pixel * GT[2];
    const latitude = GT[3] + x_pixel * GT[4] + y_pixel * GT[5];
    return [longitude, latitude];
}

function convertRasterToGlobePoints(rasterValues, bounds, dimensions) {
    const [west, south, east, north] = bounds;
    const [width, height] = dimensions;

    console.log(width);
    console.log(height);
  
    // Calculate the step size for each pixel.
    const latStep = (north - south) / height;
    const lngStep = (east - west) / width;

    console.log(latStep);
    console.log(lngStep);
  
    const annotatedRaster = [];
  
    for (let rowIndex = 0; rowIndex < rasterValues.length; rowIndex++) {
      for (let colIndex = 0; colIndex < rasterValues[rowIndex].length; colIndex++) {
        const value = rasterValues[rowIndex][colIndex];
        
        // Calculate the latitude and longitude for the current pixel.
        const lat = north - (rowIndex * latStep);
        const lng = west + (colIndex * lngStep);
  
        annotatedRaster.push({
            value,
            lat,
            lng,
            size: Math.random() / 3,
            color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
        });
      }
    }
  
    return annotatedRaster;
  }

(async () => {
    console.log('hello');
    
    const image = await loadGeoTiff(options.geotiff.url);

    /*
    console.log(await readGeoTiffData(
        image,
        options.geotiff.bbox,
        options.geotiff.resolution[0],
        options.geotiff.resolution[1],
    ));
        */
    // Convert geographic coordinates to distances using EPSG:3857
    const bbox = options.geotiff.bbox;
    const xmin = proj4(options.geotiff.projection, 'EPSG:3857', [bbox[0], bbox[1]]);
    const xmax = proj4(options.geotiff.projection, 'EPSG:3857', [bbox[2], bbox[3]]);

    const xDistance = xmax[0] - xmin[0];
    const yDistance = xmax[1] - xmin[1];

    // compute the width of a single hex (gameSize), divided by 2 but multiply by ~1.155 to
    // account for the below mentioned hexagon wider than taller
    gameSize = 20;

    // Adjust board dimensions based on actual distances
    width = gameSize;
    height = gameSize;
    // Read the GeoTIFF data into a 1-dimensional array
    const [oX, oY] = image.getOrigin();
    const [imageResX, imageResY] = image.getResolution(image);

    let wnd = [
        Math.round((bbox[0] - oX) / imageResX),
        Math.round((bbox[1] - oY) / imageResY),
        Math.round((bbox[2] - oX) / imageResX),
        Math.round((bbox[3] - oY) / imageResY),
    ];
    console.log(wnd);
    wnd = [
    Math.min(wnd[0], wnd[2]),
    Math.min(wnd[1], wnd[3]),
    Math.max(wnd[0], wnd[2]),
    Math.max(wnd[1], wnd[3]),
    ];

    console.log(wnd);

    let raster = await image.readRasters({
        window: wnd,
        width: width,
        height: height,
        });

    const pointsData = convertRasterToGlobePoints(raster, options.geotiff.bbox, [options.geotiff.width, options.geotiff.height]);

    /*
      // Gen random data
      const N = 300;
      const gData = [...Array(N).keys()].map(() => ({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        size: Math.random() / 3,
        color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
      }));
    */
      const globeEntity = document.getElementById('globe');
      globeEntity.setAttribute('globe', {
        pointsData,
        pointAltitude: 'size',
        pointColor: 'color'
      });

})().catch(err => {
    console.error(err);
});
