$(document).ready(function() {
    $(document).on('DOMNodeInserted', function(e) {
        if ($(e.target).hasClass('orbit-gizmo')) {
            // to make sure we get the viewer, let's use the global var NOP_VIEWER
            if (NOP_VIEWER === null || NOP_VIEWER === undefined) return;
            adjustLayout();
        }
    });
})

function adjustLayout() {
    // this function may vary for layout to layout...
    // for learn forge tutorials, let's get the ROW and adjust the size of the 
    // columns so it can fit the new dashboard column, also we added a smooth transition css class for a better user experience
    // var elem = document.getElementById("textboard");
    // if (elem != null) elem.parentNode.removeChild(elem);
    // var row = $(".row").children();
    $('.viewer').after('<div class="col-sm-3 col-md-3 fill textboard" id="textboard"><div class = "panel panel-default"><p class="headtext">Оппозитный двигатель</p><span class="line"></span><p class="maintext">&nbsp;&nbsp;&nbsp;&nbsp;Устройство и работа механизма: Оппозитный двигатель построен на принципе двойного сжатия и включает в себя основные элементы: <span class="object" id="korpus">Корпус (М1.01.00.001)</span>, <span class="object" id="poddon">Поддон (М1.01.00.002)</span>,<span class="object" id="cilinder"> Цилиндр (М1.01.00.003)</span>, <span class="object" id="perehodnik">Переходник (М1.01.00.004)</span>, <span class="object" id="pgr">Поршневая группа (М1.01.00.200)</span>. В свою очередь в Поршневую группу входят 2 сборочные единицы: Шатун в сборе (М1.01.00.220) и Поршень малый в сборе (М1.01.00.210). Вращение <span class="object" id="porschen">Поршня (М1.01.00.211)</span> вокруг оси <span class="object" id="prou">проушины Шатуна (М1.01.00.202)</span> в сборочной единице М1.01.00.210 осуществляется за счет свободной посадки на <span class="object" id="palec">Палец (М1.01.00.213)</span>, для исключения износа поверхности Шатуна и Поршня предусмотрена установка между ними <span class="object" id="kolco212">Кольца (М1.01.00.212)</span>. Ограничение осевых перемещений Пальца осуществляется за счет <span class="object" id="kolcoA17">Кольца А17.60С2А ГОСТ 13942-86</span>. Сборочная единица М1.01.00.220 состоит из <span class="object" id="shatun">Шатуна (М1.01.00.202-01)</span> и запрессованного в него <span class="object" id="sharik">шарикоподшипника 60103 ГОСТ 7242-81</span> для обеспечения вращения поршня. Запуск двигателя осуществляется при помощи стартер-генератора, соединенного с двигателем через шлицевую муфту со шлицем d-10х21Н7х26х3 ГОСТ1139-80. Подача топлива в Цилиндры осуществляется совместно с воздухом в виде топливовоздушной смеси через <span class="object" id="patrubokvp">Патрубок впрыска (М1.01.00.110)</span>. Выход продуктов сгорания осуществляется через <span class="object" id="patrubokv">Патрубок выхлопной (М1.01.00.100)</span>. Работа цилиндров осуществляется поочередно в противоходе, открытие впускных и выпускных каналов происходит за счет поступательного движения поршней. Работа внутренних механизмов осуществляется в масленом тумане, создаваемом форсунками, установленными в бобышки верхней части двигателя. Для слива масла вовремя ТО осуществляется с помощью пробки, которая расположена в нижней части Поддона.</p></div></div>');
}
window.addEventListener('click', e => {
    if ($(e.target).hasClass('object')) {
        if ((e.target.id) == "pgr") {
            let array = [15, 17, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 36, 38, 40, 42, 44, 46, 48, 51, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 117, 119, 121, 123, 125, 127, 129, 131, 133, 135, 137, 139, 141, 143, 145, 147, 150, 164, 166, 168, 170, 172, 174, 176, 178, 180, 183, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 199, 201, 203, 207, 209, 211, 213];
            viewer.isolate(array);
            viewer.fitToView(array[0]);
        }
        if ((e.target.id) == "korpus") {
            let array = 4;
            viewer.isolate(array);
            viewer.fitToView(array);
        }
        if ((e.target.id) == "poddon") {
            let array = 393;
            viewer.isolate(array);
            viewer.fitToView(array);
        }
        if ((e.target.id) == "cilinder") {
            let array = [217, 237];
            viewer.isolate(array);
            viewer.fitToView(array[0]);
        }
        if ((e.target.id) == "perehodnik") {
            let array = [255, 261];
            viewer.isolate(array);
            viewer.fitToView(array[0]);
        }
        if ((e.target.id) == "porschen") {
            let array = [86, 119];
            viewer.isolate(array);
            viewer.fitToView(array[0]);
        }
        console.log(e.target.id);
        if ((e.target.id) == "prou") {
            let array = [84, 117];
            viewer.isolate(array);
            viewer.fitToView(array[0]);
        }
        if ((e.target.id) == "palec") {
            let array = [92, 125];
            viewer.isolate(array);
            viewer.fitToView(array[0]);
        }
        if ((e.target.id) == "kolco212") {
            let array = [94, 96, 127, 129];
            viewer.isolate(array);
            viewer.fitToView(array[0]);
        }
        if ((e.target.id) == "kolcoA17") {
            let array = [475, 477, 479, 481];
            viewer.isolate(array);
            viewer.fitToView(array[0]);
        }
        if ((e.target.id) == "shatun") {
            let array = 20;
            viewer.isolate(array);
            viewer.fitToView(array);
        }
        if ((e.target.id) == "sharik") {
            let array = [30, 32, 22, 28, 26, 24, 23, 25, 27, 29, 31];
            viewer.isolate(array);
            viewer.fitToView(array[1]);
        }
        if ((e.target.id) == "patrubokvp") {
            let array = [425, 427, 423, 431, 429];
            viewer.isolate(array);
            viewer.fitToView(array[1]);
        }
        if ((e.target.id) == "patrubokv") {
            let array = [416, 418, 414, 412];
            viewer.isolate(array);
            viewer.fitToView(array[0]);
        }
    }
})