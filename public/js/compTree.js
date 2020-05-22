$(document).ready(function () {
    prepareTree();
    $.ajax({
        url: '/tree',
        type: 'GET',
        success: function (res) {
            for (item in res) {
                $('#compTree').jstree(true).settings.core.data[item] = res[item];
            }
            $('#compTree').jstree(true).refresh();

        },
        error: function (err) {
            console.log(err);
        }
    });
});


function prepareTree() {
    $('#compTree').jstree({
        'core': {
            'multiple': false,
            'check_callback': true,
            'themes': { "icons": true },
            'data': []
        },
        "types": {
            "default": {
                "icon": false
            },
            "info": {
                "icon": "fas fa-book-open"
            },
            "work": {
                "icon": "fas fa-cog"
            },
            "components": {
                "icon": "fas fa-stream"
            },
            "service": {
                "icon": "fas fa-tools"
            },
            "child_service": {
                "icon": "fas fa-wrench"
            },
            "object": {
                "icon": false
            }
        },
        "plugins": ["types"]
    })
}
var array = [];

function buildModelTree(model, createNodeFunc = null) {
    //builds model tree recursively
    function _buildModelTreeRec(node) {
        instanceTree.enumNodeChildren(node.dbId,
            function (childId) {
                var childNode = null;
                if (createNodeFunc) {
                    childNode = createNodeFunc(childId);
                } else {
                    node.children = node.children || [];
                    childNode = {
                        dbId: childId,
                        name: instanceTree.getNodeName(childId)
                    }
                    node.children.push(childNode);
                }
                _buildModelTreeRec(childNode);
            });
    }
    //get model instance tree and root component
    var instanceTree = model.getData().instanceTree;
    var rootId = instanceTree.getRootId();
    var rootNode = {
        dbId: rootId,
        name: instanceTree.getNodeName(rootId)
    }
    _buildModelTreeRec(rootNode);

    return rootNode;
}

function get_new_data(child_data) {
    return {
        text: 'Компоненты',
        type: 'components',
        id: 'components',
        children: child_data
    }
}

function get_children(arr) {
    let clone = [];
    for (let i in arr) {
        if (arr[i].children instanceof Array && arr[i].children.length > 1) {
            clone[i] = {
                text: `${arr[i].name}`,
                id: `comp_${arr[i].dbId}`,
                children: get_children(arr[i].children),
                type: 'object'
            };
            array.push({
                dbid: arr[i].dbId,
                name: arr[i].name,
                // text: `<span>${arr[i].dbId} и ${arr[i].name}</span>`
            })
            continue;
        }
        if (arr[i].name != "Solid1") {
            clone[i] = {
                text: `${arr[i].name}`,
                id: `comp_${arr[i].dbId}`,
                type: 'object'
            };
            array.push({
                dbid: arr[i].dbId,
                name: arr[i].name,
                // text: `<span>${arr[i].dbId} и ${arr[i].name}</span>`
            })
        }
    }
    return clone;
}

function adjustLayout(name, text) {
    if ($('#textboard').children().length > 0) {
        $('#textboard').removeClass('slide-pos');
        setTimeout(() => {
            $('#textboard').addClass('slide-pos');
            $('#textInfo').html(`<p class="headtext">${name}</p><p class="maintext">${text}</p>`);
            btnStart = $('#textboard').find("button")[0];
            if (btnStart) {
                animStart(btnStart.id);
            }
        }, 400);
    } else {
        $('#textboard').html('<div class="panel panel-default"><div class="textInfo" id="textInfo"></div></div>');
        $('#textboard').addClass('slide-pos');
        $('#textInfo').html(`<p class="headtext">${name}</p>${text}`);
        btnStart = $('#textboard').find("button")[0];
        if (btnStart) {
            animStart(btnStart.id);
        }
    }
    // $('#textboard').html('<div class="panel panel-default"><div class="textInfo"><p class="headtext">Оппозитный двигатель</p><p class="maintext">&nbsp;&nbsp;&nbsp;&nbsp;Устройство и работа механизма: Оппозитный двигатель построен на принципе двойного сжатия и включает в себя основные элементы: <span class="object" id="korpus">Корпус (М1.01.00.001)</span>, <span class="object" id="poddon">Поддон (М1.01.00.002)</span>,<span class="object" id="cilinder"> Цилиндр (М1.01.00.003)</span>, <span class="object" id="perehodnik">Переходник (М1.01.00.004)</span>, <span class="object" id="pgr">Поршневая группа (М1.01.00.200)</span>. В свою очередь в Поршневую группу входят 2 сборочные единицы: Шатун в сборе (М1.01.00.220) и Поршень малый в сборе (М1.01.00.210). Вращение <span class="object" id="porschen">Поршня (М1.01.00.211)</span> вокруг оси <span class="object" id="prou">проушины Шатуна (М1.01.00.202)</span> в сборочной единице М1.01.00.210 осуществляется за счет свободной посадки на <span class="object" id="palec">Палец (М1.01.00.213)</span>, для исключения износа поверхности Шатуна и Поршня предусмотрена установка между ними <span class="object" id="kolco212">Кольца (М1.01.00.212)</span>. Ограничение осевых перемещений Пальца осуществляется за счет <span class="object" id="kolcoA17">Кольца А17.60С2А ГОСТ 13942-86</span>. Сборочная единица М1.01.00.220 состоит из <span class="object" id="shatun">Шатуна (М1.01.00.202-01)</span> и запрессованного в него <span class="object" id="sharik">шарикоподшипника 60103 ГОСТ 7242-81</span> для обеспечения вращения поршня. Запуск двигателя осуществляется при помощи стартер-генератора, соединенного с двигателем через шлицевую муфту со шлицем d-10х21Н7х26х3 ГОСТ1139-80. Подача топлива в Цилиндры осуществляется совместно с воздухом в виде топливовоздушной смеси через <span class="object" id="patrubokvp">Патрубок впрыска (М1.01.00.110)</span>. Выход продуктов сгорания осуществляется через <span class="object" id="patrubokv">Патрубок выхлопной (М1.01.00.100)</span>. Работа цилиндров осуществляется поочередно в противоходе, открытие впускных и выпускных каналов происходит за счет поступательного движения поршней. Работа внутренних механизмов осуществляется в масленом тумане, создаваемом форсунками, установленными в бобышки верхней части двигателя. Для слива масла вовремя ТО осуществляется с помощью пробки, которая расположена в нижней части Поддона.</p></div></div>');
}

let btnStart;
var aExt;
let checkCurTime;
let timePoints;
let steps;
let curTimePoint = 0;
let instructions = [{
    'id': 'anim_changePlug',
    'time': [
        [2, 5],
        [5, 10],
        [10, 12.63]
    ]
},
{
    'id': 'anim_changeGasket',
    'time': [
        [2, 5],
        [5, 10],
        [10, 16],
        [16, 24],
    ]
},
{
    'id': 'anim_changeCol',
    'time': [
        [1.2, 3.8],
        [3.8, 6.4],
        [6.4, 9.3],
        [9.3, 11.6],
        [11.6, 14.4],
        [14.4, 20]
    ]
}
];

function animStart(id) {
    for (let item of instructions) {
        if (item.id === id) {
            timePoints = instructions.find(item => item.id == id).time;
            steps = $('#textboard').find('.instruction').parent().get();
        }
    }
    $(`#${id}`).on('click', () => {
        aExt = viewer.getExtension('Autodesk.Fusion360.Animation');
        $('#animToggle').unbind();
        $('#animQuit').unbind();
        if (!aExt.isPlaying()) {
            if (aExt.getCurrentTime() !== 0) {
                aExt.play();
                return;
            }
            if (checkCurTime != 'undefined') {
                clearInterval(checkCurTime);
            }

            aExt.load();
            aExt.play();

            if (id === 'anim_info') {
                $('#tree').removeClass('col-sm-2 col-md-2 col-sm-3 col-md-3').addClass('col-md-0 col-sm-0');
                $('#compTree').jstree("close_all");

                setTimeout(() => {
                    $('.viewer').removeClass('col-sm-6 col-md-6').addClass('col-sm-9 col-md-9');
                    viewer.resize();
                }, 800);

                $('#animQuit').on('click', () => {
                    aExt.setTimelineValue(0);
                    $('#toolbar-animation-Close').click();
                    $('.viewer').removeClass('col-sm-9 col-md-9').addClass('col-sm-6 col-md-6');
                    viewer.resize();
                    $('#anim_info').prop('disabled', false);
                    $('#tree').removeClass('col-sm-0 col-md-0').addClass('col-md-2 col-sm-2');
                    $('#animQuit').css('display', 'none');
                    $('#animToggle').css('display', 'none');
                    $('.homeViewWrapper').click();
                });
            } else {
                $('#animQuit').on('click', () => {
                    aExt.setTimelineValue(0);
                    $('#toolbar-animation-Close').click();
                    $(`#${id}`).prop('disabled', false);
                    $('#animQuit').css('display', 'none');
                    $('#animToggle').css('display', 'none');
                    $('.homeViewWrapper').click();
                    if (steps !== undefined) {
                        for (let index in steps) {
                            $(steps[index]).removeClass('activeText');
                        }
                    }
                });
            }

            $('.animation-timeline').on('change', () => {
                $('#animToggle').html('<i class="fas fa-play"></i>');
            });

            $('.animation-timeline').on('input', () => {
                if (timePoints && steps.length > 0) {
                    if (checkCurTime != 'undefined') {
                        clearInterval(checkCurTime);
                        checkCurTime = setInterval(() => {
                            changeInstruction();
                        }, 50);
                    }
                }
            });

            viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, () => {
                if (!aExt.isPlaying()) {
                    $('#animToggle').html('<i class="fas fa-play"></i>');
                }
            });

            $('#animToggle').html('<i class="fas fa-pause"></i>');
            $(`#${id}`).prop('disabled', true);

            $('#animQuit').css('display', 'inline-block');
            $('#animToggle').css('display', 'inline-block');
            $('#animToggle').on('click', () => {
                if (aExt.isPlaying()) {
                    $('#animToggle').html('<i class="fas fa-play"></i>');
                    aExt.pause();
                } else {
                    $('#animToggle').html('<i class="fas fa-pause"></i>');
                    aExt.play();
                }
            });

            if (timePoints && steps.length > 0) {
                checkCurTime = setInterval(() => {
                    changeInstruction();
                }, 100);
            }
        }

    });
}

function changeInstruction() {
    for (let i = 0; i <= steps.length - 1; i++) {
        if (aExt.getCurrentTime() == aExt.getDuration()) {
            $(steps[steps.length - 1]).removeClass('activeText');
            $('#animToggle').html('<i class="fas fa-play"></i>');
            break;
        }
        if ((aExt.getCurrentTime() >= timePoints[i][0] && aExt.getCurrentTime() < timePoints[i][1])) {
            changeSteps(i);
            curTimePoint = timePoints[i];
            break;
        }
    }
}

function changeSteps(index) {
    for (let item of steps) {
        if (item === steps[index])
            $(item).addClass('activeText');
        else
            $(item).removeClass('activeText');
    }
}