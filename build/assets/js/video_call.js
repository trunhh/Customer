var stringeeClient;
var fromNumber = "9999" + localStorage.getItem("CustomerID");
var call;
let _interval;
let _enableVideo=true;

$(document).ready(function () {
  //check isWebRTCSupported
  console.log(
    "StringeeUtil.isWebRTCSupported: " + StringeeUtil.isWebRTCSupported()
  );

  $("#loginBtn").on("click", function () {
    $("#loggedUserId").html("Connecting...");
    var settings = {
      url:
        "https://api-node-calltoken.vps.vn/token" +
        localStorage.getItem("CustomerID"),
      method: "GET",
      timeout: 0,
    };

    $.ajax(settings).done(function (response) {
      var accessToken = response;
      console.log("accessToken...: " + accessToken);

      stringeeClient = new StringeeClient();

      settingClientEvents(stringeeClient);

      stringeeClient.connect(accessToken);
      /* const myTimeout = setTimeout(testMakeCall(true), 5000);
      clearTimeout(myTimeout); */
    });
  });
  $("#videoCallBtn").on("click", function (e) {
    e.preventDefault();
    testMakeCall(true);
  });
  $("#callBtn").on("click", function (e) {
    e.preventDefault();
    testMakeCall(false);
  });
  $("#hangupBtn").on("click", function (e) {
    e.preventDefault();
    testHangupCall();
  });
  $("#muteBtn").on("click", function (e) {
    e.preventDefault();
    mute();
  });
  $("#enableVideoBtn").on("click", function (e) {
    e.preventDefault();
    enableVideo();
    _enableVideo=!_enableVideo;
    if(_enableVideo)
      $("#enableVideoBtn").html('<span class="material-icons" style="font-size: 25px">videocam_off</span>');
    else
      $("#enableVideoBtn").html('<span class="material-icons" style="font-size: 25px">videocam</span>');
  });
  $("#loginBtn").click().delay(200);
});

window.onbeforeunload = function(e){
  $("#hangupBtn").click();
}

/* function testAnswerCall() {
  call.answer(function (res) {
    console.log("answer res", res);
    $("#incoming-call-div").hide();
  });
}

function testRejectCall() {
  callEnded();

  call.reject(function (res) {
    console.log("reject res", res);
    $("#incoming-call-div").hide();
  });
} */

function testMakeCall(videocall) {
  console.log("make call, videocall: " + videocall);
  //				var videoCall = false;
  call = new StringeeCall(
    stringeeClient,
    fromNumber,
    $("#callTo").val(),
    videocall
  );

  //call.videoResolution = {width: 1280, height: 720};

  settingCallEvent(call);

  call.makeCall(function (res) {
    console.log("make call callback: " + JSON.stringify(res));
  });
  $("#callTime").text("Đang đổ chuông ...");
}

function settingClientEvents(client) {
  client.on("connect", function () {
    console.log("++++++++++++++ connected to StringeeServer");
  });

  client.on("authen", function (res) {
    console.log("authen", res);
    if (res.r === 0) {
      $("#loggedUserId").html(res.userId);
      $("#loggedUserId").css("color", "blue");

      $("#callBtn").removeAttr("disabled");
      $("#videoCallBtn").removeAttr("disabled");
    } else {
      $("#loggedUserId").html(res.message);
    }
  });

  client.on("disconnect", function () {
    $("#callBtn").attr("disabled", "disabled");
    $("#videoCallBtn").attr("disabled", "disabled");
    console.log("++++++++++++++ disconnected: " + this.test);
  });

  client.on("incomingcall", function (incomingcall) {
    call = incomingcall;
    settingCallEvent(incomingcall);

    //			call.videoResolution = {width: 1280, height: 720};

    $("#incoming-call-div").show();

    call.ringing(function (res) {});

    console.log("++++++++++++++ incomingcall", incomingcall);
  });

  client.on("requestnewtoken", function () {
    console.log(
      "++++++++++++++ requestnewtoken; please get new access_token from YourServer and call client.connect(new_access_token)+++++++++"
    );
    //please get new access_token from YourServer and call:
    //client.connect(new_access_token);
  });
}

function settingCallEvent(call1) {
  callStarted();

  call1.on("addremotestream", function (stream) {
    console.log("addremotestream");
    // reset srcObject to work around minor bugs in Chrome and Edge.
    remoteVideo.srcObject = null;
    remoteVideo.srcObject = stream;
  });

  call1.on("addlocalstream", function (stream) {
    console.log("addlocalstream");
    // reset srcObject to work around minor bugs in Chrome and Edge.
    localVideo.srcObject = null;
    localVideo.srcObject = stream;
  });

  call1.on("error", function (info) {
    console.log("on error: " + JSON.stringify(info));
  });

  call1.on("signalingstate", function (state) {
    console.log("signalingstate ", state);
    var reason = state.reason;
    $("#callStatus").html(reason);
    if (state.code === 6) {
      //call Ended
      $("#incoming-call-div").hide();
      callEnded();
    } else if (state.code === 5) {
      //busy
      callEnded();
    }
  });

  call1.on("mediastate", function (state) {
    console.log("mediastate ", state);
    let _sec = 0;
    _interval = setInterval(function () {
      _sec++;
      $("#callTime").text(ToHHMMSS(_sec));
    }, 1000);
  });

  call1.on("info", function (info) {
    console.log("on info:" + JSON.stringify(info));
  });

  call1.on("otherdevice", function (data) {
    console.log("on otherdevice:" + JSON.stringify(data));
    if (
      (data.type === "CALL_STATE" && data.code >= 200) ||
      data.type === "CALL_END"
    ) {
      $("#incoming-call-div").hide();
      callEnded();
    }
  });
}

function testHangupCall() {
  remoteVideo.srcObject = null;
  callEnded();

  call.hangup(function (res) {
    console.log("hangup res", res);
  });
}

function upgradeToVideoCall() {
  call.upgradeToVideoCall();
}

function switchVoiceVideoCall() {
  var info = { requestVideo: true };

  console.log(
    'please using upgradeToVideoCall() method to enable/disable local video, send request enable video to "partner"'
  );

  call.sendInfo(info, function (res) {
    console.log("switchVoiceVideoCall", res);
  });
}

function mute() {
  var muted = !call.muted;
  call.mute(muted);
  if (muted) {
    $("#muteBtn").html('<span class="material-icons" style="font-size: 25px">mic</span>');
  } else {
    $("#muteBtn").html('<span class="material-icons" style="font-size: 25px">mic_off</span>');
  }
}

function enableVideo() {
  var success;
  if (call.localVideoEnabled) {
    success = call.enableLocalVideo(false);
  } else {
    success = call.enableLocalVideo(true);
  }
  console.log("enableVideo result: " + success);
}

function callStarted() {
  $("#hangupBtn").removeAttr("disabled");
  //$("#upgradeToVideoCallBtn").removeAttr("disabled");
  //$("#switchVoiceVideoBtn").removeAttr("disabled");
  $("#muteBtn").removeAttr("disabled");
  $("#enableVideoBtn").removeAttr("disabled");

  $("#hangupBtn").fadeIn();
  $("#muteBtn").fadeIn();
  $("#enableVideoBtn").fadeIn();
  $("#videoCallBtn").fadeOut();
  $("#callBtn").fadeOut();
}

function ToHHMMSS(_sec) {
  var sec_num = _sec; // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
}

function callEnded() {
  //$("#hangupBtn").attr("disabled", "disabled");
  //$("#upgradeToVideoCallBtn").attr("disabled", "disabled");
  //$("#switchVoiceVideoBtn").attr("disabled", "disabled");
  //$("#muteBtn").attr("disabled", "disabled");
  //$("#enableVideoBtn").attr("disabled", "disabled");

  $("#hangupBtn").fadeOut();
  $("#muteBtn").fadeOut();
  $("#enableVideoBtn").fadeOut();
  $("#videoCallBtn").fadeIn();
  $("#callBtn").fadeIn();

  setTimeout(function () {
    $("#callStatus").html("Call ended");
  }, 1500);
  clearInterval(_interval);
  window.close();
}
