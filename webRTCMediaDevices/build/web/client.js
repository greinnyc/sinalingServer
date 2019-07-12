var loginInput = document.querySelector('#loginInput'); 
var loginBtn = document.querySelector('#loginBtn');
var otherUsernameInput = document.querySelector('#otherUsernameInput'); 
var connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn'); 
var connectedUser;
let localStream;
const audio2 = document.querySelector('audio#audio2');
var host = window.location.host.split(":");  
//var connection = new WebSocket('ws://' + host[0] + ':6503');
var connection = new WebSocket('ws://34.67.38.79:8080');

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 0,
  voiceActivityDetection: false
};

//evento de click en login
loginBtn.addEventListener("click", function() { 
    name = loginInput.value; 	
    if(name.length > 0) { 
        send({ 
            type: "login", 
            name: name 
        }); 
   } 
}); 
//funcion para enviar mensajes al server de websocket
function send(message) { 
    if (connectedUser) { 
       message.name = connectedUser; 
    }
    connection.send(JSON.stringify(message)); 
};


//WEBSOCKET
//manejador de mensajes en websocket
connection.onmessage = function (message) { 
    console.log("MESSAGE WEBSOCKET", message.data); 
    var data = JSON.parse(message.data); 
    switch(data.type) { 
        case "login": 
           onLogin(data.success); 
           break; 
        case "offer": 
           onOffer(data.offer, data.name); 
           break; 
        case "answer":
           onAnswer(data.answer); 
           break; 
        case "candidate": 
           onCandidate(data.candidate); 
           break; 
        default: 
           break; 
    } 
};
connection.onopen = function () { 
    console.log("Connected"); 
};  
connection.onerror = function (err) { 
    console.log("Got error", err); 
};

//WEBSOCKET

//when a user logs in 
function onLogin(success) { 
    if (success === false) { 
        alert("oops...try a different username"); 
    } else { 
        //creating our RTCPeerConnection object 
        var configuration = { 
            "iceServers": [{ "url": "stun:stun.1.google.com:19302" }]
        };

        myConnection = new RTCPeerConnection(configuration); 
        console.log("RTCPeerConnection object was created"); 
        console.log(myConnection); 
    
        //setup ice handling 
        //when the browser finds an ice candidate we send it to another peer 
        myConnection.onicecandidate = function (event) { 
            if (event.candidate) { 
                console.log("event Candidatte send to websocket: ",event);		
                send({ 
                    type: "candidate", 
                    candidate: event.candidate 
                });
             } 
        };
        myConnection.ontrack = gotRemoteStream;
        console.log('Requesting local stream');
        navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false
        })
        .then(function(stream){
            localStream = stream;
            const audioTracks = localStream.getAudioTracks();
            if (audioTracks.length > 0) {
              console.log(`Using Audio device: ${audioTracks[0].label}`);
            }
            localStream.getTracks().forEach(track => myConnection.addTrack(track, localStream));
            console.log('Adding Local Stream to peer connection');
        })
        .catch(e => {
          alert(`getUserMedia() error: ${e.name}`);
        });
        
        
   } 
};
//conectar con otro pc 



connectToOtherUsernameBtn.addEventListener("click", function () {
    var otherUsername = otherUsernameInput.value;
    connectedUser = otherUsername;
	
    if (otherUsername.length > 0) { 
      //crea la oferta de conexion
        myConnection.createOffer(offerOptions).then(function (offer) { 
            send({ 
                type: "offer", 
                offer: offer 
            });
            //setea su sdp (session description protocol)
            myConnection.setLocalDescription(offer); 
        }, function (error) { 
            alert("An error has occurred.",error); 
        }); 
    } 
});

//evento para recibir la conexion de otra pc (pc2)
function onOffer(offer, name) { 
    connectedUser = name; 
    myConnection.setRemoteDescription(offer);
    //crea la respuesta a la oferta 
    myConnection.createAnswer(function (answer) { 
        myConnection.setLocalDescription(answer); 
        send({ 
            type: "answer", 
            answer: answer 
        }); 
    }, function (error) { 
        alert("oops...error",error); 
    }); 
}

//evento que se ejecuta cuando se genera un ICE candidate
function onCandidate(candidate) {

    myConnection.addIceCandidate(candidate).then(
        onAddIceCandidateSuccess,
        onAddIceCandidateError);
        console.log('Remote ICE candidate: ', candidate);
       
}

//evento que recibe la respuesta
function onAnswer(answer) { 
    myConnection.setRemoteDescription(new RTCSessionDescription(answer)); 
}

function gotRemoteStream(e) {
  if (audio2.srcObject !== e.streams[0]) {
    audio2.srcObject = e.streams[0];
    console.log('Received remote stream');
  }
}

function onAddIceCandidateSuccess(){
    console.log("AddIceCandidate success.");
}
function onAddIceCandidateError(event){
    console.log('Failed to add Ice Candidate: ', event);
}