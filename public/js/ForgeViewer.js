var viewer;
$(document).ready(function() {
    $("#forgeViewer").empty();
    var urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dDhkN3h2anZkY2VjdWx3eXN6ZmVpaWg1ZXZ0Z3RqYm8tZW5naW5lL0VuZ2luZS5zdHA=';
    var urn2 = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dDhkN3h2anZkY2VjdWx3eXN6ZmVpaWg1ZXZ0Z3RqYm8tZW5naW5lL1Rlc3QuZjNk';
    getForgeToken(function(access_token) {
        jQuery.ajax({
            url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn2 + '/manifest',
            headers: { 'Authorization': 'Bearer ' + access_token },
            success: function(res) {
                if (res.status === 'success') launchViewer(urn2);
                else $("#forgeViewer").html('Преобразование всё ещё выполняется').css('color', 'lightblue');
            }
        });
    })
});

function launchViewer(urn) {
    var options = {
        env: 'AutodeskProduction',
        getAccessToken: getForgeToken
    };

    Autodesk.Viewing.Initializer(options, () => {
        viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), {
            extensions: ['HandleSelectionExtension', 'Markup3dExtension', 'Autodesk.Fusion360.Animation']
                //disabledExtensions: { explode: true, bimwalk: true, settings: true, propertiesmanager: true, modelstructure: true }
        });
        viewer.start();
        viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
        var documentId = 'urn:' + urn;
        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);

    });
}

function onDocumentLoadSuccess(doc) {
    var viewables = doc.getRoot().getDefaultGeometry();

    viewer.loadDocumentNode(doc, viewables).then(() => {

        var animationItems = [];
        if (animationItems.length == 0) {
            animationItems = doc.getRoot().search({
                'type': 'folder',
                'role': 'animation'
            }, true);
        }
        if (animationItems.length > 0) {
            viewer.loadModel(doc.getViewablePath(animationItems[0].children[0]), () => {
                viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
            });
        }

        viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (e) => {
            if (e.model.id == animationItems[0].children.length + 1) {
                $("#compTree").jstree("select_node", 'info');
                $("#compTree").jstree("activate_node", 'info');
                viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
                $("#cube-loader").addClass("loaded_hiding");

                setTimeout(() => {
                    $("#cube-loader").css("display", "none");
                    getModel(2);
                }, 500);
            }
        });
    })

    treeEvents();
}

function treeEvents() {
    var isolated;
    var lastNode;

    $("#compTree").on("open_node.jstree", function(e, data) {
        if (data.node.id === 'components') {
            var row = $(".row").children();
            $(row[0]).removeClass('col-sm-2 col-md-2').addClass('col-sm-3 col-md-3');
            viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
        }
    });

    $("#compTree").on("close_node.jstree", function(e, data) {
        if (data.node.id === 'components') {
            var row = $(".row").children();
            $(row[0]).removeClass('col-sm-3 col-md-3').addClass('col-sm-2 col-md-2');
            viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
        }
    });

    $('#compTree').on("activate_node.jstree", function(evt, data) {
        if (data != null && data.node != null) {
            $.ajax({
                url: '/model_id',
                type: 'GET',
                data: { 'type': data.node.type },
                success: function(res) {
                    getModel(Number(res));
                },
                error: function(err) {
                    console.log(err);
                }
            });
            if (data.node.type === 'object') {

                let dbid = data.node.id.substring(data.node.id.lastIndexOf('_') + 1);
                if (isolated != dbid) {
                    $.ajax({
                        url: '/texts/' + dbid,
                        type: 'GET',
                        success: function(res) {
                            let name = res.name;
                            let text = res.text;
                            adjustLayout(name, text);
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    });
                    viewer.isolate(Number(dbid));
                    isolated = dbid;

                    viewer.fitToView(Number(dbid));

                }
            } else if (lastNode != data.node.type) {
                lastNode = data.node.type;

                $.ajax({
                    url: '/tree/texts',
                    type: 'GET',
                    data: { 'type': data.node.type },
                    success: function(res) {
                        let name = res.name;
                        let text = res.text;
                        adjustLayout(name, text);
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
        }
    });
};

var loadedId;

function getModel(id) {
    let modelArray = [1, 2, 3, 4, 5];

    for (item of modelArray) {
        var scene = viewer.impl.modelQueue();
        var model = scene.findModel(item);
        if (item != id) {
            if (model != null) {
                console.log('remove');
                viewer.impl.removeModel(model);
                scene.addHiddenModel(model);
            }
        } else {
            if (loadedId !== id) {
                loadedId = id;
                viewer.showModel(id);
                viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
                console.log('show');
            }
        }
    }
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