$(document).ready(function() {
    prepareTree(null);
});

function prepareTree(components) {
    if (components == null) {
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
                        children: {},
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
        }).bind("activate_node.jstree", function(evt, data) {
            if (data != null && data.node != null) {
                $("#forgeViewer").empty();
                var urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dDhkN3h2anZkY2VjdWx3eXN6ZmVpaWg1ZXZ0Z3RqYm8tZW5naW5lL0VuZ2luZS5zdHA=';
                getForgeToken(function(access_token) {
                    jQuery.ajax({
                        url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        success: function(res) {
                            if (res.status === 'success') launchViewer(urn);
                            else $("#forgeViewer").html('Преобразование всё ещё выполняется').css('color', 'white');
                        }
                    });
                })
            }
        });
    } else {
        $('#testtree2').jstree({
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
                        children: function() {
                            components.forEach((item) => {
                                console.log(5);
                                return { 'text': item.name };
                            });
                        },
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
        }).bind("activate_node.jstree", function(evt, data) {
            if (data != null && data.node != null) {
                $("#forgeViewer").empty();
                var urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dDhkN3h2anZkY2VjdWx3eXN6ZmVpaWg1ZXZ0Z3RqYm8tZW5naW5lL0VuZ2luZS5zdHA=';
                getForgeToken(function(access_token) {
                    jQuery.ajax({
                        url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        success: function(res) {
                            if (res.status === 'success') launchViewer(urn);
                            else $("#forgeViewer").html('Преобразование всё ещё выполняется').css('color', 'white');
                        }
                    });
                })
            }
        });
    }

}

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