$(document).ready(function () {
    prepareAppBucketTree();
    $('#refreshBuckets').click(function () {
        $('#appBuckets').jstree(true).refresh();
    });

    $('#createNewBucket').click(function () {
        createNewBucket();
    });

    $('#createBucketModal').on('shown.bs.modal', function () {
        $("#newBucketKey").focus();
    })

    $('#hiddenUploadField').change(function () {
        var node = $('#appBuckets').jstree(true).get_selected(true)[0];
        var _this = this;
        if (_this.files.length == 0) return;
        var file = _this.files[0];
        switch (node.type) {
            case 'bucket':
                var formData = new FormData();
                formData.append('fileToUpload', file);
                formData.append('bucketKey', node.id);

                $.ajax({
                    url: '/api/forge/oss/objects',
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (data) {
                        $('#appBuckets').jstree(true).refresh_node(node);
                        $('#appBuckets').jstree(true).open_node(node);
                        _this.value = '';
                    }
                });
                break;
        }
    });
});

function createNewBucket() {
    var bucketKey = $('#newBucketKey').val();
    jQuery.post({
        url: '/api/forge/oss/buckets',
        contentType: 'application/  ',
        data: JSON.stringify({ 'bucketKey': bucketKey }),
        success: function (res) {
            $('#appBuckets').jstree(true).refresh();
            $('#createBucketModal').modal('toggle');
        },
        error: function (err) {
            if (err.status == 409)
                alert('Контейнер уже существует - 409: Повторение')
            console.log(err);
        }
    });
}

function prepareAppBucketTree() {
    $('#appBuckets').jstree({
        'core': {
            'multiple': false,
            'check_callback': true,
            'themes': { "icons": true },
            'data': {
                "url": '/api/forge/oss/buckets',
                "dataType": "json",
                'multiple': false,
                "data": function (node) {
                    return { "id": node.id };
                }
            }
        },
        'types': {
            'default': {
                'icon': 'glyphicon glyphicon-question-sign'
            },
            '#': {
                'icon': 'glyphicon glyphicon-cloud'
            },
            'bucket': {
                'icon': 'glyphicon glyphicon-folder-open'
            },
            'object': {
                'icon': 'glyphicon glyphicon-file'
            }
        },
        "plugins": ["types", "state", "sort", "contextmenu"],
        contextmenu: { items: autodeskCustomMenu }
    }).on('loaded.jstree', function () {
        $('#appBuckets').jstree('open_all');
    }).bind("activate_node.jstree", function (evt, data) {
        if (data != null && data.node != null && data.node.type == 'object') {
            $("#forgeViewer").empty();
            var urn = data.node.id;
            getForgeToken(function (access_token) {
                jQuery.ajax({
                    url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    success: function (res) {
                        if (res.status === 'success') launchViewer(urn);
                        else $("#forgeViewer").html('Преобразование всё ещё выполняется').css('color', 'white');
                    },
                    error: function (err) {
                        var msgButton = 'Этот файл еще не преобразован! ' +
                            '<button class="btn btn-xs btn-info" id="translateObject" onclick="translateObject()"><span class="glyphicon glyphicon-eye-open"></span> ' +
                            'Начать преобразование</button>'
                        $("#forgeViewer").html(msgButton).css('color', 'white');
                    }
                });
            })
        }
    });
}

function autodeskCustomMenu(autodeskNode) {
    var items;
    switch (autodeskNode.type) {
        case "bucket":
            items = {
                uploadFile: {
                    label: "Загрузить файл",
                    action: function () {
                        uploadFile();
                    },
                    icon: 'glyphicon glyphicon-cloud-upload'
                },
                deleteBucket: {
                    label: "Удалить контейнер",
                    action: function () {
                        deleteBucket(autodeskNode);
                    },
                    icon: 'glyphicon glyphicon-trash'
                }
            };
            break;
        case "object":
            items = {
                translateFile: {
                    label: "Преобразовать",
                    action: function () {
                        var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
                        translateObject(treeNode);
                    },
                    icon: 'glyphicon glyphicon-eye-open'
                },
                deleteFile: {
                    label: "Удалить объект",
                    action: function () {
                        deleteObject(autodeskNode);
                    },
                    icon: 'glyphicon glyphicon-trash'
                }
            };
            break;
    }
    return items;
}

function uploadFile() {
    $('#hiddenUploadField').click();
}

function deleteBucket(node) {
    $("#forgeViewer").empty();
    var bucketKey = node.id;
    $.ajax({
        url: '/api/forge/oss/buckets/' + encodeURIComponent(bucketKey),
        type: 'DELETE',
        success: function () {
            $('#appBuckets').jstree(true).refresh();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function deleteObject(node) {
    $("#forgeViewer").empty();
    var bucketKey = node.parents[0];
    var objectName = node.text;
    $.ajax({
        url: '/api/forge/oss/buckets/' + encodeURIComponent(bucketKey) + "/objects/" + encodeURIComponent(objectName),
        type: 'DELETE',
        success: function () {
            $('#appBuckets').jstree(true).refresh();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function translateObject(node) {
    $("#forgeViewer").empty();
    if (node == null) node = $('#appBuckets').jstree(true).get_selected(true)[0];
    var bucketKey = node.parents[0];
    var objectKey = node.id;
    jQuery.post({
        url: '/api/forge/modelderivative/jobs',
        contentType: 'application/json',
        data: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': objectKey }),
        success: function (res) {
            $("#forgeViewer").html('Преобразование началось! Откройте объект через некоторое время!');
        },
    });
}