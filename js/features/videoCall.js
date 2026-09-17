function initAgoraClient() {
  if (AGORA_CLIENT) return;
  AGORA_CLIENT = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  setupAgoraEventListeners();
}

function setupAgoraEventListeners() {
  if (!AGORA_CLIENT) return;

  AGORA_CLIENT.on('user-published', async (user, mediaType) => {
    await AGORA_CLIENT.subscribe(user, mediaType);
    const id = user.uid;
    remoteUsers[id] = user;

    if (mediaType === 'video') {
      const remoteVideoTrack = user.videoTrack;
      const remotePlayerContainer = document.getElementById('remote-playerlist');

      let playerContainer = document.getElementById(`remote-player-${id}`);
      if (!playerContainer) {
        playerContainer = document.createElement('div');
        playerContainer.id = `remote-player-${id}`;
        playerContainer.className = 'remote-player-box';
        playerContainer.innerHTML = `<span class="player-label">User ${id}</span>`;
        remotePlayerContainer.appendChild(playerContainer);
      }

      remoteVideoTrack.play(playerContainer);
    }

    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  });

  const removeRemoteUser = (user) => {
    const id = user.uid;
    delete remoteUsers[id];
    const playerContainer = document.getElementById(`remote-player-${id}`);
    if (playerContainer) playerContainer.remove();
  };

  AGORA_CLIENT.on('user-unpublished', removeRemoteUser);
  AGORA_CLIENT.on('user-left', removeRemoteUser);
}

async function joinCall() {
  if (!AGORA_CLIENT) initAgoraClient();

  if (!AGORA_CLIENT) {
    console.error('Agora SDK not loaded');
    document.getElementById('callStatus').innerHTML = '<span class="status-dot" style="background: #ef4444;"></span><span>🔴 SDK Error</span>';
    return;
  }

  const channel = 'study_session_room';
  const uid = Math.floor(Math.random() * 100000);

  document.getElementById('callStatus').innerHTML = `<span class="status-dot"></span><span>Connecting... UID: ${uid}</span>`;

  try {
    await AGORA_CLIENT.join(AGORA_APP_ID, channel, null, uid);

    localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
    await AGORA_CLIENT.publish(Object.values(localTracks));

    const localPlayerContainer = document.getElementById('local-player');
    localPlayerContainer.innerHTML = '<span class="player-label">You</span>';
    localTracks.videoTrack.play(localPlayerContainer);
    document.getElementById('callStatus').innerHTML = `<span class="status-dot"></span><span>🟢 In Call (UID: ${uid})</span>`;
  } catch (error) {
    console.error('Join error:', error);
    document.getElementById('callStatus').innerHTML = '<span class="status-dot" style="background: #ef4444;"></span><span>🔴 Failed to join</span>';
  }
}

async function leaveCall() {
  if (!AGORA_CLIENT || !AGORA_CLIENT.uid) {
    document.getElementById('callStatus').innerHTML = '<span class="status-dot"></span><span>Ready to Connect</span>';
    return;
  }

  if (isScreenSharing) await stopScreenShare();

  if (localTracks.audioTrack) localTracks.audioTrack.close();
  if (localTracks.videoTrack) localTracks.videoTrack.close();

  await AGORA_CLIENT.leave();

  document.getElementById('local-player').innerHTML = '<span class="player-label">You</span>';
  document.getElementById('remote-playerlist').innerHTML = '';
  document.getElementById('callStatus').innerHTML = '<span class="status-dot"></span><span>Call Ended</span>';
  document.getElementById('screenShareBtn').textContent = '🖥️ Share Screen';
  remoteUsers = {};
}

async function toggleScreenShare() {
  if (!AGORA_CLIENT || !AGORA_CLIENT.uid) {
    document.getElementById('callStatus').innerHTML = '<span class="status-dot" style="background: #f59e0b;"></span><span>⚠️ Join call first</span>';
    return;
  }

  if (isScreenSharing) {
    await stopScreenShare();
  } else {
    await startScreenShare();
  }
}

async function startScreenShare() {
  if (!AGORA_CLIENT) return;

  try {
    document.getElementById('screenShareBtn').textContent = '⏳ Starting...';

    screenTrack = await AgoraRTC.createScreenVideoTrack({}, 'auto');
    const videoTrack = Array.isArray(screenTrack) ? screenTrack[0] : screenTrack;

    await AGORA_CLIENT.unpublish([localTracks.videoTrack]);
    await AGORA_CLIENT.publish([videoTrack]);

    const localPlayerContainer = document.getElementById('local-player');
    localPlayerContainer.innerHTML = '<span class="player-label">My Screen</span>';
    videoTrack.play(localPlayerContainer);

    isScreenSharing = true;
    document.getElementById('screenShareBtn').textContent = '🛑 Stop Sharing';
    document.getElementById('callStatus').innerHTML = '<span class="status-dot"></span><span>🟢 Sharing Screen</span>';

    videoTrack.on('track-ended', async () => {
      await stopScreenShare();
    });
  } catch (error) {
    console.error('Screen share error:', error);
    document.getElementById('screenShareBtn').textContent = '🖥️ Share Screen';
  }
}

async function stopScreenShare() {
  if (!screenTrack) return;

  try {
    const videoTrack = Array.isArray(screenTrack) ? screenTrack[0] : screenTrack;

    await AGORA_CLIENT.unpublish([videoTrack]);
    videoTrack.close();
    await AGORA_CLIENT.publish([localTracks.videoTrack]);

    const localPlayerContainer = document.getElementById('local-player');
    localPlayerContainer.innerHTML = '<span class="player-label">You</span>';
    localTracks.videoTrack.play(localPlayerContainer);

    screenTrack = null;
    isScreenSharing = false;
    document.getElementById('screenShareBtn').textContent = '🖥️ Share Screen';
    document.getElementById('callStatus').innerHTML = '<span class="status-dot"></span><span>🟢 In Call</span>';
  } catch (error) {
    console.error('Error stopping screen share:', error);
  }
}
