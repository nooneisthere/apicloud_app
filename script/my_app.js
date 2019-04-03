var myStorage=[];

function mysetStorage(kname, data){
    if (debug_mode){
      console.log(kname, data);
      myStorage=data;
    }
    $api.setStorage(kname,data);
}

function mygetStorage(kname){
    if (debug_mode){
        console.log(kname + JSON.stringify(myStorage));
    }
    return $api.getStorage(kname);

    //return myStorage;
}

function loadScriptString(code) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    try {
        script.appendChild(document.createTextNode(code));
    } catch (ex) {
        script.text = code;
    }
    document.body.appendChild(script);
}

function create_script(url){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    $api.dom('body').appendChild(script);
}

function printout(msg) {
    var str = '<div>' + msg + '</div>';
    var msg_container = document.getElementById('show_msg');
    $api.append(msg_container, str);
    //document.getElementById('show_msg').appendChild(str);
}

function write_whereisit(){
    api.writeFile({
        path: 'fs://whereisit',
        data:'whereisit'
    }, function(ret, err){
        printout('writeFile: '+ err + ' : ' +  JSON.stringify(ret));
    });
}


function loadScript(path){
    api.readFile({
        path: path
    }, function(ret, err){
        if (ret.status){
            loadScriptString(ret.data);
        }
    });
}

function myalarm(title,details){
    api.notification({
        notify: {
            title: title,
            content: details
        },
        vibrate:[100, 500, 200],
        sound:'default'
    });
}
