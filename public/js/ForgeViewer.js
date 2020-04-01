var viewer;

$(document).ready(function() {
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
    });
});

function launchViewer(urn) {
    var options = {
        env: 'AutodeskProduction',
        getAccessToken: getForgeToken
    };

    Autodesk.Viewing.Initializer(options, () => {
        viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Autodesk.DocumentBrowser', 'HandleSelectionExtension', 'Markup3dExtension'] });
        viewer.start();
        var documentId = 'urn:' + urn;
        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}

function onDocumentLoadSuccess(doc) {
    var viewables = doc.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(doc, viewables).then(i => {
        // documented loaded, any action?
        // viewer.loadExtension('Autodesk.ModelStructure');
        // let ext = viewer.getExtension('Autodesk.ModelStructure');
        // ext.activate();
        // console.log(ext);
        // console.log(ext.isActive());
        viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
<<<<<<< Updated upstream
            var components = buildModelTree(viewer.model);
            console.log(components);
            prepareTree(components);
            $('#testtree2').jstree(true).refresh();
=======
            if (check == false) {
                components = buildModelTree(viewer.model);
                comp_data = components;
                let chi = get_children(comp_data.children);
                $('#testtree').jstree(true).settings.core.data = get_new_data(chi);
                $('#testtree').jstree("refresh");
            }
            check = true;
>>>>>>> Stashed changes
        })
    });
}

function get_new_data(child_data) {
    return [{
            text: 'Общие сведения',
            type: 'info',
            state: {},
            id: 'info'
        }, {
            text: 'Компоненты',
            type: 'components',
            children: child_data

        },
        {
            text: 'Принцип работы',
            type: 'work',
            id: 'work'
        },
        {
            text: 'Обслуживание',
            type: 'service',
            children: [{
                text: 'service1',
                type: 'child'
            }, {
                text: 'service2',
                type: 'child'
            }],
            id: 'service'
        }
    ];
}

function get_children(arr) {
    let clone = [];
    for (const i in arr) {
        if (arr[i].children instanceof Array && arr[i].children.length > 1) {
            clone[i] = {
                text: `${arr[i].name}`,
                children: get_children(arr[i].children)
            };
            continue;
        }
        if (arr[i].name != "Solid1")
            clone[i] = { text: `${arr[i].name}` };
    }
    return clone;
}

function getAlldbIds(rootId) {
    var alldbId = [];
    if (!rootId) {
        return alldbId;
    }
    var queue = [];
    queue.push(rootId);
    while (queue.length > 0) {
        var node = queue.shift();
        alldbId.push(node);
        instanceTree.enumNodeChildren(node, function(childrenIds) {
            queue.push(childrenIds);
        });
    }
    return alldbId;
}

function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
    fetch('/api/forge/oauth/token').then(res => {
        res.json().then(data => {
            callback(data.access_token, data.expires_in);
        });
    });
}

function getActiveConfigurationProperties(viewer) {
    var dbIds = viewer.getSelection();
    if (dbIds.length !== 1) {
        alert("Сначала выберите один элемент!");
        return;
    }

    viewer.getProperties(dbIds[0], (props) => {
        props.properties.forEach(prop => {
            if (prop.displayName === "Active Configuration") {
                viewer.getProperties(prop.displayValue, confProps => {
                    console.log(confProps);
                });
                return;
            }
        })
    })
}