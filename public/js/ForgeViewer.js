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



        // ani = viewer.getExtension();
        // console.log(ani);
        // ani.load();


        // viewer.loadExtension('Autodesk.ModelStructure', viewer.config).then(ext => {
        //     viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
        // });
        // viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, () => {
        //     var anime = viewer.getExtension('Autodesk.Fusion360.Animation');
        //     anime.load();
        //     console.log(anime);
        // });

        // viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => {
        //     console.log(viewer.loadedExtensions);
        //     let arr = ["Autodesk.ModelStructure", "Autodesk.PropertiesManager", "Autodesk.BimWalk", "Autodesk.Explode"];
        //     for (let i in arr) {
        //         let Extension = viewer.getExtension(arr[i]);
        //         Extension.unload();
        //     }
        //     console.log(viewer.loadedExtensions);
        // });


        // const onExtensionLoaded = (e) => {

        //     if (e.extensionId === 'Autodesk.BimWalk') {

        //         const navTools = viewer.toolbar.getControl('navTools')

        //         navTools.removeControl('toolbar-bimWalkTool')

        //         viewer.removeEventListener(
        //             Autodesk.Viewing.EXTENSION_LOADED_EVENT,
        //             onExtensionLoaded)
        //     }
        // }

        // viewer.addEventListener(
        //     Autodesk.Viewing.EXTENSION_LOADED_EVENT,
        //     onExtensionLoaded)



    });
}
var components;
var comp_data;

// const onToolbarCreated = (e) => {
//     console.log(e);
//     let settingsTools = e.target.toolbar.getControl('settingsTools')
//     settingsTools.removeControl('toolbar-modelStructureTool');
//     // settingsTools.removeControl("toolbar-modelStructureTool");
//     // settingsTools.removeControl('toolbar-propertiesTool');
//     // settingsTools.removeControl('toolbar-settingsTool');
//     // settingsTools.removeControl('toolbar-fullscreenTool');

//     // let modelTools = viewer.toolbar.getControl('modelTools');
//     // modelTools.removeControl('toolbar-explodeTool')
//     //     // settingsTools.removeControl('toolbar-propertiesTool') 
//     //     //toolbar-explodeTool  toolbar-propertiesTool toolbar-bimWalkTool

//     viewer.removeEventListener(
//         Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
//         onToolbarCreated)
// }
function onDocumentLoadSuccess(doc) {
    var viewables = doc.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(doc, viewables).then(i => {
        viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
        // viewer.loadExtension('Autodesk.ModelStructure');
        // let ext = viewer.getExtension('Autodesk.ModelStructure');
        // ext.activate();
        viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
            var isolated;
            $("#compTree").on("open_node.jstree", function(e, data) {
                if (data.node.id === 'components') {
                    var row = $(".row").children();
                    $(row[0]).removeClass('col-sm-2 col-md-2').addClass('col-sm-3 col-md-3');
                    $(row[1]).removeClass('col-sm-7 col-md-7').addClass('col-sm-6 col-md-6');
                    viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
                    // viewer.addEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, () => {
                    //     console.log(5);
                    //     viewer.resize();
                    // });
                }
            });
            $("#compTree").on("close_node.jstree", function(e, data) {
                if (data.node.id === 'components') {
                    var row = $(".row").children();
                    $(row[0]).removeClass('col-sm-3 col-md-3').addClass('col-sm-2 col-md-2');
                    $(row[1]).removeClass('col-sm-6 col-md-6').addClass('col-sm-7 col-md-7');
                    viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
                }
            });
            $('#compTree').on("activate_node.jstree", function(evt, data) {
                if (data != null && data.node != null && data.node.type == 'object') {
                    let dbid = data.node.id.substring(data.node.id.lastIndexOf('_') + 1);
                    if (isolated != dbid) {
                        $.ajax({
                            url: '/modelId',
                            type: 'GET',
                            success: function(res) {
                                let name = res.name;
                                let text = res.text;
                                console.log(name);
                                console.log(text);
                                adjustLayout(name, text);
                            },
                            error: function(err) {
                                console.log(err);
                            }
                        });
                    }
                }
            });
        });

        viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (e) => {
            viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
            if (e.model.id === 1) {
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

                viewer.loadExtension('Autodesk.Fusion360.Animation');

                if (animationItems.length > 0) {
                    var aExt = viewer.getExtension('Autodesk.Fusion360.Animation');
                    if (aExt)
                        aExt.load();
                }
            } else if (e.model.id === 2) {
                var scene = viewer.impl.modelQueue();
                console.log(scene.getModels());
                var model = scene.findModel(2);
                // remove model from viewer - but without discarding materials
                viewer.impl.removeModel(model);
                // make this model available for later showModel() calls
                scene.addHiddenModel(model);
                // or viewer.hideModel(model.id) + viewer.showModel(model.id)
                // viewer.hideModel(model.id);
                // setTimeout(() => {
                //     viewer.showModel(model.id);
                //     viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
                // }, 1500);


                $("#cube-loader").addClass("loaded_hiding");
                setTimeout(() => {
                    $("#cube-loader").css("display", "none");
                }, 500);
            } else {
                $("#cube-loader").addClass("loaded_hiding");
                setTimeout(() => {
                    $("#cube-loader").css("display", "none");
                }, 500);
            }
        });
    })
}

function getModel(id) {
    console.log(id);
    let modelArray = [1, 2, 3, 4, 5];
    for (item of modelArray) {
        var scene = viewer.impl.modelQueue();
        var model = scene.findModel(item);
        console.log(model);
        if (item != id) {
            viewer.impl.removeModel(model);
            scene.addHiddenModel(model);
            console.log(viewer.getHiddenModels());
        } else {
            let array = viewer.getHiddenModels();
            console.log(array);
            for (item of array) {
                if (item) {
                    console.log(item.id);
                    if (item.id === id) {
                        // console.log(item.id);
                        console.log(5);
                        viewer.showModel(id);
                    }
                }
            }
        }
    }
    // var scene = viewer.impl.modelQueue();
    // var model = scene.findModel(id);
    // remove model from viewer - but without discarding materials
    // viewer.impl.removeModel(model);
    // make this model available for later showModel() calls
    // scene.addHiddenModel(model);
    // viewer.showModel(model.id)
    // viewer.hideModel(model.id);
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