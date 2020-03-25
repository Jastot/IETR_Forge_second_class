$(document).ready(function() {
    prepareTree();
    $('#testtree').on('loaded.jstree', function() {
        $('#testtree').jstree('open_all');
        $('#testtree').jstree(true).select_node($('#testtree').jstree(true)[0]);
    });

});

function prepareTree() {
    $('#testtree').jstree({
        'core': {
            'multiple': false,
            'check_callback': true,
            'themes': { "icons": true },
            'data': [{
                    text: 'Общие сведения',
                    type: 'info',
                    state: {
                        'selected': true
                    }
                }, {
                    text: 'Компоненты',
                    type: 'components',
                    children: [{
                        text: 1,
                        type: 'child'
                    }, {
                        text: 2,
                        type: 'child'
                    }]
                },
                {
                    text: 'Принцип работы',
                    type: 'work'
                }, {
                    text: 'Обслуживание',
                    type: 'service',
                    children: [{
                        text: 123,
                        type: 'child'
                    }, {
                        text: 321,
                        type: 'child'
                    }]
                }
            ]
        },
        "types": {
            "default": {
                "icon": "glyphicon glyphicon-flash"
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
            }
        },
        "plugins": ["types"]
    });
}
// var data = [{
//     text: 'Общие сведения',
//     type: 'par'
// }, {
//     text: 'Компоненты',
//     type: 'par',
//     nodes: [{
//         text: 1,
//         type: 'child'
//     }, {
//         text: 2,
//         type: 'child'
//     }, {
//         text: 'Принцип работы',
//         type: 'par'
//     }]
// }];