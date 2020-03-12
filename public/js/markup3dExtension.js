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
            var panel = this.panel;
            var index = 0;
            var html_str;
            var renderer = viewer.impl.renderer();
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
                // var object = [];
                var particle = [];
                var screenpoint;
                panel.setVisible(!panel.isVisible());

                document.querySelector("#forgeViewer").addEventListener('click', e => {
                    console.log(e.clientX - $("#left-col").outerWidth(), e.clientY);
                    particle[index] = viewer.clientToWorld(e.clientX - $("#left-col").outerWidth(), e.clientY);
                    if (particle[index]) {
                        console.log(particle[index]);
                        screenpoint = viewer.impl.worldToClient(new THREE.Vector3(particle[index].point.x, particle[index].point.y, particle[index].point.z), viewer.impl.camera);
                        let text = $("#markuptext").val();
                        if (text == 'undefined')
                            text = "";
                        html_str += '<div class="annotation" id="annotation_' + index + '"' + 'style = "top: ' + screenpoint.y + 'px; left: ' + screenpoint.x + 'px;"' +
                            '>' + '<span class="annotationIndex">' + index + '</span>' + '<p>' + text + '</p></div>';
                        $("#annotations").html(html_str);
                        index++;
                        viewer.clearSelection();
                        document.getElementById("markuptext").value = "";
                        updateScreenPosition();

                    }

                })

                function updateScreenPosition() {
                    for (let i = 0; i < index; i++) {
                        //var vector = new THREE.Vector3(object[index]);
                        //canvas = renderer.domElement;

                        //vector.project(viewer.impl.camera);
                        console.log(i);
                        console.log(particle[i].point.x, particle[i].point.y, particle[i].point.z);
                        screenpoint = viewer.impl.worldToClient(new THREE.Vector3(particle[i].point.x, particle[i].point.y, particle[i].point.z), viewer.impl.camera);

                        //screenpoint.x = Math.round((0.5 + screenpoint.x / 2) * (window.innerWidth / window.devicePixelRatio));
                        //screenpoint.y = Math.round((0.5 - screenpoint.y / 2) * (window.innerHeight / window.devicePixelRatio));
                        let anid = '#annotation_' + i;
                        $(anid).css('top', screenpoint.y);
                        $(anid).css('left', screenpoint.x);

                    }
                    //$("#annotation_1").style.opacity = spriteBehindObject ? 0.25 : 1;
                }

                viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, e2 => {
                    if (particle.length) {
                        updateScreenPosition();
                    }
                })
            };
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
    this.container.style.top = "180px";
    this.container.style.right = "15px";
    this.container.style.width = "250px";
    this.container.style.height = "350px";
    this.container.style.resize = "none";

    // this is where we should place the content of our panel
    var textarea = document.createElement('textarea');
    textarea.placeholder = 'Введите текст пометки';
    textarea.style.borderRadius = '3px';
    textarea.style.width = '240px';
    textarea.style.height = '265px';
    textarea.style.marginTop = '10px';
    textarea.style.marginLeft = '3px';
    textarea.style.marginRight = '3px';
    textarea.style.color = 'black';
    textarea.style.resize = 'none';
    textarea.style.fontSize = '18px';
    textarea.style.fontFamily = 'TimesNewRoman';
    textarea.style.padding = '2px';
    textarea.style.border = 'none';
    textarea.id = 'markuptext';
    this.container.appendChild(textarea);
}
TextPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
TextPanel.prototype.constructor = TextPanel;

Autodesk.Viewing.theExtensionManager.registerExtension('Markup3dExtension', Markup3dExtension);