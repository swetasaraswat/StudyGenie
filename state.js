let AGORA_CLIENT = null;
const AGORA_APP_ID = 'f5325eaa6ee4438ba2bd726c1fd892a8';
let localTracks = { videoTrack: null, audioTrack: null };
let remoteUsers = {};
let isScreenSharing = false;
let screenTrack = null;

let quizData = [];
let userAnswers = {};
let historyData = [];
