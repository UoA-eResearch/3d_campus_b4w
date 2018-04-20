"use strict"

// register the application module
b4w.register("3D_campus_b4w_c_main", function(exports, require) {

// import modules used by the app
var m_app       = require("app");
var m_cam       = require("camera");
var m_cfg       = require("config");
var m_data      = require("data");
var m_preloader = require("preloader");
var m_ver       = require("version");

var m_anim      = require("animation");
var m_cont      = require("container");
var m_mouse     = require("mouse");
var m_scenes    = require("scenes");
var m_trans     = require("transform");
var m_cam_anim  = require("camera_anim");

var cam;

// detect application mode
var DEBUG = (m_ver.type() == "DEBUG");

// automatically detect assets path
var APP_ASSETS_PATH = "assets/";

/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        show_fps: DEBUG,
        console_verbose: DEBUG,
        autoresize: true
    });
}

/**
 * callback executed when the app is initialized 
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    // ignore right-click on the canvas element
    canvas_elem.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load(APP_ASSETS_PATH + "3D_campus_b4w_c.json", load_cb, preloader_cb);
}

/**
 * update the app's preloader
 */
function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

/**
 * callback executed when the scene data is loaded
 */
function load_cb(data_id, success) {

    if (!success) {
        console.log("b4w load failure");
        return;
    }

    m_app.enable_camera_controls();

    cam = m_scenes.get_active_camera();
    var photosphere = m_scenes.get_object_by_name("photosphere");
    var photospherePos = m_trans.get_translation(photosphere);

    m_cam.hover_setup(cam, {pivot: photospherePos});

    // place your code here
    var canvas_elem = m_cont.get_canvas();
    canvas_elem.addEventListener("mousedown", main_canvas_click, false);
    canvas_elem.addEventListener("touchstart", main_canvas_click, false);

}

function main_canvas_click(e) {
    if (e.preventDefault)
        e.preventDefault();
    var x = m_mouse.get_coords_x(e);
    var y = m_mouse.get_coords_y(e);

    var obj = m_scenes.pick_object(x, y);
    var pos = m_trans.get_translation(obj);

    if (obj) {
        console.log("click", obj);
        m_cam.eye_setup(cam, {pos: pos});
    }
}


});

// import the app module and start the app by calling the init method
b4w.require("3D_campus_b4w_c_main").init();
