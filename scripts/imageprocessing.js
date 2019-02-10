let imageProcessor = {
  imageSource: () => {
    let imgElement = document.getElementById("imageSrc");
    return cv.imread(imgElement);
  },

  rgba2gray: () => {
    let src = imageProcessor.imageSource();
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow("canvasOutput", dst);
    src.delete();
    dst.delete();
  },

  extractChannel: (channelId = 0) => {
    let src = imageProcessor.imageSource();
    let R = new cv.Mat();

    // extract channels
    let rgbaPlanes = new cv.MatVector();
    // split the Mat
    cv.split(src, rgbaPlanes);
    // get channel with given id
    R = rgbaPlanes.get(channelId);
    cv.imshow("canvasOutput", R);

    // release objects
    src.delete();
    rgbaPlanes.delete();
    R.delete();
  },

  medianFilter: () => {
    let src = imageProcessor.imageSource();
    let dst = new cv.Mat();
    cv.medianBlur(src, dst, 3);
    cv.imshow("canvasOutput", dst);
    src.delete();
    dst.delete();
  },

  boxFilter: (boxFilter = true, normalized = true) => {
    let src = imageProcessor.imageSource();
    let dst = new cv.Mat();
    let ksize = new cv.Size(3, 3);
    let anchor = new cv.Point(-1, -1); // Point (-1, -1) means that anchor is at the kernel center
    if (boxFilter === true) {
      cv.boxFilter(src, dst, -1, ksize, anchor, normalized, cv.BORDER_DEFAULT); // -1 to use src.depth()
    } else {
      cv.blur(src, dst, ksize, anchor, cv.BORDER_DEFAULT);
    }
    cv.imshow("canvasOutput", dst);
    src.delete();
    dst.delete();
  },

  sobel: () => {
    let src = imageProcessor.imageSource();
    let dstx = new cv.Mat();
    let dsty = new cv.Mat();
    let dst = new cv.Mat();
    // convert to gray image
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
    // sobel operation on the x-axis
    cv.Sobel(src, dstx, cv.CV_16S, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
    cv.convertScaleAbs(dstx, dstx, 1, 0); // take its absolute value and then convert back to cv.CV_8U
    // sobel operation on the y-axis
    cv.Sobel(src, dsty, cv.CV_16S, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
    cv.convertScaleAbs(dsty, dsty, 1, 0);
    // merge the images
    cv.addWeighted(dstx, 0.5, dsty, 0.5, 0, dst);
    // show the result and release objects
    cv.imshow("canvasOutput", dst);
    src.delete();
    dstx.delete();
    dsty.delete();
    dst.delete();
  }
};

let imageTask = () => {
  let taskElement = document.getElementsByName("imageprocessing");
  let i;
  if (taskElement.length > 0) {
    for (i = 0; i < taskElement.length; i++) {
      if (taskElement[i].type == "radio" && taskElement[i].checked) {
        return taskElement[i].value;
      }
    }
    return taskElement[0].value;
  }
};

function onOpencvJSLoaded() {
  document.getElementById("loadOpenCV").innerHTML = "";
}

function div_radioOption(id, name, text, chekced = false) {
  let div = document.createElement("div");
  let input = document.createElement("input");
  input.setAttribute("type", "radio");
  input.setAttribute("id", id);
  input.setAttribute("name", name);
  input.setAttribute("value", id);
  if (chekced === true) {
    input.setAttribute("checked", "");
  }
  let label = document.createElement("label");
  label.setAttribute("for", id);
  let labelContent = document.createTextNode(" " + text);
  label.appendChild(labelContent);
  div.appendChild(input);
  div.appendChild(label);
  return div;
}

function setImageTasks() {
  let radioGroupElement = document.getElementById("radioGroupImageProcessing");
  let imageProcessingRadios = [
    {
      id: "rgba2gray",
      desc: "rgba to gray",
      checked: true
    },
    {
      id: "extractChannel",
      desc: "extract red channel"
    },
    {
      id: "medianFilter",
      desc: "smooth image via median filter"
    },
    {
      id: "boxFilter",
      desc: "smooth image via box filter"
    },
    {
      id: "sobel",
      desc: "edge detection via sobel filter"
    }
  ];
  imageProcessingRadios.forEach(radio => {
    radioGroupElement.appendChild(
      div_radioOption(radio.id, "imageprocessing", radio.desc, radio.checked)
    );
  });

  let taskElement = document.getElementsByName("imageprocessing");
  let i;
  for (i = 0; i < taskElement.length; i++) {
    taskElement[i].addEventListener(
      "change",
      e => {
        imageProcessor[e.target.value]();
      },
      false
    );
  }
}
