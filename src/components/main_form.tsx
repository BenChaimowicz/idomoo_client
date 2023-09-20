import { useEffect, useState } from 'react';
import './main_form.css';
import { FileDetails } from './file_details';
import { OnChangeUserDetailsEvent, UserDetails } from './user_details';
import { VideoOptions, VideoOptionsForm } from './video_options';
import { StoryBoardView } from './storyboard';
import axios from 'axios';
import { Spinner } from './spinner';

type GenerateVideoForm = { name: string, email: string, data: StoryboardElement[], format: string, quality: number, height: number, time?: number, fps?: number };
export type GenerateVideoRequest = { storyboard_id: number, data: GenerateVideoDataElement[], output: OutputRoot };
export type StoryboardResponse = { storyboard_id: number, name: string, thumbnail_time: number, width: number, height: number, thumbnail: string, data: StoryboardElement[], last_modified: number, last_modified_string: string };
export type StoryboardElement = { key: string, val: string, description: string };
export type GenerateVideoDataElement = Omit<StoryboardElement, 'description'>;
export type GenerateVideoResponse = { output: OutputRoot, total_cost: number, check_status_url: string };
export type VideoOutput = { format: string, quality?: number, height: number, links?: { url: string } };
export type GIFOutput = { height: number, time: number, fps: number, links?: { url: string } };
export type OutputRoot = { video?: VideoOutput[], gif?: GIFOutput[] };
export type CheckStatusResponse = { id: string, status: VideoStatus };
export type VideoStatus = 'VIDEO_AVAILABLE' | 'RENDERING' | 'IN_PROCESS' | 'IN_QUEUE' | 'ERROR' | 'NOT_EXIST';



export const MainForm = (): JSX.Element => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [mediaElements, setMediaElements] = useState<StoryboardElement[]>([]);
    const [textElements, setTextElements] = useState<StoryboardElement[]>([]);
    const [storyboard, setStoryboard] = useState<StoryboardResponse>();
    const [media, setMedia] = useState<GenerateVideoDataElement[]>([]);
    const [text, setText] = useState<GenerateVideoDataElement[]>([]);
    const [checkURL, setCheckURL] = useState<string>();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [linkToVideo, setLinkToVideo] = useState<string>();
    const [errors, setErrors] = useState<string | null>(null);
    const [videoForm, setVideoForm] = useState<GenerateVideoForm>({
        name: '',
        email: '',
        data: [],
        format: '',
        height: 1080,
        quality: 26
    });

    const changeUserDetails = (e: OnChangeUserDetailsEvent) => {
        setVideoForm(prev => { return { ...prev, ...e } });
    };
    const changeVideoDetails = (e: VideoOptionsForm) => {
        setVideoForm(prev => { return { ...prev, ...e } });
    }
    const changeStoryboard = (e: GenerateVideoDataElement[]) => {
        setText([...e]);
    }
    const changeMedia = (e: GenerateVideoDataElement[]) => {
        setMedia([...e]);
    }

    useEffect(() => {
        setErrors(null);
    }, [videoForm])


    const getStoryboard = async () => {
        const { data } = await axios.get<StoryboardResponse>(`${import.meta.env.VITE_SERVER_URL}/storyboard/`);
        setStoryboard(data);
    }

    const getOutput = (form: GenerateVideoForm): OutputRoot => {
        if (form.format !== 'gif') {
            return { video: [{ format: form.format, height: form.height, quality: form.quality }] };
        }
        return { gif: [{ fps: Number(form.fps) || 15, time: form.time || 0, height: form.height }] };
    }

    const generateVideo = async () => {
        if (!storyboard || !storyboard.storyboard_id) return;
        if (!videoForm || !videoForm.height) return;
        setLoading(true);
        const output = getOutput(videoForm);
        const genForm: GenerateVideoRequest = {
            storyboard_id: storyboard?.storyboard_id,
            output: output,
            data: [...media, ...text]
        }
        if (genForm.data.length !== storyboard.data.length) {
            setLoading(false);
            setErrors('Please check all media and text fields are properly filled');
        }
        const { data } = await axios.post<GenerateVideoResponse>(`${import.meta.env.VITE_SERVER_URL}/storyboard/generate`, genForm);
        if (data.check_status_url) {
            setCheckURL(data.check_status_url);
        }
        if (data.output.video) {
            setLinkToVideo(data.output.video[0].links?.url);
        }
        if (data.output.gif) {
            setLinkToVideo(data.output.gif[0].links?.url);
        }
    }

    const checkVideoStatus = async () => {
        if (!checkURL || !isLoading) return;
        const { data } = await axios.get<CheckStatusResponse>(`${import.meta.env.VITE_SERVER_URL}/status?link=${encodeURIComponent(checkURL)}`);
        console.log('video status:', data.status);
        if ((data.status !== 'ERROR' && data.status !== 'VIDEO_AVAILABLE') || isPlaying) {
            setTimeout(() => {
                checkVideoStatus();
            }, 8000);
        }
        if (data.status === 'VIDEO_AVAILABLE') {
            setLoading(false);
            setIsPlaying(true);
        }
    }

    useEffect(() => {
        setMediaElements([]);
        setTextElements([]);
        getStoryboard();
    }, []);

    useEffect(() => {
        if (!storyboard?.data) return;
        const tmpText = [];
        const tmpMedia = [];
        for (const element of storyboard.data) {
            element.key.toLowerCase().includes('media') ? tmpMedia.push(element) : tmpText.push(element);
        }
        setMediaElements([...tmpMedia]);
        setTextElements([...tmpText]);
        setLoading(false);
    }, [storyboard]);
    useEffect(() => {
        if (!isLoading) return;
        checkVideoStatus();
    }, [checkURL]);

    return <>
        <div className='mainContainer'>
            <div className='formRow' id="header">Enter the details below in order to generate your video</div>
            <div className='formRow' id="nameInfo">
                <UserDetails onChangeUser={changeUserDetails} />
            </div>
            <div className='formRow' id="vars">
                <FileDetails onChangeMedia={changeMedia} elements={mediaElements} />
            </div>
            <div className='formRow' id="storyboard">
                <StoryBoardView onChangeStoryboard={changeStoryboard} elements={textElements} />
            </div>
            <div className='formRow' id="videoOpts">
                <VideoOptions onChangeVideoOptions={changeVideoDetails} />
            </div>
            <div className='formRow' id="footer">
                <div className="third"></div>
                <div className="third">
                    {isLoading ? <Spinner /> : <button className='genButton' hidden={isPlaying} onClick={generateVideo}>Generate</button>}
                </div>
                <div className="third">
                    {errors ? <span>{errors}</span> : <></>}
                    {linkToVideo && !isLoading && !errors && isPlaying ? <a href={linkToVideo} className='watch' onClick={() => setIsPlaying(false)}>Play it!</a> : <></>}
                </div>
            </div>
        </div>
    </>
}