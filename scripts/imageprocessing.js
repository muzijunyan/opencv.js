let imageProcessingRadios = [
  {
    id: "rgba2gray",
    desc: "rgba to gray",
    checked: true
  },
  {
    id: "extractChannel",
    desc: "extract channel: ",
    select: ["red", "green", "blue"],
    handler: channelChangeEventHandler
  },
  {
    id: "extractLightness",
    desc: "extract lightness channel"
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
  },
  {
    id: "canny",
    desc: "canny edge detection with lower threshold: ",
    lowThreshold: [50, 100],
    handler: thresholdChangeEventHandler
  }
];

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

  extractLightness: () => {
    let src = imageProcessor.imageSource();
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
    cv.Sobel(src, dstx, cv.CV_32F, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
    // sobel operation on the y-axis
    cv.Sobel(src, dsty, cv.CV_32F, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);

    // cv.convertScaleAbs(dstx, dstx, 1, 0); // take its absolute value and then convert back to cv.CV_8U
    // cv.convertScaleAbs(dsty, dsty, 1, 0);
    // merge the images
    // cv.addWeighted(dstx, 0.5, dsty, 0.5, 0, dst);

    // calculate the magnitude of the 2 images
    cv.magnitude(dstx, dsty, dst);
    // set back to cv.CV_8U space
    cv.convertScaleAbs(dst, dst, 1, 0);
    // show the result and release objects
    cv.imshow("canvasOutput", dst);
    src.delete();
    dstx.delete();
    dsty.delete();
    dst.delete();
  },

  canny: (lowThreshold = 50) => {
    let src = imageProcessor.imageSource();
    let dst = new cv.Mat();
    cv.Canny(src, dst, parseFloat(lowThreshold), parseFloat(lowThreshold) * 3, 3, false);
    cv.imshow("canvasOutput", dst);
    src.delete();
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

function channelChangeEventHandler(event) {
  // You can use “this” to refer to the selected element.
  let taskName = event.target.parentElement.getAttribute("for");
  if (imageTask() === taskName) {
    imageProcessor[taskName](event.target.selectedIndex);
  }
}

function thresholdChangeEventHandler(event) {
  let taskName = event.target.parentElement.getAttribute("for");
  if (imageTask() === taskName) {
    imageProcessor[taskName](event.target.value);
  }
  document.getElementById(taskName + "SpanRangeValue").innerHTML = " " + event.target.value;
}

function div_radioOption(
  id,
  name,
  text,
  chekced = false,
  select = [],
  threshold = [],
  handler
) {
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
  label.setAttribute("id", "label_" + id);
  let labelContent = document.createTextNode(" " + text);
  label.appendChild(labelContent);

  if (select.length > 0) {
    let selectElement = document.createElement("select");
    let selectID = id + "Select";
    selectElement.setAttribute("id", selectID);
    selectElement.setAttribute("name", selectID);

    select.forEach(option => {
      let optionElement = document.createElement("option");
      optionElement.setAttribute("value", option);
      let optionContent = document.createTextNode(" " + option);
      optionElement.appendChild(optionContent);
      selectElement.appendChild(optionElement);
    });
    selectElement.onchange = handler;
    label.appendChild(selectElement);
  }

  if (threshold.length === 2) {
    let rangeInputElement = document.createElement("input");
    rangeInputElement.setAttribute("type", "range");
    rangeInputElement.setAttribute("id", id + "Range");
    rangeInputElement.setAttribute("value", "" + threshold[0]);
    rangeInputElement.setAttribute("min", "" + threshold[0]);  
    rangeInputElement.setAttribute("max", "" + threshold[1]);  
    rangeInputElement.setAttribute("step", "1");  
    rangeInputElement.oninput = handler; 
    label.appendChild(rangeInputElement);
    let spanRangeValue = document.createElement("span");
    spanRangeValue.setAttribute("id", id + "SpanRangeValue")
    let labelRangeValue = document.createTextNode(" " + threshold[0]);
    spanRangeValue.appendChild(labelRangeValue)
    label.appendChild(spanRangeValue);
  } 

  div.appendChild(input);
  div.appendChild(label);
  return div;
}

function setImageTasks() {
  let radioGroupElement = document.getElementById("radioGroupImageProcessing");

  imageProcessingRadios.forEach(radio => {
    radioGroupElement.appendChild(
      div_radioOption(
        radio.id,
        "imageprocessing",
        radio.desc,
        radio.checked,
        radio.select,
        radio.lowThreshold,
        radio.handler
      )
    );
  });

  let taskElements = document.getElementsByName("imageprocessing");
  taskElements.forEach(taskElement => {
    taskElement.addEventListener(
      "change",
      e => {
        let options = imageProcessingRadios.filter(radio => {
          return (
            e.target.value === radio.id &&
            radio.select &&
            radio.select.length > 0
          );
        });
        let range = imageProcessingRadios.filter(radio => {
          return (
            e.target.value === radio.id &&
            radio.lowThreshold &&
            radio.lowThreshold.length === 2
          );
        });
        if (options.length > 0) {
          let select = "select[name='" + e.target.value + "Select']";
          let optionID = document.querySelector(select).selectedIndex;
          imageProcessor[e.target.value](optionID);
        } else if (range.length > 0) {
          let id = e.target.value + "Range";
          let rangeInput = document.getElementById(id);
          imageProcessor[e.target.value](rangeInput.value);
        } else {
          imageProcessor[e.target.value]();
        } 
      },
      false
    );
  });
}
