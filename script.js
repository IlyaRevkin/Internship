let imgs = document.querySelectorAll('.img');

let dataColor = {
    "0001": {
        "0002": {color:"red", line:"2"},
        "0003": {color:"red", line:"2"},
        "0004": {color:"red", line:"2"},
    },
    "0002": {
        "0001": {color:"red", line:"1"},
        "0003": {color:"red", line:"2"},
        "0004": {color:"red", line:"2"},
    },
    "0003": {
        "0001": {color:"red", line:"1"},
        "0002": {color:"red", line:"1"},
        "0004": {color:"red", line:"2"},
    },
    "0004": {
        "0001": {color:"red", line:"1"},
        "0002": {color:"red", line:"1"},
        "0003": {color:"red", line:"1"},
    },
}

let imgid;
let select;

let selectLeft;
let selectTop;

//Определяет, пересекаются ли объекты
function checkTheLocation(img,id){
    select = document.getElementById(id);
    while (true) {
        let intersects=false;
        imgs.forEach(function (elem){
            let divChild = elem.childNodes[1];
            if(divChild.id===id) return;
            let aLeftOfB = elem.getBoundingClientRect().x+elem.getBoundingClientRect().width < select.getBoundingClientRect().x;
            let aRightOfB = elem.getBoundingClientRect().x > select.getBoundingClientRect().x+select.getBoundingClientRect().width;
            let aAboveB = elem.getBoundingClientRect().y+elem.getBoundingClientRect().height < select.getBoundingClientRect().y;
            let aBelowB = elem.getBoundingClientRect().y > select.getBoundingClientRect().y+select.getBoundingClientRect().height;
            if(!( aLeftOfB || aRightOfB || aAboveB || aBelowB )) {
                intersects=true;
            }
        })
        if (intersects) {
            if (selectLeft==null||selectTop==null) {
                img.style.left=Math.random()*(500)+'px';
                img.style.top=Math.random()*(500)+'px';
            }
            else {
                img.style.left = selectLeft+'px';
                img.style.top = selectTop+'px';
            }
        }
        else break;
    }
}

//Отрисовка стрелок
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
let width = canvas.width = innerWidth
let height = canvas.height = innerHeight

const size = 50

//Отрисовка стрелки
function drawLine(x1, x2, y1, y2,dc){
    context.beginPath()

    context.strokeStyle=dc.color;

    let headlen = 25;
    let dx = x2 - x1;
    let dy = y2 - y1;
    let angle = Math.atan2(dy, dx);
    let arrowAngle = 20;
    let pointShiftFacto;

    if(dc.line==="1") pointShiftFacto = 1.3;
    else pointShiftFacto = 1.7;

    context.moveTo(x1 + size / pointShiftFacto, y1 + size / pointShiftFacto);
    context.lineTo(x2 + size / pointShiftFacto, y2 + size / pointShiftFacto);

    context.lineTo((x2 - headlen * Math.cos(angle - Math.PI / arrowAngle))+ size / pointShiftFacto, (y2 - headlen * Math.sin(angle - Math.PI / arrowAngle))+ size / pointShiftFacto);
    context.moveTo(x2 + size / pointShiftFacto, y2 + size / pointShiftFacto);
    context.lineTo((x2 - headlen * Math.cos(angle + Math.PI / arrowAngle)) + size / pointShiftFacto, (y2 - headlen * Math.sin(angle + Math.PI / arrowAngle)) + size / pointShiftFacto);

    if(dc.line==="1") context.lineWidth = 3;
    else  context.lineWidth = 5;

    context.stroke();
}

//Соединение элементов стрелками
function connect() {
    context.clearRect(0, 0, width, height);
    imgs.forEach(function (img_1){
        let imgChild_1=img_1.childNodes[1];
        imgs.forEach(function (img_2) {
            let imgChild_2=img_2.childNodes[1];
            if(imgChild_1.id===imgChild_2.id) return 0;
            else {
                drawLine(
                    imgChild_2.getBoundingClientRect().x,
                    imgChild_1.getBoundingClientRect().x,
                    imgChild_2.getBoundingClientRect().y,
                    imgChild_1.getBoundingClientRect().y,
                    dataColor[imgChild_1.id][imgChild_2.id]
                )
            }
        })
    })
}

let offsetX;
let offsetY;

imgs.forEach(function (img) {

    connect(img);

    //Произвольное расположение элементов при загрузке страницы
    img.style.left=Math.random()*(500)+'px';
    img.style.top=Math.random()*(500)+'px';

    //Координат мышки на объекте, получение id и положение элемента
    img.addEventListener('dragstart', function (event){
        const id = event.target.id;
        if (id) imgid = id;

        selectLeft=document.getElementById(id).parentElement.offsetLeft;
        selectTop=document.getElementById(id).parentElement.offsetTop;

        offsetX = event.offsetX;
        offsetY = event.offsetY;
    })

    //Отрисовка передвижения объекта
    img.addEventListener('dragover', function (event) {
        if (event.pageY - offsetY >= 0 && event.pageY - offsetY <= 490 && event.pageX - offsetX >= 0 && event.pageX - offsetX <= 490)
        {
            img.style.left = (event.pageX - offsetX) + 'px';
            img.style.top = (event.pageY - offsetY) + 'px';
        }
        connect(img)
    })

    //Изменение расположение объектов
    img.addEventListener('dragend', function () {
        checkTheLocation(img,imgid);
        connect(img);
    })

    document.addEventListener("drop", function() {
    });

    let c=img.childNodes[1];
    checkTheLocation(img,c.id);
})

connect();