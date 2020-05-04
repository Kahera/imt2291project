import { LitElement, html, css } from 'lit-element';
import '@polymer/iron-selector/iron-selector'

export class ComponentVideoplayer extends LitElement {
    //A lot of code borrowed from videoVTT example

    static get properties() {
        return {
            vid: String,
            vttfile: String,
            thumbnail: String,
            cues: Array,
        }
    }

    constructor() {
        super();
        this.vttfile = '';
        this.cues = [];
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 10px 20px;
            }

            video, p {
                width: 100%
            }
            `,
        ]
    }

    render() {
        return html`
        <video controls poster="${window.MyAppGlobals.serverURL}src/Backend/Video/getVideoThumbnail.php?vid=${this.vid}">
            <source src="${window.MyAppGlobals.serverURL}src/Backend/Video/getVideoFile.php?vid=${this.vid}" type="video/mp4">
            <track kind="subtitles" label="Subtitles" src="${window.MyAppGlobals.serverURL}src/Backend/Video/getVideoSubtitles.php?vid=${this.vid}" @load='${this.loadCaption}' default></track>
        </video>
        
        <!--
        <div class="speed">
            <iron-selector slected="1">
                <b>Speed</b>
                <div @click="${this.adjustSpeed}" data-speed='2'>2x</div>
                <div @click="${this.adjustSpeed}" data-speed='1.75'>1.75x</div>
                <div @click="${this.adjustSpeed}" data-speed='1.5'>1.5x</div>
                <div @click="${this.adjustSpeed}" data-speed='1.25'>1.25x</div>
                <div @click="${this.adjustSpeed}" data-speed='1'>1x</div>
                <div @click="${this.adjustSpeed}" data-speed='0.75'>0.75x</div>
                <div @click="${this.adjustSpeed}" data-speed='0.5'>0.5x</div>
            </iron-selector>
        </div>
        -->
        `;
    }

    adjustSpeed(e) {
        let target = (e.originalTarget || e.path[0]);
        const video = this.shadowRoot.querySelector('video');
        video.playbackRate = target.dataset.speed;
    }

    /**
   * Set the current time of the video to the given time.
   * @param {[Number]} time the time to set as the current time.
   */
    setTime(time) {
        this.shadowRoot.querySelector('video').currentTime = time;
    }

    /**
     * Triggered when the track is loaded in the view.
     * Loads, hides and stores the original cues, then injects elements into the 'caption' list.
     */
    loadCaption(e) {
        const video = this.shadowRoot.querySelector('video');
        const list = this.shadowRoot.querySelector('#caption ul')

        // hide the original track on load
        const track = (e.target.track || video.textTracks[0])
        track.mode = 'hidden'

        // listen to cue changes
        track.addEventListener('cuechange', e => this._updateCaption(e))

        // store the cues
        for (let i = 0; i < track.cues.length; i++) {
            const cue = track.cues[i]
            this.cues.push(cue)

            // create and inject cue element(s)
            const li = document.createElement('li')
            li.dataset.id = cue.id
            li.innerHTML = cue.text
            li.addEventListener('click', e => this._selectCaption(e))

            list.appendChild(li)
        }
    }

    /**
     * When the video has been added to the DOM an event listener listening for
     * load events is added to the track element (containing the vtt source).
     * This is used to get the cues as soon as a vtt file is loaded, this is then
     * made available to container tags through dispatching a "cuesUpdated" event.
     *
     * The subtitle track is hidden from the video and then an eventListener is
     * added to the subtitle track so that we can dispatch a cuechange event
     * when cues are activated/deactivated.
     */
    firstUpdated() {
        const track = this.shadowRoot.querySelector('video track');
        track.addEventListener('load', e => {                       // vtt file is loaded
            this.cues = [];
            const trackCues = e.path[0].track.cues;
            for (let i = 0; i < trackCues.length; i++) {               // Go through the cue list
                this.cues.push({ text: trackCues[i].text, id: trackCues[i].id, startTime: trackCues[i].startTime });
            };
            // console.log (this.cues);

            this.dispatchEvent(new CustomEvent("cuesUpdated", {
                bubbles: true,
                composed: true,
                detail: {
                    cues: this.cues
                }
            }));
        });

        this.shadowRoot.querySelector('video').textTracks[0].mode = 'hidden';
        this.shadowRoot.querySelector('video').textTracks[0].addEventListener('cuechange', e => {   // When a cue change event occurs
            // console.log(e);
            const startTimes = [];
            for (let i = 0; i < e.target.activeCues.length; i++) {
                startTimes.push(e.target.activeCues[i].startTime);
            }

            this.dispatchEvent(new CustomEvent('cuechange', {
                bubbles: true,
                composed: true,
                detail: {
                    activeCues: startTimes
                }
            }));
        });
    }


}
customElements.define('component-videoplayer', ComponentVideoplayer);