$(document).ready(function() {
    prepareTree();
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
                    state: {},
                    id: 'info'
                }, {
                    text: 'Компоненты',
                    type: 'components',
                    children: [{
                        text: 1,
                        type: 'child'
                    }, {
                        text: 2,
                        type: 'child'
                    }],
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
    }).on('loaded.jstree', function() {
        $('#testtree').jstree('open_all');
    }).bind("activate_node.jstree", function(evt, data) {
        if (data != null && data.node != null) {
            $("#forgeViewer").empty();
            var elem = document.getElementById("textboard");
            if (elem != null) elem.parentNode.removeChild(elem);
            var urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dDhkN3h2anZkY2VjdWx3eXN6ZmVpaWg1ZXZ0Z3RqYm8tZW5naW5lL0VuZ2luZS5zdHA=';
            getForgeToken(function(access_token) {
                jQuery.ajax({
                    url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    success: function(res) {
                        if (res.status === 'success') launchViewer(urn);
                        else $("#forgeViewer").html('Преобразование всё ещё выполняется').css('color', 'white');
                    },
                    error: function(err) {
                        var msgButton = 'Этот файл еще не преобразован! ' +
                            '<button class="btn btn-xs btn-info" id="translateObject" onclick="translateObject()"><span class="glyphicon glyphicon-eye-open"></span> ' +
                            'Начать преобразование</button>'
                        $("#forgeViewer").html(msgButton).css('color', 'white');
                    }
                });
            })
        }
    });;
}