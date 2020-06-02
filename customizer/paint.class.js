

import Fill from './fill.class.js'
import Point from './point.model.js'



export default class Paint{
    

    constructor(canvasId){
        this.canvas = document.getElementById(canvasId)
        this.context = canvas.getContext("2d")
        this.image= document.getElementById("pic")
    
    }




    set selectedColor(color){
        this.color = color
    }

    init(){


        this.context.drawImage(this.image,0,0)
    
        this.canvas.onmousedown = e => this.onMouseDown(e);
    }

    onMouseDown(e){

        this.savedData = this.context.getImageData(0,0,this.canvas.clientWidth, this.canvas.clientHeight)
        this.startPos = this.getMouseCoordinatesOnCanvas(e, this.canvas)

        new Fill(this.canvas, this.startPos, this.color)

    }




    getMouseCoordinatesOnCanvas(e, canvas){
        let rect = canvas.getBoundingClientRect()
        let x = Math.round(e.clientX - rect.left)
        let y = Math.round(e.clientY - rect.top)
        return new Point(x,y)
    }


    

}

