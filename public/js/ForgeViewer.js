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
            var components = buildModelTree(viewer.model);
            console.log(components);
            prepareTree(components);
            $('#testtree2').jstree(true).refresh();
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