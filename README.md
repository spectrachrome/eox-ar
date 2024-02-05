![AR Tag](https://github.com/spectrachrome/eox-ar/raw/main/public/eox_ar_banner.svg)

# Augmented Reality for Geospatial Applications

A building ground for the evaluation of the capabilities of AR in a geospatial environment.

Currently, this is a simple Vue demonstrator application which uses AR.js to instantiate a camera view, register a simple company tag (the one at the top of this document) and then render a cube. Please note that this project is still a work-in-progress, so the cube might not render fully or at all.

## Platform Evaluation (2024-02-05)

### Is the web ready yet?

Currently, the support for browser APIs required by in-browser AR is insufficient to provide an immersive and engaging experience. In particular, the [browser support for the Accelerometer API](https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer#browser_compatibility) is not widely available and not at all present in Firefox or Safari, resulting in very glitchy, jumpy and sometimes wrongly oriented 3D renders. Since all browsers on iOS use Safari's engine, this basically means the experience on the web on iOS will not be particularly smooth.

Missing or incomplete APIs:

- [Accelerometer API](https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer#browser_compatibility)
- [Gyroscope API](https://developer.mozilla.org/en-US/docs/Web/API/Gyroscope#browser_compatibility)

So - either we restrict the set of browsers/devices that work for our AR prototype (in our case only Chrome on Android) or we utilize a different platform.

### How ready are platform-native apps?

The `ARKit` and `ARCore` APIs for iOS and Android, respectively, are in a better position to do Augmented Reality on mobile devices and offer the necessary device APIs for Augmented Reality so it does not feel detached from the camera view. Together with an app development platform like Flutter, they might provide a feasible alternative to browsers with better and more engaging support for AR views.

In particular, the demo sphere seen in the `arkit_plugin` library page moves coherently with camera movements, so that it actually feels like it's there.

- [`arkit_plugin`](https://pub.dev/packages/arkit_plugin) *Device access to native AR APIs on iOS with Flutter*
- [`arcore_flutter_plugin`](https://pub.dev/packages/arcore_flutter_plugin) *Device access to native AR APIs on Android with Flutter*

## Resources and Links

- [AR.js Marker Generator](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html)
- [Stemkoski's AR Examples](https://stemkoski.github.io/AR-Examples/)
- [A Guide To Developing An Augmented Reality Web App](https://3sidedcube.com/en-us/ar-js-a-guide-to-developing-an-augmented-reality-web-app-2/)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
