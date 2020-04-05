var viewer;
$(document).ready(function() {
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
});

function launchViewer(urn) {
    var options = {
        env: 'AutodeskProduction',
        getAccessToken: getForgeToken
    };

    Autodesk.Viewing.Initializer(options, () => {
        viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), {
            extensions: ['HandleSelectionExtension', 'Markup3dExtension']
                //disabledExtensions: { explode: true, bimwalk: true, settings: true, propertiesmanager: true, modelstructure: true }
        });
        viewer.start();
        viewer.setBackgroundColor(242, 242, 242, 242, 242, 242);
        var documentId = 'urn:' + urn;
        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);

        // viewer.loadExtension('Autodesk.ModelStructure', viewer.config).then(ext => {
        //     viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
        // });
        // viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);

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
        // documented loaded, any action?
        // viewer.loadExtension('Autodesk.ModelStructure');
        // let ext = viewer.getExtension('Autodesk.ModelStructure');
        // ext.activate();
        // console.log(ext);
        // console.log(ext.isActive());
        viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function() {
            components = buildModelTree(viewer.model);
            comp_data = components;
            let chi = get_children(comp_data.children);
            $('#testtree').jstree(true).settings.core.data[1] = get_new_data(chi);
            $('#testtree').jstree(true).refresh();
            $("#testtree").on("open_node.jstree", function(e, data) {
                if (data.node.id === 'components') {
                    var row = $(".row").children();
                    $(row[0]).removeClass('col-sm-2 col-md-2').addClass('col-sm-3 col-md-3');
                    $(row[1]).removeClass('col-sm-7 col-md-7').addClass('col-sm-6 col-md-6');
                }
            });
            $("#testtree").on("close_node.jstree", function(e, data) {
                if (data.node.id === 'components') {
                    var row = $(".row").children();
                    $(row[0]).removeClass('col-sm-3 col-md-3').addClass('col-sm-2 col-md-2');
                    $(row[1]).removeClass('col-sm-6 col-md-6').addClass('col-sm-7 col-md-7');
                }
            });
        })
    })
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
        if (arr[i].children instanceof Array && arr[i].children.length > 1) {
            clone[i] = {
                text: `${arr[i].name}`,
                id: `comp_${arr[i].dbId}`,
                children: get_children(arr[i].children)
            };
            continue;
        }
        if (arr[i].name != "Solid1")
            clone[i] = {
                text: `${arr[i].name}`,
                id: `comp_${arr[i].dbId}`,
            };
    }
    return clone;
}