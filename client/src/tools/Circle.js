import Tool from "./Tool"

export default class Circle extends Tool{
    // наследуемый класс
    constructor(canvas) {
        // вызывает конструктор родительского класса
        super(canvas)
        this.listen()
    }

    listen() {
        // bind к текущему контексту, чтобы мы могли внутри функций обращаться к ключевому слову this
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
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
            let width = currentX - this.startX;
            let height = currentY - this.startY;
            let r = Math.abs(width/2);
            this.draw(currentX, currentY, r);
        }
    }

    draw(currentX, currentY, r) {
        const img = new Image();
        img.src = this.saved;
        img.onload = (() => {
            // при каждом след. движении мыши будет очищаться канвас и рисоваться сохраненная img последнего прямоугольника
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath();
            if (currentX > this.startX && currentY > this.startY) {
                this.ctx.arc(this.startX + r, this.startY + r, r, 0, 2*Math.PI)
            }
            else if (currentX < this.startX && currentY < this.startY) {
                this.ctx.arc(this.startX - r, this.startY - r, r, 0, 2*Math.PI)
            }
            else if (currentX < this.startX && currentY > this.startY) {
                this.ctx.arc(this.startX - r, this.startY + r, r, 0, 2*Math.PI)
            }
            else if (currentX > this.startX && currentY < this.startY) {
                this.ctx.arc(this.startX + r, this.startY - r, r, 0, 2*Math.PI)
            }
            // заливка
            this.ctx.fill();
            // обводка
            this.ctx.stroke();
        })
    }

}