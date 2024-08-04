const canvas = document.querySelector("canvas"),
toolBtns=document.querySelectorAll(".tool"),
fillColor=document.querySelector("#fill-color"),
sizeSlider=document.querySelector("#size-slider"),
colorBtns=document.querySelectorAll(".colors .option"),
clearCanvas=document.querySelector(".clear-canvas"),
saveImg=document.querySelector(".save-img"),
ctx = canvas.getContext('2d', { willReadFrequently: true });
// const shapeSelect = document.getElementById('shape-select'); 

// //global variables1
let prevMouseX,prevMouseY,snapshot,
isDrawing = false,
selectedTool="brush",
brushWidth= 5,
selectedColor="#000";


const setCanvasBackground=()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;
}
window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect=(e)=>{
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX, prevMouseY-e.offsetY);
    }
    ctx.fillRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX, prevMouseY-e.offsetY);
    
}

const drawCircle=(e)=>{
    ctx.beginPath();
    let radius=Math.sqrt(Math.pow(prevMouseX-e.offsetX,2)+Math.pow(prevMouseY-e.offsetY,2));
    ctx.arc(prevMouseX,prevMouseY,radius,50,0,2*Math.PI);
    if (fillColor.checked) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

const drawTriangle=(e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);//moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX,e.offsetY);//creating first line of triangle
    ctx.lineTo(prevMouseX*2-e.offsetX,e.offsetY); //creating bottom line of triangle
    ctx.closePath(); //close the path of the rectangle.
    ctx.stroke();
    if (fillColor.checked) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}
const starDraw=(e)=>{
    isDrawing=true;
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY;
    ctx.beginPath();   //create a new path
    ctx.lineWidth= brushWidth; //passing brushsizwe as line width 
    snapshot = ctx.getImageData(0,0,canvas.width,canvas.height); //taking snapshot of canvas
}



const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0); //restoring the snapshot
    if(selectedTool==="brush" || selectedTool==="eraser"){
        ctx.strokeStyle=selectedTool === "eraser" ?  "#fff" : selectedColor;
        ctx.lineTo(e.offsetX,e.offsetY);   //creaing line according to pointer movement
        ctx.stroke(); 
    }
    else if(selectedTool ==="rectangle"  ){
        drawRect(e);
    }else if(selectedTool ==="circle"  ){
        drawCircle(e);
    }
    else{
        drawTriangle(e);
        }
} 



sizeSlider.addEventListener("change",() =>brushWidth=sizeSlider.value);

toolBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool=btn.id;
        console.log(selectedTool);
    });
});

// // shapeSelect.addEventListener('change', function() {
// //     console.log('Selected shape:', this.value);
// // });


// colorBtns.forEach(btn=>{
//     btn.addEventListener("click",()=>{
//         document.querySelector(".options .selected").classList.remove("selected");
//         // btn.classList.add("selected");
//         selectedColorwindow.getComputedStyle(btn).getPropertyValue("background-color"));
//         console.log(btn);
//     });
// });

clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackground();
});
//this is how you save image
saveImg.addEventListener("click",()=>{
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    link.click();
    });

canvas.addEventListener("mousedown",starDraw); 
canvas.addEventListener("mousemove",drawing); 
canvas.addEventListener("mouseup",() => isDrawing=false); 

