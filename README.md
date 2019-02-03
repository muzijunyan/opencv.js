# opencv.js

Using opencv.js to process images in the web applications

## 1. load opencv.js file

```html
<script async src="https://docs.opencv.org/3.4.5/opencv.js" onload="onOpencvJSLoaded();" type="text/javascript"></script>
```

If you want to speed up the loading process, you'd better to store the opencv.js library in your local repository.

## 2. convert color image to gray image

<img src="images/lena_gray.png"
     alt="lena image in gray"
     style="margin-left: 10px;" />

```javascript
let imgElement = document.getElementById("imageSrc");
let src = cv.imread(imgElement);
let dst = new cv.Mat();
cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
cv.imshow("canvasOutput", dst);
src.delete();
dst.delete();
```

## 3. extract channels

You can extract the R (red), G (green), B (blue) channels from the original color image.

<img src="images/rgb_channels.gif"
     alt="lena image in R G B channels"
     style="margin-left: 10px;" />

```javascript
let imgElement = document.getElementById("imageSrc");
let src = cv.imread(imgElement);
let R = new cv.Mat();

// extract channels
let rgbaPlanes = new cv.MatVector();
// split the Mat
cv.split(src, rgbaPlanes);
// get RED channel
R = rgbaPlanes.get(0);
cv.imshow("canvasOutput", R);

// release objects
src.delete();
rgbaPlanes.delete();
R.delete();
```

## 4. convert to different color spaces, AND extract channels

You can convert the color image from the original RGB color space to CIE L\*a\*b\* color space, extract the L channel to get the perceptual lightness of the image.

```javascript
let imgElement = document.getElementById("imageSrc");
let src = cv.imread(imgElement);
let dst = new cv.Mat();

// convert the color image into the Lab space
cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
cv.cvtColor(src, dst, cv.COLOR_RGB2Lab);

// extract the Lightness channel
let labPlanes = new cv.MatVector();
// split the Mat
cv.split(dst, labPlanes);
// get L channel
let L = labPlanes.get(0);
cv.imshow("canvasOutput", L);

// release objects
src.delete();
labPlanes.delete();
L.delete();
dst.delete();
```

## 5. smooth image with median filter

The <b>Median Filter</b> is used to remove the noise and make the image smooth.

<img src="images/median_filter.png"
     alt="median_filter"
     style="margin-left: 10px;" />

```javascript
let imgElement = document.getElementById("imageSrc");
let src = cv.imread(imgElement);
let dst = new cv.Mat();
cv.medianBlur(src, dst, 5);
cv.imshow("canvasOutput", dst);
src.delete();
dst.delete();
```

## 6. smooth image with box filter

The <b>Box Filter</b> is to replace the central element of the kernal area with the average of all the pixels under this area, so the image will get blurred.

```javascript
let imgElement = document.getElementById("imageSrc");
let src = cv.imread(imgElement);
let dst = new cv.Mat();
let ksize = new cv.Size(5, 5);
let anchor = new cv.Point(-1, -1); // Point (-1, -1) means that anchor is at the kernel center
cv.boxFilter(src, dst, -1, ksize, anchor, true, cv.BORDER_DEFAULT); // -1 to use src.depth()
cv.imshow("canvasOutput", dst);
src.delete();
dst.delete();
```