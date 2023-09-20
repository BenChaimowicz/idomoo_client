import { useEffect, useState } from 'react';
import './main_form.css';
import { FileDetails } from './file_details';
import { OnChangeUserDetailsEvent, UserDetails } from './user_details';
import { VideoOptions, VideoOptionProps, VideoOptionsForm } from './video_options';
import { StoryBoardView } from './storyboard';
import axios from 'axios';
import { VideoPlayer } from './video_player';

type GenerateVideoForm = { name: string, email: string, data: StoryboardElement[], format: string, quality: number, height: number };
export type GenerateVideoRequest = { storyboard_id: number, data: GenerateVideoDataElement[], output: OutputRoot };
export type StoryboardResponse = { storyboard_id: number, name: string, thumbnail_time: number, width: number, height: number, thumbnail: string, data: StoryboardElement[], last_modified: number, last_modified_string: string };
export type StoryboardElement = { key: string, val: string, description: string };
export type GenerateVideoDataElement = Omit<StoryboardElement, 'description'>;
export type GenerateVideoResponse = { output: OutputRoot, total_cost: number, check_status_url: string };
export type VideoOutput = { format: string, quality?: number, height: number, links?: { url: string } };
export type GIFOutput = {};
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
        console.log(videoForm);
    }, [videoForm])


    const getStoryboard = async () => {
        const { data } = await axios.get<StoryboardResponse>(`${import.meta.env.VITE_SERVER_URL}/storyboard/`);
        setStoryboard(data);
    }

    const generateVideo = async () => {
        if (!storyboard || !storyboard.storyboard_id) return;
        if (!videoForm || !videoForm.format || !videoForm.height || !videoForm.quality) return;
        const genForm: GenerateVideoRequest = {
            storyboard_id: storyboard?.storyboard_id,
            output: { video: [{ format: videoForm.format, height: videoForm.height, quality: videoForm.quality }] },
            data: [...media, ...text]
        }
        setLoading(true);
        console.log(genForm);
        const { data } = await axios.post<GenerateVideoResponse>(`${import.meta.env.VITE_SERVER_URL}/storyboard/generate`, genForm);
        setCheckURL(data.check_status_url);
        if (data.output.video) {
            setLinkToVideo(data.output.video[0].links?.url);
        }
    }

    const checkVideoStatus = async () => {
        console.log('video status check');
        if (!checkURL || !isLoading) return;
        const { data } = await axios.get<CheckStatusResponse>(`${import.meta.env.VITE_SERVER_URL}/status?link=${encodeURIComponent(checkURL)}`);
        console.log('video status:', data.status);
        if ((data.status !== 'ERROR' && data.status !== 'VIDEO_AVAILABLE') || isPlaying) {
            setTimeout(() => {
                checkVideoStatus();
            }, 5000);
        }
        if (data.status === 'VIDEO_AVAILABLE') {
            setLoading(false);
            setIsPlaying(true);
        }
    }

    const backClick = () => {
        setIsPlaying(false);
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
        {!isPlaying ?
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
                    <button className='genButton' onClick={generateVideo}>Generate</button>
                </div>

            </div> :
            <VideoPlayer videoURL={linkToVideo!} onBackClick={backClick} />
        }
    </>
}