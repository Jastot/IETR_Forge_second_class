$(document).ready(function() {
    prepareTree();
});

function prepareTree() {
    $('#compTree').jstree({
        'core': {
            'multiple': false,
            'check_callback': true,
            'themes': { "icons": true },
            'data': [{
                    text: 'Общие сведения',
                    type: 'info',
                    state: {
                        selected: true
                    },
                    id: 'info'
                }, {
                    text: 'Компоненты',
                    type: 'components',
                    id: 'components'
                },
                {
                    text: 'Принцип работы',
                    type: 'work',
                    id: 'work'
                }, {
                    text: 'Обслуживание',
                    type: 'service',
                    children: [{
                        text: 123,
                        type: 'child'
                    }, {
                        text: 321,
                        type: 'child'
                    }],
                    id: 'service'
                }
            ]
        },
        "types": {
            "default": {
                "icon": false
            },
            "info": {
                "icon": "glyphicon glyphicon-book"
            },
            "work": {
                "icon": "glyphicon glyphicon-cog"
            },
            "components": {
                "icon": "glyphicon glyphicon-list-alt"
            },
            "service": {
                "icon": "glyphicon glyphicon-wrench"
            },
            "child": {
                "icon": "glyphicon glyphicon-menu-right"
            },
            "object": {
                "icon": false
            }
        },
        "plugins": ["types"]
    })
}
// var array = [];

function buildModelTree(model, createNodeFunc = null) {
    //builds model tree recursively
    function _buildModelTreeRec(node) {
        instanceTree.enumNodeChildren(node.dbId,
            function(childId) {
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

// function get_children(arr) {
//     let clone = [];
//     for (const i in arr) {
//         if (arr[i].children instanceof Array && arr[i].children.length > 1) {
//             clone[i] = {
//                 text: `${arr[i].name}`,
//                 id: `comp_${arr[i].dbId}`,
//                 children: get_children(arr[i].children),
//                 type: 'object'
//             };
//             // array.push({
//             //     dbid: arr[i].dbId,
//             //     name: arr[i].name,
//             //     // text: `<span>${arr[i].dbId} и ${arr[i].name}</span>`
//             // })
//             continue;
//         }
//         if (arr[i].name != "Solid1") {
//             clone[i] = {
//                 text: `${arr[i].name}`,
//                 id: `comp_${arr[i].dbId}`,
//                 type: 'object'
//             };
//             // array.push({
//             //     dbid: arr[i].dbId,
//             //     name: arr[i].name,
//             //     // text: `<span>${arr[i].dbId} и ${arr[i].name}</span>`
//             // })
//         }
//     }
//     return clone;
// }

function adjustLayout(name, text) {
    console.log($('#textboard'));
    if ($('#textboard').children().length > 0) {
        $('#textboard').removeClass('slide-pos');
        setTimeout(() => {
            $('#textboard').addClass('slide-pos');
            $('#textInfo').html(`<p class="headtext">${name}</p><p class="maintext">&nbsp;&nbsp;&nbsp;&nbsp;${text}</p>`);
        }, 400);
    } else {
        $('#textboard').html('<div class="panel panel-default"><div class="textInfo" id="textInfo"></div></div>');
        $('#textboard').addClass('slide-pos');
        $('#textInfo').html(`<p class="headtext">${name}</p><p class="maintext">&nbsp;&nbsp;&nbsp;&nbsp;${text}</p>`);
    }


    // $('#textboard').html('<div class="panel panel-default"><div class="textInfo"><p class="headtext">Оппозитный двигатель</p><p class="maintext">&nbsp;&nbsp;&nbsp;&nbsp;Устройство и работа механизма: Оппозитный двигатель построен на принципе двойного сжатия и включает в себя основные элементы: <span class="object" id="korpus">Корпус (М1.01.00.001)</span>, <span class="object" id="poddon">Поддон (М1.01.00.002)</span>,<span class="object" id="cilinder"> Цилиндр (М1.01.00.003)</span>, <span class="object" id="perehodnik">Переходник (М1.01.00.004)</span>, <span class="object" id="pgr">Поршневая группа (М1.01.00.200)</span>. В свою очередь в Поршневую группу входят 2 сборочные единицы: Шатун в сборе (М1.01.00.220) и Поршень малый в сборе (М1.01.00.210). Вращение <span class="object" id="porschen">Поршня (М1.01.00.211)</span> вокруг оси <span class="object" id="prou">проушины Шатуна (М1.01.00.202)</span> в сборочной единице М1.01.00.210 осуществляется за счет свободной посадки на <span class="object" id="palec">Палец (М1.01.00.213)</span>, для исключения износа поверхности Шатуна и Поршня предусмотрена установка между ними <span class="object" id="kolco212">Кольца (М1.01.00.212)</span>. Ограничение осевых перемещений Пальца осуществляется за счет <span class="object" id="kolcoA17">Кольца А17.60С2А ГОСТ 13942-86</span>. Сборочная единица М1.01.00.220 состоит из <span class="object" id="shatun">Шатуна (М1.01.00.202-01)</span> и запрессованного в него <span class="object" id="sharik">шарикоподшипника 60103 ГОСТ 7242-81</span> для обеспечения вращения поршня. Запуск двигателя осуществляется при помощи стартер-генератора, соединенного с двигателем через шлицевую муфту со шлицем d-10х21Н7х26х3 ГОСТ1139-80. Подача топлива в Цилиндры осуществляется совместно с воздухом в виде топливовоздушной смеси через <span class="object" id="patrubokvp">Патрубок впрыска (М1.01.00.110)</span>. Выход продуктов сгорания осуществляется через <span class="object" id="patrubokv">Патрубок выхлопной (М1.01.00.100)</span>. Работа цилиндров осуществляется поочередно в противоходе, открытие впускных и выпускных каналов происходит за счет поступательного движения поршней. Работа внутренних механизмов осуществляется в масленом тумане, создаваемом форсунками, установленными в бобышки верхней части двигателя. Для слива масла вовремя ТО осуществляется с помощью пробки, которая расположена в нижней части Поддона.</p></div></div>');
}