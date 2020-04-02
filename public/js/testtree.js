$(document).ready(function() {
    prepareTree();
});

function prepareTree() {

    >>>
    >>> > kham
    $('#testtree').jstree({
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
            }
        },
        "plugins": ["types"]

    })
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