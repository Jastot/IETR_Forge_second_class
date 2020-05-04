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
            let panel = this.panel;
            let index = 0;
            let html_str = '';
            var cam = viewer.impl.camera;
            var annotationDiv;
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
                        ann_obj.index = Number(index);
                        let particle = viewer.clientToWorld(e.clientX - $("#tree").outerWidth(), e.clientY - $('#navbar').outerHeight() - 30);
                        // console.log(e.clientX - $("#tree").outerWidth(), e.clientY - $('#navbar').outerHeight() - 30);
                        ann_obj.x = particle.point.x;
                        ann_obj.y = particle.point.y;
                        ann_obj.z = particle.point.z;
                        console.log(e.clientX - $("#tree").outerWidth(), e.clientY - $('#navbar').outerHeight() - 30);
                        if (particle) {
                            let screenpoint = viewer.impl.worldToClient(new THREE.Vector3(particle.point.x, particle.point.y, particle.point.z), cam);
                            let text = $("#markuptext").val();
                            ann_obj.text = text;
                            ann_obj.sX = screenpoint.x;
                            ann_obj.sY = screenpoint.y;
                            index++;

                            document.getElementById("markuptext").value = "";
                            // $.post("/annotations", { 'annotation': ann_obj }, () => {
                            //     getAnnotations();
                            // })

                            $.ajax({
                                url: "/annotations",
                                type: 'POST',
                                data: { 'annotation': ann_obj },
                                success: function() {
                                    getAnnotations();
                                },
                                error: function(err) {
                                    console.log(err);
                                }
                            });
                            // $.post("/annotations", { 'annotation': ann_obj }).then(() => {
                            //     getAnnotations()
                            // })
                            viewer.clearSelection();

                        }
                    }
                }
            })

            // if (annotationsArray.length > 0) {
            //     for (item of annotationsArray) {
            //         if (!$(`#annotation_${item.index + 1}`)) {
            //             placeAnnotation(item.text, item.index, viewer.impl.worldToClient(new THREE.Vector3(item.x, item.y, index.z), viewer.impl.camera));
            //         }
            //     }
            // }
            var annotationsArray = [];

            getAnnotations();


            function getAnnotations() {
                $.ajax({
                    url: '/annotations',
                    type: 'GET',
                    success: function(res) {
                        return res;
                    },
                    error: function(err) {
                        console.log(err);
                    }
                }).then((res) => {
                    annotationsArray = res;
                    if (annotationsArray.length > 0) {
                        for (item of annotationsArray) {
                            item.particle = new THREE.Vector3(item.x, item.y, item.z);
                            // console.log("JA");
                            let div = $(`#annotation_${Number(item.index) + 1}`)[0];
                            // console.log(`${item.index + 1}`);
                            // console.log(div);
                            if (!div) {
                                placeAnnotation(item.text, Number(item.index), item.sX, item.sY);
                            }
                        }
                    }
                    updateScreenPosition();
                    updateAnnotationOpacity();
                })
            }

            function placeAnnotation(text, index, x, y) {
                if (text == '') {
                    html_str += `<div class="annotation annotation-without-text" id="annotation_${index + 1}" style="top:${y}px; left:${x}px;"><span class="annotationIndex">${index + 1}</span><span class= 'annotation-btn-close _wt'></span></div>`;
                } else {
                    html_str += `<div class="annotation" id="annotation_${index + 1}" style="top:${y}px; left:${x}px;"><span class="annotationIndex">${index + 1}</span><span id = 'annotationText'>${text}</span><span class= 'annotation-btn-close'></span></div>`;
                }
                $("#annotations").html(html_str);
                viewer.clearSelection();
            }

            $('#forgeViewer').on('mouseover', e => {
                if (e.target.className == 'annotationIndex' || e.target.id == 'annotationText') {
                    let div = e.target.parentNode;
                    let closebtn = div.lastChild;
                    closebtn.style.opacity = 1;
                    // console.log(div.id);
                    $(`#${div.id}`).on('mouseleave', () => {
                        closebtn.style.opacity = 0;
                    });
                }
            });

            $('#forgeViewer').on('click', e => {
                if (e.target.className == 'annotation-btn-close _wt' || e.target.className == 'annotation-btn-close') {
                    if (e.target.style.opacity == 1) {
                        let div = e.target.parentNode;
                        div.remove(div);
                    }
                }
            });

            function updateScreenPosition() {
                for (item of annotationsArray) {
                    let screenpoint = viewer.impl.worldToClient(item.particle, viewer.impl.camera);
                    let anid = '#annotation_' + (Number(item.index) + 1);
                    $(anid).css('top', screenpoint.y);
                    $(anid).css('left', screenpoint.x);
                }
            }

            function updateAnnotationOpacity() {
                let cam_pose = viewer.impl.camera.position;
                for (item of annotationsArray) {
                    let close_p = viewer.clientToWorld(item.sX, item.sY);
                    let dst1 = cam_pose.distanceTo(item.particle);
                    let dst2 = cam_pose.distanceTo(close_p.point);
                    if (dst2 < 0.99 * dst1) {
                        $(`#annotation_${Number(item.index) + 1}`).css("opacity", "0");

                    } else {
                        $(`#annotation_${Number(item.index) + 1}`).css("opacity", "1");
                    }

                }
            }

            viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, () => {
                if (annotationsArray.length) {
                    updateScreenPosition();
                    updateAnnotationOpacity();
                }
            });
            this._button.setToolTip('Пометки');
            this._button.addClass('Markup3dExtensionIcon');
            this._group.addControl(this._button);
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
TextPanel.prototype.initialize = function() {
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