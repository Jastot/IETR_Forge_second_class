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

function get_children(arr) {
    let clone = [];
    for (const i in arr) {
        console.log(arr[i].dbId);
        if (arr[i].children instanceof Array && arr[i].children.length > 1) {
            clone[i] = {
                text: `${arr[i].name}`,
                id: `comp_${arr[i].dbId}`,
                children: get_children(arr[i].children),
                type: 'object'
            };
            continue;
        }
        if (arr[i].name != "Solid1") {
            clone[i] = {
                text: `${arr[i].name}`,
                id: `comp_${arr[i].dbId}`,
                type: 'object'
            };
        }
    }
    return clone;
}