import AgoraRTC from "agora-rtc-sdk-ng"; 

// RTC client instance
let client = null;

// Declare variables for local tracks
let localAudioTrack = null; 
let localVideoTrack = null; 

// Connection parameters
let appId = "14aa512a219543b4bb64defb07208fdf";
let channel = "StudyGenie";
let token = "007eJxTYEjYVakz0zvnPOPcnmPb8rr+x/x4b+OgY3RHsizkTsiSmG0KDIYmiYmmhkaJRoaWpibGSSZJSWYmKalpSQbmRgYWaSlpX63FMxsCGRnOvdBkYmSAQBCfiyG4pDSl0j01LzOVgQEATc4ioA=="; 
let uid = 0; // User ID

// Initialize the AgoraRTC client
function initializeClient() {
    client = AgoraRTC.createClient({ mode: "live", codec: "vp8", role: "host" });
    setupEventListeners();
}

// Handle client events
function setupEventListeners() {
    client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "video") {
            displayRemoteVideo(user);
        }
        if (mediaType === "audio") {
            user.audioTrack.play();
        }
    });
    client.on("user-unpublished", async (user) => {
        const remotePlayerContainer = document.getElementById(user.uid);
        remotePlayerContainer && remotePlayerContainer.remove();
    });
}

// Create and publish local tracks
async function createLocalTracks() {
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    localVideoTrack = await AgoraRTC.createCameraVideoTrack();
}

// Display local video
function displayLocalVideo() {
    const localPlayerContainer = document.createElement("div");
    localPlayerContainer.id = uid;
    localPlayerContainer.textContent = `Local user ${uid}`;
    localPlayerContainer.style.width = "640px";
    localPlayerContainer.style.height = "480px";
    document.body.append(localPlayerContainer);
    localVideoTrack.play(localPlayerContainer);
}

// Join as a host
async function joinAsHost() {
    await client.join(appId, channel, token, uid);
    // A host can both publish tracks and subscribe to tracks
    client.setClientRole("host");
    // Create and publish local tracks
    await createLocalTracks();
    await publishLocalTracks();
    displayLocalVideo();
    disableJoinButtons();
    console.log("Host joined and published tracks.");
}

// Join as audience
async function joinAsAudience() {
    await client.join(appId, channel, token, uid);
    // Set ultra-low latency level
    let clientRoleOptions = { level: 2 };
    // Audience can only subscribe to tracks
    client.setClientRole("audience", clientRoleOptions);
    disableJoinButtons();
    console.log("Audience joined.");
}

// Publish local tracks
async function publishLocalTracks() {
    await client.publish([localAudioTrack, localVideoTrack]);
}

// Display remote user's video
function displayRemoteVideo(user) {
    const remotePlayerContainer = document.createElement("div");
    remotePlayerContainer.id = user.uid.toString();
    remotePlayerContainer.textContent = `Remote user ${user.uid}`;
    remotePlayerContainer.style.width = "640px";
    remotePlayerContainer.style.height = "480px";
    document.body.append(remotePlayerContainer);
    user.videoTrack.play(remotePlayerContainer);
}

// Leave the channel
async function leaveChannel() {
    if (localAudioTrack) {
        localAudioTrack.close();
        localAudioTrack = null; 
    }
    if (localVideoTrack) {
        localVideoTrack.close();
        localVideoTrack = null; 
    }
    const localPlayerContainer = document.getElementById(uid);
    localPlayerContainer && localPlayerContainer.remove();
    client.remoteUsers.forEach((user) => {
        const playerContainer = document.getElementById(user.uid);
        playerContainer && playerContainer.remove();
    });
    await client.leave();
    enableJoinButtons();
    console.log("Left the channel.");
}

// Disable join buttons
function disableJoinButtons() {
    document.getElementById("host-join").disabled = true;
    document.getElementById("audience-join").disabled = true;
}

// Enable join buttons
function enableJoinButtons() {
    document.getElementById("host-join").disabled = false;
    document.getElementById("audience-join").disabled = false;
}

// Set up event listeners for buttons
function setupButtonHandlers() {
    document.getElementById("host-join").onclick = joinAsHost;
    document.getElementById("audience-join").onclick = joinAsAudience;
    document.getElementById("leave").onclick = leaveChannel;
}

// Start live streaming
function startBasicLiveStreaming() {
    initializeClient();
    window.onload = setupButtonHandlers;
}
startBasicLiveStreaming();