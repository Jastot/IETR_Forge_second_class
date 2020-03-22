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
            let particle = [];
            let screenpoint;
            let screenpoints = [];
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
                if (panel != null && panel.isVisible() == true) {
                    console.log(e.clientX - $("#left-col").outerWidth(), e.clientY);
                    particle[index] = viewer.clientToWorld(e.clientX - $("#left-col").outerWidth(), e.clientY);
                    if (particle[index]) {
                        screenpoint = viewer.impl.worldToClient(new THREE.Vector3(particle[index].point.x, particle[index].point.y, particle[index].point.z), viewer.impl.camera);
                        let text = $("#markuptext").val();
                        if (text == '') {
                            html_str += `<div class="annotation annotation-without-text" id="annotation_${index + 1}" style="top:${screenpoint.y}px; left:${screenpoint.x}px;"><span class="annotationIndex">${index + 1}</span><span class= 'annotation-btn-close _wt'></span></div>`;
                        } else {
                            html_str += `<div class="annotation" id="annotation_${index + 1}" style="top:${screenpoint.y}px; left:${screenpoint.x}px;"><span class="annotationIndex">${index + 1}</span><span id = 'annotationText'>${text}</span><span class= 'annotation-btn-close'></span></div>`;
                        }
                        $("#annotations").html(html_str);
                        index++;
                        viewer.clearSelection();
                        document.getElementById("markuptext").value = "";
                        updateScreenPosition();
                        updateAnnotationOpacity();
                    }
                }
            })
            document.querySelector('#forgeViewer').addEventListener('mouseover', e => {
                if (e.target.className == 'annotationIndex' || e.target.id == 'annotationText') {
                    let div = e.target.parentNode;
                    let closebtn = div.lastChild;
                    closebtn.style.opacity = 1;
                    console.log(div.id);
                    document.querySelector(`#${div.id}`).addEventListener('mouseleave', () => {
                        closebtn.style.opacity = 0;
                    });
                }
            });
            document.querySelector('#forgeViewer').addEventListener('click', e => {
                if (e.target.className == 'annotation-btn-close _wt' || e.target.className == 'annotation-btn-close') {
                    if (e.target.style.opacity == 1) {
                        let div = e.target.parentNode;
                        div.remove(div);
                    }
                }
            });

            function updateScreenPosition() {
                for (let i = 0; i < index; i++) {
                    screenpoints[i] = viewer.impl.worldToClient(new THREE.Vector3(particle[i].point.x, particle[i].point.y, particle[i].point.z), viewer.impl.camera);
                    let anid = '#annotation_' + (i + 1);
                    $(anid).css('top', screenpoints[i].y);
                    $(anid).css('left', screenpoints[i].x);
                }
            }

            function updateAnnotationOpacity() {
                // const dbids = viewer.model.getData().instanceTree.nodeAccess.dbIdToIndex;
                // const tree = viewer.model.getInstanceTree();
                // const fragIds = [];
                // if (tree) { // Could be null if the tree hasn't been loaded yet
                //     for (const dbId of Object.keys(dbids)) {
                //         tree.enumNodeFragments(
                //             dbId,
                //             function(fragId) { fragIds.push(fragId); },
                //             false
                //         );
                //         console.log('dbId:', dbId, 'fragIds:', fragIds);
                //     }
                // }
                // fragIds.forEach(function(fragId) {
                //     var renderProxy = viewer.impl.getRenderProxy(viewer.model, fragId)
                //     console.log(renderProxy.geometry);
                // var fragmentproxy = viewer.impl.getFragmentProxy(viewer.model, fragId)
                // console.log(viewer.model.getGeometryList());

                // for (let i = 0; i < index; i++) {
                //     let sprite = particle[i].point;
                //     //let geometry = viewer.impl.model.getGeometryList();
                //     //console.log(geometry.geoms);
                //     console.log(viewer.model.getFragmentList());
                //     let dist = viewer.impl.camera.position.distanceTo(sprite);
                //     console.log(dist);
                // }
            }

            viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, () => {
                if (particle.length) {
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