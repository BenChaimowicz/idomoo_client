import './video_player.css';
import { useEffect, useRef, useState } from "react"

export type VideoProps = { videoURL: string, onBackClick: () => void };

export const VideoPlayer = (props: VideoProps) => {
    const [, setVideoURL] = useState<string>();
    const iFrameRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        setVideoURL(props.videoURL);
        const iframe = iFrameRef.current;

        iframe!.onload = function () {
            const iFrameDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
            const scriptTag = iFrameDoc?.querySelector('#po');

            if (scriptTag) {
                let content = scriptTag.textContent;
                const playerOptionsIndex = content!.indexOf('var player_options = {');
                if (playerOptionsIndex !== -1) {
                    content = content?.slice(0, playerOptionsIndex + 'var player_options = {'.length) + ` src: "${props.videoURL}", \n` +
                        content?.slice(playerOptionsIndex + 'var player_options = {'.length);
                }

                scriptTag.textContent = content;
            }
        }
        // window.location.replace(props.videoURL);

    }, []);

    return <>
        <div className="videoContainer">
            {/* <iframe src={`./src/components/player.html`} title="player" ref={iFrameRef} width='800' height='600'></iframe> */}
            <div className='backBtnContainer'>
                <button onClick={props.onBackClick}>Back</button>
            </div>
        </div>
    </>
}