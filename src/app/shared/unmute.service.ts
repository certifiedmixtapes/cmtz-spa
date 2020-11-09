import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnmuteService {
  
    constructor() {}

    unmute(context:AudioContext):void
{
// Determine page visibility api
type PageVisibilityAPI = { hidden:string, visibilitychange:string };
let pageVisibilityAPI:PageVisibilityAPI;
if (document.hidden !== undefined) pageVisibilityAPI = { hidden:"hidden", visibilitychange:"visibilitychange" };
//else if ((document).webkitHidden !== undefined) pageVisibilityAPI = { hidden:"webkitHidden", visibilitychange:"webkitvisibilitychange" };
//else if ((document).mozHidden !== undefined) pageVisibilityAPI = { hidden:"mozHidden", visibilitychange:"mozvisibilitychange" };
//else if ((document).msHidden !== undefined) pageVisibilityAPI = { hidden:"msHidden", visibilitychange:"msvisibilitychange" };

// Determine if ios
let ua:string = navigator.userAgent.toLowerCase();
let isIOS:boolean = (ua.indexOf("iphone") >= 0 && ua.indexOf("like iphone") < 0 || ua.indexOf("ipad") >= 0 && ua.indexOf("like ipad") < 0 || ua.indexOf("ipod") >= 0 && ua.indexOf("like ipod") < 0);

// Track desired audio state
let suspendAudio:boolean = false;
let audioUnlockingEvents:string[] = ["click", "contextmenu", "auxclick", "dblclick", "mousedown", "mouseup", "touchend", "keydown", "keyup"];

// Track web audio state
let contextUnlockingEnabled:boolean = false;

// Track html audio state
let tag:HTMLAudioElement;
let tagUnlockingEnabled:boolean = false;
let tagPendingChange:boolean = false;



function contextStateCheck(tryResuming:boolean):void
{
	if (context.state == "running")
	{
		// No need to watch for unlocking events while running
		toggleContextUnlocking(false);

		// Check if our state matches
		if (suspendAudio)
		{
			// We want to be suspended, we can suspend at any time
			context.suspend().then(context_promiseHandler, context_promiseHandler);
		}
	}
	else if (context.state != "closed")
	{
		// Interrupted or suspended, check if our state matches
		if (!suspendAudio)
		{
			// We want to be running
			toggleContextUnlocking(true);
			if (tryResuming) context.resume().then(context_promiseHandler, context_promiseHandler);
		}
		else
		{
			// We don't want to be running, so no need to watch for unlocking events
			toggleContextUnlocking(false);
		}
	}
}

function toggleContextUnlocking(enable:boolean):void
{
	if (contextUnlockingEnabled === enable) return;
	contextUnlockingEnabled = enable;
	for (let evt of audioUnlockingEvents)
	{
		if (enable) window.addEventListener(evt, context_unlockingEvent, <any>{ capture: true, passive: true });
		else window.removeEventListener(evt, context_unlockingEvent, <any>{ capture: true, passive: true });
	}
}

function context_statechange():void
{
	contextStateCheck(true);
}

function context_promiseHandler():void
{
	contextStateCheck(false);
}

function context_unlockingEvent():void
{
	contextStateCheck(true);
}

function tagStateCheck(tryChange:boolean):void
{
	// We have a pending state change, let that resolve first
	if (tagPendingChange) return;

	if (!tag.paused)
	{
		// No need to watch for unlocking events while running
		toggleTagUnlocking(false);

		// Check if our state matches
		if (suspendAudio)
		{
			// We want to be suspended, we can suspend at any time
			tag.pause();			// instant action, so no need to set as pending
		}
	}
	else
	{
		// Tag isn't playing, check if our state matches
		if (!suspendAudio)
		{
			// We want to be running
			if (tryChange)
			{
				// Try forcing a change, so stop watching for unlocking events while attempt is in progress
				toggleTagUnlocking(false);

				// Attempt to play
				tagPendingChange = true;
				let p:Promise<void>;
				try
				{
					p = tag.play();
					if (p) p.then(tag_promiseHandler, tag_promiseHandler);
					else
					{
						tag.addEventListener("playing", tag_promiseHandler);
						tag.addEventListener("abort", tag_promiseHandler);
						tag.addEventListener("error", tag_promiseHandler);
					}
				}
				catch (err)
				{
					tag_promiseHandler();
				}
			}
			else
			{
				// We're not going to try resuming this time, but make sure unlocking events are enabled
				toggleTagUnlocking(true);
			}
		}
		else
		{
			// We don't want to be running, so no need to watch for unlocking events
			toggleTagUnlocking(false);
		}
	}
}

function toggleTagUnlocking(enable:boolean):void
{
	if (tagUnlockingEnabled === enable) return;
	tagUnlockingEnabled = enable;
	for (let evt of audioUnlockingEvents)
	{
		if (enable) window.addEventListener(evt, tag_unlockingEvent, <any>{ capture: true, passive: true });
		else window.removeEventListener(evt, tag_unlockingEvent, <any>{ capture: true, passive: true });
	}
}

function tag_promiseHandler():void
{
	tag.removeEventListener("playing", tag_promiseHandler);
	tag.removeEventListener("abort", tag_promiseHandler);
	tag.removeEventListener("error", tag_promiseHandler);

	// Tag started playing, so we're not suspended
	tagPendingChange = false;
	tagStateCheck(false);
}

function tag_unlockingEvent():void
{
	tagStateCheck(true);
}

/**
 * A utility function for decompressing the base64 silence string.
 * @param c The number of times the string is repeated in the string segment.
 * @param a The string to repeat.
 */
function poorManHuffman(c:number, a:string):string { let e:string; for (e = a; c > 1; c--) e += a; return e; }

// Watch for tag state changes and check initial state
if (isIOS)
{
	// Is ios, we need to play an html track in the background and disable the widget
	// NOTE: media widget / airplay MUST be disabled with this super gross hack to create the audio tag, setting the attribute in js doesn't work
	let tmp:HTMLDivElement = document.createElement("div");
	tmp.innerHTML = "<audio x-webkit-airplay='deny'></audio>";
	tag = <any>tmp.children.item(0);
	tag.controls = false;
	(<any>tag).disableRemotePlayback = true;				// Airplay like controls on other devices, prevents casting of the tag
	tag.preload = "auto";

	// Set the src to a short bit of url encoded as a silent mp3
	// NOTE The silence MP3 must be high quality, when web audio sounds are played in parallel the web audio sound is mixed to match the bitrate of the html sound
	// 0.01 seconds of silence VBR220-260 Joint Stereo 859B
	//tag.src = "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA//////////////////////////////////////////////////////////////////8AAABhTEFNRTMuMTAwA8MAAAAAAAAAABQgJAUHQQAB9AAAAnGMHkkIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADgnABGiAAQBCqgCRMAAgEAH///////////////7+n/9FTuQsQH//////2NG0jWUGlio5gLQTOtIoeR2WX////X4s9Atb/JRVCbBUpeRUq//////////////////9RUi0f2jn/+xDECgPCjAEQAABN4AAANIAAAAQVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";
	// The str below is a "compressed" version using poor mans huffman encoding, saves about 0.5kb
	tag.src = "data:audio/mpeg;base64,//uQx" + poorManHuffman(23, "A") + "WGluZwAAAA8AAAACAAACcQCA" + poorManHuffman(16, "gICA") + poorManHuffman(66, "/") + "8AAABhTEFNRTMuMTAwA8MAAAAAAAAAABQgJAUHQQAB9AAAAnGMHkkI" + poorManHuffman(320, "A") + "//sQxAADgnABGiAAQBCqgCRMAAgEAH" + poorManHuffman(15, "/") + "7+n/9FTuQsQH//////2NG0jWUGlio5gLQTOtIoeR2WX////X4s9Atb/JRVCbBUpeRUq" + poorManHuffman(18, "/") + "9RUi0f2jn/+xDECgPCjAEQAABN4AAANIAAAAQVTEFNRTMuMTAw" + poorManHuffman(97, "V") + "Q==";
	tag.loop = true;
	tag.load();

	// Try to play right off the bat
	tagStateCheck(true);
}

// Watch for context state changes and check initial state
context.onstatechange = context_statechange;	// NOTE: the onstatechange callback property is more widely supported than the statechange event	context.addEventListener("statechange", context_statechange);
contextStateCheck(false);
}


}