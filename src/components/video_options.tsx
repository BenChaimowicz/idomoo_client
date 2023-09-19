import './video_options.css';
import { useEffect, useRef, useState } from "react";
import Select, { ActionMeta, SingleValue } from 'react-select';


export type VideoOptionProps = { onChangeVideoOptions: (e: VideoOptionsForm) => void };
export type SelectOption = { value: string | number, label: string };
export type VideoOptionsForm = { format: string, quality: number, resolution: number };


const formatOptions: SelectOption[] = [
    { value: 'mp4', label: 'MP4' },
    { value: 'hls', label: 'HLS' },
    { value: 'webm', label: 'WebM' },
    { value: 'gif', label: 'GIF' }
];
const qualityOptions: SelectOption[] = [
    { value: 29, label: 'Good' },
    { value: 26, label: 'Better' },
    { value: 21, label: 'Even Better' },
];
const resolutionOptions: SelectOption[] = [
    { value: 1080, label: '100% 1920x1080' },
    { value: 720, label: '66.67% 1280x720' },
    { value: 540, label: '50% 960x540' },
    { value: 360, label: '33.33% 640x360' },
    { value: 270, label: '25% 480x270' },
]

export const VideoOptions = (props: VideoOptionProps): JSX.Element => {
    const [videoForm, setVideoForm] = useState<VideoOptionsForm>({
        format: formatOptions[0].value as string,
        quality: qualityOptions[0].value as number,
        resolution: resolutionOptions[0].value as number
    });

    const onChange = (option: SingleValue<SelectOption>, meta: ActionMeta<SelectOption>) => {
        const name = meta.name as keyof VideoOptionsForm;
        setVideoForm(prev => ({ ...prev, [name]: option?.value }));
    };

    useEffect(() => {
        props.onChangeVideoOptions(videoForm);
    }, [videoForm])

    return <>
        <div className="videoOptionsContainer">
            <div className="selectContainerLeft">
                <label htmlFor="formatSelect">Format</label>
                <Select
                    name='format'
                    inputId='formatSelect'
                    options={formatOptions}
                    defaultValue={formatOptions[0]}
                    onChange={onChange}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 8,
                        colors: {
                            ...theme.colors,
                            primary: '#ffffff',
                            neutral0: '#1a1a1a',
                            neutral80: '#f9f9f9',
                            primary25: '#747bff',
                        }
                    })}
                />
            </div>
            <div className="selectContainer">
                <label htmlFor="resSelect">Resolution</label>
                <Select
                    name='resolution'
                    inputId='resSelect'
                    options={resolutionOptions}
                    defaultValue={resolutionOptions[0]}
                    onChange={onChange}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 8,
                        colors: {
                            ...theme.colors,
                            primary: '#ffffff',
                            neutral0: '#1a1a1a',
                            neutral80: '#f9f9f9',
                            primary25: '#747bff',
                        }
                    })} />
            </div>
            <div className="selectContainerRight">
                <label htmlFor="qualitySelect">Quality</label>
                <Select
                    name='quality'
                    inputId='qualitySelect'
                    options={qualityOptions}
                    defaultValue={qualityOptions[0]}
                    onChange={onChange}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 8,
                        colors: {
                            ...theme.colors,
                            primary: '#ffffff',
                            neutral0: '#1a1a1a',
                            neutral80: '#f9f9f9',
                            primary25: '#747bff',
                        }
                    })} />
            </div>
        </div>
    </>
}