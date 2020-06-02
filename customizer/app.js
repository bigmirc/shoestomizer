
import Paint from "./paint.class.js"


var paint = new Paint("canvas")
paint.selectedColor = "#000000"
paint.init()

document.querySelectorAll("[data-command]").forEach(
    item => {
        item.addEventListener("click", e=>{
            let command = item.getAttribute("data-command")
            if (command === 'download'){
                var canvas = document.getElementById("canvas")
                var image = canvas.toDataURL("image/png",1.0).replace("image/png", "image/octet-stream") //some internet explorer error
                var link = document.createElement("a")
                link.download = "customized.png"
                link.href = image

                link.click()
            }
        })


    }
)


document.querySelectorAll("[data-color]").forEach(
    item=> {
        item.addEventListener("click", e=>{
            document.querySelector("[data-color].active").classList.toggle("active")
            item.classList.toggle("active")


            let color = item.getAttribute("data-color")
            paint.selectedColor = color
        })


    }
)