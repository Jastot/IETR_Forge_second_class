var viewer;

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
let check = false;
var components;
var comp_data;

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
            if (check == false) {
                components = buildModelTree(viewer.model);
                console.log(components);
                comp_data = components;
                console.log(comp_data.children);
                let chi = get_children(comp_data.children);
                $('#testtree').jstree(true).settings.core.data = get_new_data(chi);
                console.log(chi);
                $('#testtree').jstree("refresh");
            }
            check = true;
        })
    });
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
            text: 'Дурка',
            type: 'components',
            id: 'durka'
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
                text: 123,
                type: 'child'
            }, {
                text: 321,
                type: 'child'
            }],
            id: 'service'
        }
    ];
}

function get_children(arr) {
    let clone = [];
    for (const i in arr) {
        if (arr[i].children instanceof Array && arr[i].children.length > 1 && arr[i].name != "Solid1") {
            clone[i] = {
                text: `${arr[i].name}`,
                children: get_children(arr[i].children)
            };
            continue;
        }
        clone[i] = { text: `${arr[i].name}` };
    }
    return clone;
}