var viewer;
$(document).ready(function () {
    $("#forgeViewer").empty();
    var urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dDhkN3h2anZkY2VjdWx3eXN6ZmVpaWg1ZXZ0Z3RqYm8tZW5naW5lL0xhc3RvdmF5YS5mM2Q=';
    getForgeToken(function (access_token) {
        jQuery.ajax({
            url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
            headers: { 'Authorization': 'Bearer ' + access_token },
            success: function (res) {
                if (res.status === 'success') launchViewer(urn);
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
            extensions: ['HandleSelectionExtension', 'Markup3dExtension', 'Autodesk.Fusion360.Animation', 'Autodesk.ViewCubeUi']
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
        console.log(animationItems[0].children);
        if (animationItems.length > 0) {
            for (let i = 0; i <= animationItems[0].children.length - 1; i++) {
                viewer.loadModel(doc.getViewablePath(animationItems[0].children[i]), () => {
                    viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
                });
            }
        }

        viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (e) => {
            // let components = buildModelTree(viewer.model);
            // let comp_data = components;
            // let chi = get_children(comp_data.children);
            if (e.model.id === 4) {
                $("#compTree").jstree("select_node", 'info');
                $("#compTree").jstree("activate_node", 'info');
                viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
                $("#cube-loader").addClass("loaded_hiding");
                setTimeout(() => {
                    $("#cube-loader").css("display", "none");
                    // console.log(viewer.impl.modelQueue().getModels());
                }, 500);
            }
        });
    })

    treeEvents();


}

let isolated;
let lastNode;

function treeEvents() {
    $("#compTree").on("open_node.jstree", function (e, data) {
        if (data.node.id === 'components' || data.node.id === 'service') {
            var row = $(".row").children();
            $(row[0]).removeClass('col-md-2').addClass('col-md-3');
            setTimeout(() => {
                viewer.resize();
            }, 450);
            viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
        }
    });

    $("#compTree").on("close_node.jstree", function (e, data) {
        if ((data.node.id === 'components' || data.node.id === 'service') && !$("#compTree").jstree(true).get_node("components").state.opened && !$("#compTree").jstree(true).get_node("service").state.opened) {
            var row = $(".row").children();
            $(row[0]).removeClass('col-md-3').addClass('col-md-2');
            setTimeout(() => {
                viewer.resize();
            }, 450);
            viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
        }
    });

    $('#compTree').on("activate_node.jstree", function (evt, data) {
        if (data != null && data.node != null) {
            if (data.node.type !== 'child_service') {
                $.ajax({
                    url: '/model_id/type',
                    type: 'GET',
                    data: { 'type': data.node.type },
                    success: function (res) {
                        getModel(Number(res));

                    },
                    error: function (err) {
                        console.log(err);
                    }
                }).then(getText(data));
            } else {
                $.ajax({
                    url: '/model_id/id',
                    type: 'GET',
                    data: { 'id': data.node.id },
                    success: function (res) {
                        getModel(Number(res));
                    },
                    error: function (err) {
                        console.log(err);
                    }
                }).then(getText(data));
            }
        }
    });
};

let curModel;


function getText(data) {
    if (data.node.type === 'object') {
        let dbid = data.node.id.substring(data.node.id.lastIndexOf('_') + 1);
        if (isolated != dbid) {
            lastNode = data.node.type;
            $.ajax({
                url: '/texts/' + dbid,
                type: 'GET',
                success: function (res) {
                    let name = res.name;
                    let text = res.text;
                    adjustLayout(name, text);
                },
                error: function (err) {
                    console.log(err);
                }
            }).then(() => {
                viewer.isolate(Number(dbid));
                isolated = dbid;
                $('#toolbar-animation-Close').click();
                $('.homeViewWrapper').click();
                viewer.fitToView(Number(dbid));
            });
        } else {
            $('#toolbar-animation-Close').click();
            $('.homeViewWrapper').click();
            viewer.fitToView(Number(dbid));
        }
    } else if (lastNode != data.node.id) {
        viewer.isolate(0);
        lastNode = data.node.id;
        $.ajax({
            url: '/tree/texts',
            type: 'GET',
            data: { 'id': data.node.id },
            success: function (res) {
                let name = res.name;
                let text = res.text;
                adjustLayout(name, text);
                $('#toolbar-animation-Close').click();
                $('.homeViewWrapper').click();
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}

function getModel(time) {
    if (aExt !== undefined) {
        if (aExt.getCurrentTime() !== 0) {
            aExt.setTimelineValue(0);
        }
    }

    let visible = viewer.getVisibleModels();
    let models = visible.concat(viewer.getHiddenModels());
    for (let item of models) {
        if (item.myData.animations) {
            if (item.myData.animations.duration !== time) {
                viewer.hideModel(item.id);
            } else if (curModel !== item) {
                curModel = item;
                viewer.showModel(item.id);
                viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
            }
        } else if (time == 1) {
            if (curModel !== item) {
                curModel = item;
                viewer.showModel(item.id);
                viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
            }
        } else {
            viewer.hideModel(item.id);
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
        instanceTree.enumNodeChildren(node, function (childrenIds) {
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