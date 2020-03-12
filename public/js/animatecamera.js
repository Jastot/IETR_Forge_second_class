class AnimateCameraExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('AnimateCameraExtension has been loaded');
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
        console.log('AnimateCameraExtension has been unloaded');
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('animateCameraExtensionExtensionButton');
        let started = false;
        let format;
        let counter;
        let check_direct;
        let intervalID;
        this._button.onClick = (ev) => {
            // Execute an action here
            this.format = this.checkformat();
            this.started = !this.started;
            this.counter = 0;
            $('.explode-slider').attr("id","eslider");
            if (this.started) {
                this.rotateCamera();
                this.explode_model();
                this.intervalID = setInterval(() => {
                    this.explode_model();
                }, 25);
            }
            else{
                clearInterval(this.intervalID);
            }
        };
        this._button.setToolTip('Анимация');
        this._button.addClass('AnimateCameraExtensionIcon');
        this._group.addControl(this._button);
    }
    rotateCamera = () => {
        if (this.started) {
            requestAnimationFrame(this.rotateCamera);
        }
        const nav = viewer.navigation;
        const up = nav.getCameraUpVector();
        let axis = new THREE.Vector3(0, 0, 0);
        if (this.format == "rvt") {
            axis = new THREE.Vector3(0, 0, 1);
        }
        else {
            axis = new THREE.Vector3(0, 1, 0);
        }
        const speed = 3.0 * Math.PI / 180;
        const matrix = new THREE.Matrix4().makeRotationAxis(axis, speed * 0.1);
        let pos = nav.getPosition();
        pos.applyMatrix4(matrix);
        up.applyMatrix4(matrix);
        nav.setView(pos, new THREE.Vector3(0, 0, 0));
        nav.setCameraUpVector(up);
    };
    checkformat (){
        var name = $('#appBuckets').jstree(true).get_selected(true)[0].text;
        var extension = name.substring(name.lastIndexOf('.')+1);
        return extension;
    }
    explode_model(){
            viewer.setGroundShadow(false);
            if(this.counter <= 0){
                this.check_direct = true;
            }
            if(this.counter >= 0.45){
                this.check_direct = false;
            }
            if(this.check_direct == true){
                this.counter += 0.003;
            }
            else{
                this.counter -= 0.003;
            }
            if(this.counter!=0){
                viewer.explode(this.counter);
            }
    }
}
    

Autodesk.Viewing.theExtensionManager.registerExtension('AnimateCameraExtension', AnimateCameraExtension);
