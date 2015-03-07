window.onload = function(){
    var socket = io()
    var sendButton = document.getElementById("send")
    var ifield = document.getElementById("inputfield")
    var datfield = document.getElementById("data")
    var statfield = document.getElementById("status")
    var sub = function(){
        $("#status").removeClass("invisible")
        var data = ifield.value
        if(data.match(/(hr|hres|sr|hjres|sjres|hconres|sconres)\d*\-\d{2,}/g) === null){
            socket.emit('search', {s: data})
        } else {
            socket.emit('query', {q: data})
        }
        datfield.innerHTML = ""
    }
    var status = 0;
    socket.on("update", function(message){
        status+=10;
        $("#statusbar").css('width',status.toString()+"%").attr('aria-valuenow',status.toString())
    })
    socket.on("err", function(errm){
        datfield.innerHTML = errm['err'];
    })
    socket.on("done", function(data){
        $("#statusbar").css('width',"100%").attr('aria-valuenow',"100")
        $("#stbwrp").removeClass("active progress-striped")
        datfield.innerHTML = ""
        var content = null
        for(row in data['arr']){
            if(row == 0){
                content = document.createElement('thead');
            } else if(row == 1){
                content = document.createElement('tbody');
            }
            var tr = document.createElement('tr');
            for(col in data['arr'][row]){
                if(col == 0 && row == 0){
                    a = document.createTextNode("");
                    tc = document.createElement("td");
                    tr.appendChild(tc);
                }else{
                    var t = data['arr'][row][col];
                    var text = document.createTextNode(t.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    var tc = document.createElement("td");
                    tc.appendChild(text)
                    tr.appendChild(tc)
                }
            }
            if(row == 0){
                content.appendChild(tr);
                datfield.appendChild(content);
            } else{
                content.appendChild(tr);
            }
        }
        datfield.appendChild(content);
    })
    sendButton.onclick = function(){
        sub()
    }
    ifield.onkeypress = function(e){
        if(e.which == 13){
            sub()
        }
    }
}
