import { useEffect, useRef } from "react"

export type VideoProps = { videoURL: string };

export const VideoPlayer = (props: VideoProps) => {
    const iFrameRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const iframe = iFrameRef.current;

        iframe!.onload = function () {
            const iFrameDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
            const scriptTag = iFrameDoc?.querySelector('#po');

            if (scriptTag) {
                let content = scriptTag.textContent;
                const playerOptionsIndex = content!.indexOf('var player_options = {');
                if (playerOptionsIndex !== -1) {
                    content = content?.slice(0, playerOptionsIndex + 'var player_options = {'.length) + ` src: ${props.videoURL}, \n` +
                        content?.slice(playerOptionsIndex + 'var player_options = {'.length);
                }

                scriptTag.textContent = content;
            }
        }
    }, []);

    return <iframe src={`./src/components/player.html`} title="player" ref={iFrameRef}></iframe>
}