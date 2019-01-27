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
    }
}

let imageTask = () => {
    let taskElement = document.getElementsByName("imageprocessing");
    let i;
    for (i = 0; i < taskElement.length; i++) {
      if (taskElement[i].type == "radio" && taskElement[i].checked) {
          return taskElement[i].value;
      }
    }
}

function onOpencvJSLoaded() {
    document.getElementById("loadOpenCV").innerHTML = "";
}