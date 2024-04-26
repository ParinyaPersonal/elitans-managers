
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-nocheck
function config() {
    $("#config").submit(function () {
        $.ajax({
            type: "POST",
            url: "/api",
            "headers": {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                api: $("#api").val()
            }),
            success: function (data) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log(data);
                    if (data === true) {
                        yield Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'API is valid',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        localStorage.setItem("api", $("#api").val());
                        localStorage.setItem("base", $("#path").val());
                        location.href = "/";
                    }
                    else {
                        yield Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'API is not valid',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        location.reload();
                    }
                });
            }
        });
        return false;
    });
}

// @ts-nocheck
if (!location.pathname.endsWith("config")) {
    if (!localStorage.getItem("base") || !localStorage.getItem("api"))
        location.href = "/config";
}
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
console.log("Copyright (c) 2024, Mr Maxing.");

// @ts-nocheck
function structure() {
    $("#toggle-out, #toggle-in").on("click", function () {
        if ($("#sidebar").hasClass("hidden")) {
            $("#sidebar").removeClass("hidden");
            $("#sidebar").addClass("block");
        }
        else {
            $("#sidebar").removeClass("block");
            $("#sidebar").addClass("hidden");
        }
    });
    $("#logout").on("click", function () {
        localStorage.removeItem("base");
        localStorage.removeItem("api");
        location.reload();
    });
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-nocheck
function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData();
    form.append("icon", $("#icon").prop("files")[0]);
    form.append("manifest", $("#res").val());
    form.append("language", $("input[name='language']:checked").val());
    form.append("base", localStorage.getItem("base"));
    form.append("folder", $("#folder").val());
    form.append("api", localStorage.getItem("api"));
    $.ajax({
        url: "/behavior/create",
        method: "POST",
        data: form,
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
        success: function (data) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Behavior Pack Created',
                    showConfirmButton: false,
                    timer: 1500
                });
                window.location.reload();
            });
        },
        error: function (data) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to Create Behavior Pack',
                    showConfirmButton: false,
                    timer: 1500
                });
                window.location.reload();
            });
        }
    });
    return false;
}
function versionModule(packages) {
    $.ajax({
        url: `https://registry.npmjs.org/${packages}`,
        method: "GET",
        success: function (response) {
            const data = Array(...new Set(Object.keys(response.versions)
                .filter((item) => item.endsWith("stable"))
                .map((item) => item.split(".").slice(0, 3).join("."))
                .reverse()));
            if (packages === "@minecraft/server")
                data.forEach((item) => $("#server").append(`<option value="${item}">${item}</option>`));
            else
                data.forEach((item) => $("#ui").append(`<option value="${item}">${item}</option>`));
        }
    });
}
function behavior_create() {
    versionModule("@minecraft/server");
    versionModule("@minecraft/server-ui");
    $.ajax({
        url: "/assets/config/bmanifest.json",
        method: "GET",
        success: function (data) {
            data.header.uuid = uuidv4();
            $("#res").val(JSON.stringify(data, null, 4));
        }
    });
    $("#icon").on("change", function () {
        $("#view-icon").attr("src", URL.createObjectURL(this.files[0]));
    });
    $("#name").on("keyup", function () {
        const res = JSON.parse($("#res").val());
        res.header.name = $(this).val();
        $("#res").val(JSON.stringify(res, null, 4));
    });
    $("#description").on("keyup", function () {
        const res = JSON.parse($("#res").val());
        res.header.description = $(this).val();
        $("#res").val(JSON.stringify(res, null, 4));
    });
    $("#author").on("keyup", function () {
        const res = JSON.parse($("#res").val());
        res.metadata.authors[0] = $(this).val();
        $("#res").val(JSON.stringify(res, null, 4));
    });
    $("#url").on("keyup", function () {
        const res = JSON.parse($("#res").val());
        res.metadata.url = $(this).val();
        $("#res").val(JSON.stringify(res, null, 4));
    });
    Array(["v0", "v1", "v2", "e0", "e1", "e2"]).forEach((id) => {
        const fuc = () => {
            const res = JSON.parse($("#res").val());
            res.header.version = [parseInt($("#v0").val()), parseInt($("#v1").val()), parseInt($("#v2").val())];
            res.header.min_engine_version = [parseInt($("#e0").val()), parseInt($("#e1").val()), parseInt($("#e2").val())];
            $("#res").val(JSON.stringify(res, null, 4));
        };
        $(`#${id}`).on("change", fuc);
        $(`#${id}`).on("keyup", fuc);
    });
    $("#betaapis").on("change", function () {
        const res = JSON.parse($("#res").val());
        if ($(this).prop("checked") === true) {
            const metadata = res.metadata;
            delete res.metadata;
            $("#res").val(JSON.stringify(Object.assign(Object.assign({}, res), { "modules": [{
                        "type": "script",
                        "language": "javascript",
                        "uuid": `${uuidv4()}`,
                        "entry": "",
                        "version": [
                            1,
                            0,
                            0
                        ]
                    }], "dependencies": [{
                        "module_name": "@minecraft/server",
                        "version": ""
                    },
                    {
                        "module_name": "@minecraft/server-ui",
                        "version": ""
                    }
                ], metadata }), null, 4));
            $("#javascript").prop("disabled", false);
            $("#typescript").prop("disabled", false);
            $("#script").removeClass("hidden").addClass("grid");
        }
        else {
            delete res.modules;
            delete res.dependencies;
            $("#res").val(JSON.stringify(res, null, 4));
            $("#javascript").prop("disabled", true);
            $("#typescript").prop("disabled", true);
            $("#script").removeClass("grid").addClass("hidden");
        }
    });
    $("#entry").on("keyup", function () {
        const res = JSON.parse($("#res").val());
        res.modules[0].entry = $(this).val();
        $("#res").val(JSON.stringify(res, null, 4));
    });
    $("#server").on("change", function () {
        const res = JSON.parse($("#res").val());
        res.dependencies[0].version = $(this).val();
        $("#res").val(JSON.stringify(res, null, 4));
    });
    $("#ui").on("change", function () {
        const res = JSON.parse($("#res").val());
        res.dependencies[1].version = $(this).val();
        $("#res").val(JSON.stringify(res, null, 4));
    });
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-nocheck
function behavior_manage() {
    $(document).ready(function () {
        return __awaiter(this, void 0, void 0, function* () {
            $('[is="run"]').prop("disabled", true);
            yield $.ajax({
                url: '/folder',
                type: 'POST',
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "base": localStorage.getItem("base"),
                    "dir": "development_behavior_packs"
                }),
                success: function (data) {
                    function create(v, d) {
                        const c = v.replaceAll(" ", "_");
                        $(`#project-${d}`).append(`<div class="w-full" id="project-${c}"></div>`);
                        $(`#project-${c}`).append(`<input type="radio" name="option" id="${v}" value="${v}" class="peer hidden" />`);
                        $(`#project-${c}`).append(`<label for="${v}" class="block cursor-pointer select-none peer-checked:bg-zinc-200 px-3 py-1 border-zinc-300"><a class="text-zinc-300 me-2">⁝⁝</a>${v}</label>`);
                    }
                    if ($("#project-obf"))
                        data
                            .filter(v => v.endsWith("obf"))
                            .forEach((v) => create(v, "obf"));
                    if ($("#project-ts"))
                        data
                            .filter(v => v.endsWith("ts"))
                            .forEach((v) => create(v, "ts"));
                    if ($("#project-list"))
                        data
                            .filter(v => !v.endsWith("obf") && !v.endsWith("ts"))
                            .forEach((v) => create(v, "list"));
                }
            });
            $("[name='option']").on("change", function () {
                const project = $(this).val();
                if (project == "") {
                    $('[is="run"]').prop("disabled", true);
                    $('#view-icon').attr('src', "https://www.lavalamp.com/wp-content/uploads/2016/07/placeholder-1-1.png");
                }
                else {
                    $('[is="run"]').prop("disabled", false);
                    $.ajax({
                        url: '/icon',
                        type: 'POST',
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                            "base": localStorage.getItem("base"),
                            "dir": "development_behavior_packs",
                            "folder": project.replace(" - ts", "")
                        }),
                        xhrFields: {
                            responseType: "blob"
                        },
                        success: function (data) {
                            const blob = new Blob([data], {
                                type: 'image/png'
                            });
                            $('#view-icon').attr("src", URL.createObjectURL(blob));
                        }
                    });
                }
            });
            $("#copy").on("click", function () {
                if ($("[name='option']:checked").val() == "")
                    return;
                navigator.clipboard.writeText(`${localStorage.getItem("base")}/development_behavior_packs/${$("[name='option']:checked").val()}`);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Copy Success",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
                return false;
            });
            $("#open").on("click", function () {
                if ($("[name='option']:checked").val() == "")
                    return;
                window.open(`vscode://file/${localStorage.getItem("base")}/development_behavior_packs/${$("[name='option']:checked").val()}`);
                return false;
            });
            function compile(type) {
                $.ajax({
                    "url": "/compile",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        "type": type,
                        "base": localStorage.getItem("base"),
                        "dir": "development_behavior_packs",
                        "folder": $("[name='option']:checked").val()
                    }),
                    success: function (data) {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: "Compile Success",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true
                        });
                    }
                });
            }
            $("#zip").on("click", function () {
                if ($("[name='option']:checked").val() == "")
                    return;
                compile("zip");
                return false;
            });
            $("#mcpack").on("click", function () {
                if ($("[name='option']:checked").val() == "")
                    return;
                compile("mcpack");
                return false;
            });
            $("#encode").on("click", function () {
                if ($("[name='option']:checked").val() == "")
                    return;
                $.ajax({
                    "url": "/behavior/encode",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        "base": localStorage.getItem("base"),
                        "folder": $("[name='option']:checked").val()
                    }),
                    success: function (data) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield Swal.fire({
                                icon: "success",
                                title: "Success",
                                text: "Encode Success",
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true
                            });
                            location.href = "/behavior/manage/obfuscate";
                        });
                    },
                    error: function (data) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: `Encode Failed: ${data.responseText}`,
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true
                            });
                        });
                    }
                });
                return false;
            });
            $("#delete").on("click", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if ($("[name='option']:checked").val() == "")
                        return;
                    const { isConfirmed } = yield Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    });
                    if (isConfirmed) {
                        $.ajax({
                            "url": "/delete",
                            "method": "POST",
                            "headers": {
                                "Content-Type": "application/json"
                            },
                            "data": JSON.stringify({
                                "base": localStorage.getItem("base"),
                                "dir": "development_behavior_packs",
                                "folder": $("[name='option']:checked").val()
                            }),
                            success: function (data) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    yield Swal.fire({
                                        icon: "success",
                                        title: "Success",
                                        text: "Delete Success",
                                        showConfirmButton: false,
                                        timer: 3000,
                                        timerProgressBar: true
                                    });
                                    location.reload();
                                });
                            }
                        });
                    }
                });
            });
            $("#update").on("click", function () {
                Swal.fire({
                    title: 'Updating information',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                $.ajax({
                    "url": "/behavior/update",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        "base": localStorage.getItem("base"),
                    }),
                    success: function (data) {
                        Swal.close();
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: "Update Success",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true
                        });
                    },
                    error: function (data) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: `Update Failed: ${data.responseText}`,
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true
                        });
                    }
                });
            });
        });
    });
}
