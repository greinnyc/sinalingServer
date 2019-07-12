
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang = "en"> 
   <head> 
      <meta charset = "utf-8" /> 
   </head>
	
   <body> 
        <div id="container">
            <div> 
                <input type = "text" id = "loginInput" /> 
                <button id = "loginBtn">Login</button> 
            </div> 

            <div> 
                <input type = "text" id = "otherUsernameInput" /> 
                <button id = "connectToOtherUsernameBtn">Establish connection</button> 
            </div> 

            <div> 
                <input type = "text" id = "msgInput" /> 
                <button id = "sendMsgBtn">Send text message</button> 
            </div> 
            <div> 
                <input type = "text" id = "showMsg" /> 
            </div> 

            <div id="audio">
                <div>
                    <div class="label">Local audio:</div>
                    <audio id="audio1" autoplay controls muted></audio>
                    <audio id="audio2" autoplay controls muted></audio>
                </div>
            </div>
            <div id="buttons">
                <select id="codec">
                    <!-- Codec values are matched with how they appear in the SDP.
                    For instance, opus matches opus/48000/2 in Chrome, and ISAC/16000
                    matches 16K iSAC (but not 32K iSAC). -->
                    <option value="opus">Opus</option>
                    <option value="ISAC">iSAC 16K</option>
                    <option value="G722">G722</option>
                    <option value="PCMU">PCMU</option>
                </select>
                <button id="callButton">Call</button>
                <button id="hangupButton">Hang Up</button>
            </div>
            <div class="graph-container" id="bitrateGraph">
                <div>Bitrate</div>
                <canvas id="bitrateCanvas"></canvas>
            </div>
            <div class="graph-container" id="packetGraph">
                <div>Packets sent per second</div>
                <canvas id="packetCanvas"></canvas>
            </div>

            <a href="https://github.com/webrtc/samples/tree/gh-pages/src/content/peerconnection/audio"
               title="View source for this page on GitHub" id="viewSource">View source on GitHub</a>
        </div>

        <script src = "client.js"></script>
   </body>
	
</html>