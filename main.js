(async () => {
    console.log('hello');

    /*
      // Gen random data
      const N = 300;
      const gData = [...Array(N).keys()].map(() => ({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        size: Math.random() / 3,
        color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
      }));

      const globeEntity = document.getElementById('globe');
      globeEntity.setAttribute('globe', {
        pointsData: gData,
        pointAltitude: 'size',
        pointColor: 'color'
      });
*/
    
    let options = {
        geotiff: {
            projection: 'EPSG:4326',
        },
    };
    
    let url = 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/ideas_data/Copernicus_DSM_30_N47_00_E014_00_DEM_COG.tif';
    const tiff = await GeoTIFF.fromUrl(url);
    const image = await tiff.getImage();

    const bbox = [
        [-5.8966108,  51.2051493],
        [-5.8966108,  41.1759722],
        [9.7043313,  51.2051493],
        [9.7043313,  41.1759722],
    ];
    // Convert geographic coordinates to distances using EPSG:3857
    const xmin = proj4(options.geotiff.projection, 'EPSG:3857', [bbox[0], bbox[1]]);
    const xmax = proj4(options.geotiff.projection, 'EPSG:3857', [bbox[2], bbox[3]]);

    const xDistance = xmax[0] - xmin[0];
    const yDistance = xmax[1] - xmin[1];

    // compute the width of a single hex (gameSize), divided by 2 but multiply by ~1.155 to
    // account for the below mentioned hexagon wider than taller
    gameSize = 50;

    // Adjust board dimensions based on actual distances
    width = 50;
    height = 50;
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

    console.log((await image.readRasters({
        window: wnd,
        width: width,
        height: height,
        })));

    let data = (await image.readRasters({
    window: wnd,
    width: width,
    height: height,
    }))[0];

    // Flip the GeoTIFF upside down
    data = data.reverse();

    const flippedData = new Array(data.length);
    // Flip rows in our 1-dimensional array as if it were 2D
    for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const newData = data[y * width + (width - 1 - x)];
        flippedData[y * width + x] = newData;
    }
    }

    data = flippedData;
    const centerInLonLat = [bbox[0], bbox[1]];
    var center = proj4(options.geotiff.projection, 'EPSG:3857', centerInLonLat);
    // not actually center but left bottom corner of start of board but subtract ~1.5 hex
    center = [center[0] - 1.0 * gameSize, center[1] + 0.5 * gameSize];

    // Assuming the data is a single band and the size matches the game board
    for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
        const value = data[y * width + x];
        let isMine;
        if (location.isMineCondition) {
        isMine = !Number.isNaN(value) && location.isMineCondition(value);
        } else {
        isMine = Math.round(Math.random());
        }
        row.push({
        isMine,
        adjacentMines: 0,
        isRevealed: false,
        isFlagged: false,
        element: null,
        });
    }

    board.push(row);
    }

    fieldCount = width * height;
})().catch(err => {
    console.error(err);
});