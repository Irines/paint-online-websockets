import Tool from "./Tool"

export default class Rect extends Tool{
    // наследуемый класс
    constructor(canvas, socket, id) {
        // вызывает конструктор родительского класса
        super(canvas, socket, id)
        this.listen()
    }

    listen() {
        // bind к текущему контексту, чтобы мы могли внутри функций обращаться к ключевому слову this
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler(e) {
        console.log("ctx full info", this.ctx)
        // синхронизация данных холстов при рисовании прямоуг. будет отличаться от кисти, т.к. там данные отправляли на вебсокет при mousemove,
        // а здесь сделаем это в mouseup единожды, нарисовал прямоугольник - отпустил мышку.
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'rect',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                color: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeStyle
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();

        // таким образом получаем координаты курсора мышки
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        // The standard MIME type for the image format to return. 
        // If you do not specify this parameter, the default value is a PNG format image.
        // Returns the content of the current canvas as an image that you can use as a source for another canvas or an HTML element.
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e) {
        if (this.mouseDown === true) {
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.startX;
            this.height = currentY - this.startY;
            this.draw(this.startX, this.startY, this.width, this.height);
        }
    }

    draw(x, y, w, h) {
        // старая ф-ция, где мы затирали старые изображения прямоуг., рисовали только финальный image
        const img = new Image();
        img.src = this.saved;
        img.onload = (() => {
            // при каждом след. движении мыши будет очищаться канвас и рисоваться сохраненная img последнего прямоугольника
            // The CanvasRenderingContext2D.clearRect() method of the Canvas 2D API erases the pixels in a rectangular area by setting them to transparent black.
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath();
            this.ctx.rect(x, y, w, h);
            // заливка
            this.ctx.fill();
            // обводка
            this.ctx.stroke();
        })

    }

    static staticDraw(ctx, x, y, w, h, color, strokeColor) {
        ctx.fillStyle = color;
        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        // заливка
        ctx.fill();
        // обводка
        ctx.stroke();
    }

}