var annotationsArray = [];
let panel;
var index;
let html_str;
var cam;
var annotationDiv;
var screenpoints = [];
class Markup3dExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('Markup3dExtension has been loaded');
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('Markup3dExtension has been unloaded');
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }
        panel = this.panel;
        index = 0;
        html_str = '';
        cam = viewer.impl.camera;
        if (annotationDiv == undefined) {
            annotationDiv = $('.progressbg').after(`<div id="annotations"></div>`);
        }
        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('Markup3dExtensionButton');
        this._button.onClick = () => {
            // Execute an action here
            // if null, create it
            if (panel == null) {
                panel = new TextPanel(viewer, viewer.container,
                    'Markup3dExtensinPanel', 'Пометка');
            }
            // show/hide docking panel
            panel.setVisible(!panel.isVisible());
        };
        document.querySelector("#forgeViewer").addEventListener('click', e => {
            let etClass = e.target.className;
            if (etClass != 'annotation-btn-close _wt' && etClass != 'annotation-btn-close' && etClass != 'annotationIndex' && e.target.id != 'annotationText') {
                if (panel != null && panel.isVisible() == true) {
                    let ann_obj = {};
                    ann_obj.index = Number(index + 1);
                    let particle = viewer.clientToWorld(e.clientX - $("#tree").outerWidth(), e.clientY - $('#navbar').outerHeight() - 30);
                    ann_obj.x = particle.point.x;
                    ann_obj.y = particle.point.y;
                    ann_obj.z = particle.point.z;
                    if (particle) {
                        let screenpoint = viewer.impl.worldToClient(new THREE.Vector3(particle.point.x, particle.point.y, particle.point.z), cam);
                        let text = $("#markuptext").val();
                        ann_obj.text = text;
                        ann_obj.sX = screenpoint.x;
                        ann_obj.sY = screenpoint.y;


                        document.getElementById("markuptext").value = "";
                        // $.post("/annotations", { 'annotation': ann_obj }, () => {
                        //     getAnnotations();
                        // })
                        $.ajax({
                            url: "/annotations",
                            type: 'POST',
                            data: { 'annotation': ann_obj },
                            success: function () {
                                getAnnotations();

                            },
                            error: function (err) {
                                console.log(err);
                            }
                        });
                        // $.post("/annotations", { 'annotation': ann_obj }).then(() => {
                        //     getAnnotations()
                        // })
                        viewer.clearSelection();
                        updateScreenPosition();

                    }
                }
            }
        })


        // $('#forgeViewer').on('mouseover', e => {
        //     if (e.target.className == 'annotationIndex' || e.target.id == 'annotationText') {
        //         let div = e.target.parentNode;
        //         let closebtn = div.lastChild;
        //         closebtn.style.opacity = 1;
        //         $(`#${div.id}`).on('mouseleave', () => {
        //             closebtn.style.opacity = 0;
        //         });
        //     }
        // });

        // $('#forgeViewer').on('click', e => {
        //     if (e.target.className == 'annotation-btn-close _wt' || e.target.className == 'annotation-btn-close') {
        //         if (e.target.style.opacity == 1) {
        //             let div = e.target.parentNode;
        //             let id = div.id.replace("annotation_", "");
        //             $.ajax({
        //                 url: '/annotations',
        //                 type: 'DELETE',
        //                 data: { "id": id },
        //                 success: function (res) {
        //                     div.remove(div);
        //                     html_str = $('#annotations').html();
        //                     getAnnotations();
        //                 },
        //                 error: function (err) {
        //                     console.log(err);
        //                 }
        //             })
        //         }
        //     }
        // });



        viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, () => {
            if (annotationsArray.length) {
                updateScreenPosition();
                // updateAnnotationOpacity();
            }
        });

        $('#compTree').on("activate_node.jstree", function (evt, data) {
            if (data != null && data.node != null && data.node.id == 'components') {
                getAnnotations();
            } else {
                clearAnnotations();
            }
        });

        this._button.setToolTip('Пометки');
        this._button.addClass('Markup3dExtensionIcon');
        this._group.addControl(this._button);
    }
}


function getAnnotations() {
    $.ajax({
        url: '/annotations',
        type: 'GET',
        success: function (res) {
            return res;
        },
        error: function (err) {
            console.log(err);
        }
    }).then((res) => {
        annotationsArray = res;
        if (annotationsArray.length > 0) {
            index = Number(annotationsArray[0].index);
            for (let item of annotationsArray) {
                let div = $(`#annotation_${item.index}`)[0];
                if (div === undefined) {
                    placeAnnotation(item.text, Number(item.index), item.sX, item.sY);
                }
            }
        } else {
            index = 0;
        }
        updateScreenPosition();
        // updateAnnotationOpacity();
    })
}

function placeAnnotation(text, index, x, y) {
    if (text == '') {
        html_str += `<div class="annotation annotation-without-text" id="annotation_${index}" style="top:${y}px; left:${x}px;"><span class="annotationIndex">${index}</span><span class= 'annotation-btn-close _wt'></span></div>`;
    } else {
        html_str += `<div class="annotation" id="annotation_${index}" style="top:${y}px; left:${x}px;"><span class="annotationIndex">${index}</span><span id = 'annotationText'>${text}</span><span class= 'annotation-btn-close'></span></div>`;
    }
    $("#annotations").html(html_str);
    viewer.clearSelection();
}

function clearAnnotations() {
    if (annotationsArray.length > 0) {
        // for (item of annotationsArray) {
        //     let div = $(`#annotation_${Number(item.index)}`)[0];
        //     if (div) {
        //         div.remove(div);
        //         console.log(item.index);
        //     }

        // }
        $("#annotations").empty();
        annotationsArray = [];
        html_str = "";
    }
}

function updateScreenPosition() {
    for (let i = 0; i < annotationsArray.length; i++) {
        screenpoints[i] = viewer.impl.worldToClient(new THREE.Vector3(annotationsArray[i].x, annotationsArray[i].y, annotationsArray[i].z), cam);
        let anid = '#annotation_' + annotationsArray[i].index;
        $(anid).css('top', screenpoints[i].y);
        $(anid).css('left', screenpoints[i].x);
    }
}

function updateAnnotationOpacity() {
    let cam_pose = cam.position;
    for (let i = 0; i < index; i++) {
        let close_p = viewer.impl.clientToWorld(screenpoints[i].x, screenpoints[i].y);
        let dst1 = cam_pose.distanceTo(new THREE.Vector3(annotationsArray[i].x, annotationsArray[i].y, annotationsArray[i].z));
        let dst2 = cam_pose.distanceTo(close_p.point);
        if (dst2 < 0.99 * dst1) {
            $(`#annotation_${annotationsArray[i].index}`).css("opacity", "0");

        } else {
            $(`#annotation_${annotationsArray[i].index}`).css("opacity", "1");
        }
    }
}

// *******************************************
// My Awesome (Docking) Panel
// *******************************************
function TextPanel(viewer, container, id, title, options) {
    this.viewer = viewer;
    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

    // the style of the docking panel
    // use this built-in style to support Themes on Viewer 4+
    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.classList.add('annotation-panel');
    this.container.style.top = "180px";
    this.container.style.left = "30px";
    this.container.style.resize = "none";
    this.container.style.minWidth = "250px";
    this.container.style.minHeight = "330px";

    // this is where we should place the content of our panel
    var textarea = document.createElement('textarea');
    textarea.classList.add('text-annotation');
    textarea.placeholder = 'Введите текст пометки';
    textarea.id = 'markuptext';
    textarea.maxLength = 100;
    this.container.appendChild(textarea);
}

TextPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
TextPanel.prototype.constructor = TextPanel;
TextPanel.prototype.initialize = function () {
    // Override DockingPanel initialize()
    this.title = this.createTitleBar(this.titleLabel || this.container.id);
    this.title.style.fontSize = '26px';
    this.container.appendChild(this.title);

    this.initializeMoveHandlers(this.title);

    this.closer = document.createElement("div");
    this.closer.className = "annotation-close";
    //this.closer.textContent = "Close";
    this.initializeCloseHandler(this.closer);
    this.container.appendChild(this.closer);
};
Autodesk.Viewing.theExtensionManager.registerExtension('Markup3dExtension', Markup3dExtension);