$(document).ready(function(){
    var connection;
    var canvas;
    var ctx;

    function initConnection(){
        connection = new WebSocket('ws://ws.pierre-paul.com:9001/echo');
        logMessage('creating socket');
        connection.onopen = function () {
            logError('Connection open');
        };

        connection.onerror = function (error) {
            logError(error + '<br />');
        };

        connection.onmessage = function (e) {
            logMessage('< ' + e.data);
            infos = jQuery.parseJSON(e.data);
            clearPixels(infos.x, infos.y);
        };    

        connection.onclose = function (e) {
            if(e.wasClean == true){
                logError('Closing connection');
            }else{
                logError('Unable to connect');
            }
        }
    }

    initConnection();
    initCanvas();
    $("button").click(function(){
        console.log(connection);
        if(connection.readyState == connection.OPEN){
            connection.send($("#input-message").val());
            //logMessage('> ' + $("#input-message").val())
        }else if(connection.readyState !== connection.CONNECTING){
            initConnection();
            //$(this).trigger('click');
        }
    });

    function logMessage(message){
        console.log(message);
        $("#messages").append(message + '<br />');
    }

    function logError(error){
        //$("#websocket-infos").append(error+ '<br />');
        console.log(error);
    }

    function initCanvas(){
        canvas = $("#websocket-infos").get(0);
        canvas.setAttribute('height', 280);
        canvas.setAttribute('width', 220);

        ctx = canvas.getContext('2d');
        ctx.fillRect(0,0,220,283);
    }

    function clearPixels(x,y){
        ctx.clearRect(x*10, y*10, 10,10);
    }
});
