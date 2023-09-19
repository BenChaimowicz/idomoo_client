import { useEffect, useState } from 'react';
import './main_form.css';
import { FileDetails } from './file_details';
import { OnChangeUserDetailsEvent, UserDetails } from './user_details';
import { VideoOptions, VideoOptionProps, VideoOptionsForm } from './video_options';
import { StoryBoardView } from './storyboard';
import axios from 'axios';

type GenerateVideoForm = { name: string, email: string, data: StoryboardElement[], format: string, quality: number, height: number };
export type GenerateVideoRequest = { storyboard_id: number, data: GenerateVideoDataElement[], output: OutputRoot };
export type StoryboardResponse = { storyboard_id: number, name: string, thumbnail_time: number, width: number, height: number, thumbnail: string, data: StoryboardElement[], last_modified: number, last_modified_string: string };
export type StoryboardElement = { key: string, val: string, description: string };
export type GenerateVideoDataElement = Omit<StoryboardElement, 'description'>;
export type VideoOutput = { format: string, quality?: number, height: number };
export type GIFOutput = {};
export type OutputRoot = { video?: VideoOutput[], gif?: GIFOutput[] };

export const MainForm = (): JSX.Element => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [mediaElements, setMediaElements] = useState<StoryboardElement[]>([]);
    const [textElements, setTextElements] = useState<StoryboardElement[]>([]);
    const [storyboard, setStoryboard] = useState<StoryboardResponse>();
    const [media, setMedia] = useState<StoryboardElement[]>([]);
    const [text, setText] = useState<StoryboardElement[]>([]);
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
    const changeStoryboard = (e: StoryboardElement[]) => {
        setText([...e]);
    }
    const changeMedia = (e: StoryboardElement[]) => {
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
        if (!videoForm || !videoForm.format || !videoForm.height || videoForm.quality) return;
        const genForm: GenerateVideoRequest = {
            storyboard_id: storyboard?.storyboard_id,
            output: { video: [{ format: videoForm.format, height: videoForm.height, quality: videoForm.quality }] },
            data: [...media, ...text]
        }
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/storyboard/generate`, genForm);
        console.log(response.data);
        setLoading(false);

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
                <button className='genButton' onClick={generateVideo}>Generate</button>
            </div>

        </div>
    </>
}