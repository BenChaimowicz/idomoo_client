import './file_details.css';
import { UploadButton } from './upload_button';
import { ColorButton } from './color_button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GenerateVideoDataElement, StoryboardElement } from './main_form';

export type FileDetailsProps = { onChangeMedia: (e: GenerateVideoDataElement[]) => void, elements: StoryboardElement[] };

export const FileDetails = (props: FileDetailsProps): JSX.Element => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [image, setImage] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [mediaElements, setMediaElements] = useState<StoryboardElement[]>([]);
    const [media, setMedia] = useState<GenerateVideoDataElement[]>([]);

    const onImageChange = (e: string, old: StoryboardElement, index: number) => {
        if (color) setColor('');
        setImage(e);
        const tmpMedia: GenerateVideoDataElement[] = [...mediaElements];
        tmpMedia[index] = { key: old.key, val: e };
        setMedia(tmpMedia);
    }

    const onColorChange = (e: string, old: StoryboardElement, index: number) => {
        if (image) setImage('');
        setColor(e);
        const tmpMedia: GenerateVideoDataElement[] = [...mediaElements];
        tmpMedia[index] = { key: old.key, val: e };
        setMedia(tmpMedia);
    }

    const getImage = async () => {
        if (!image) return;
        const options = {
            method: 'GET',
            url: image,
        };
        axios.request(options);
    }

    useEffect(() => {
        if (!props.elements || props.elements.length === 0) return;
        setMediaElements(props.elements);
        setLoading(false);
    }, [props.elements]);
    useEffect(() => {
        if (!image) return;
        getImage();
    }, [image]);
    useEffect(() => {
        props.onChangeMedia(media);
    }, [media]);

    return <>{
        isLoading ?
            <div className="loading">Loading...</div>
            : mediaElements.map((me, i) =>
                <div className='mediaContainer' key={i}>
                    <div className='mediaElementContainer'>
                        <label>Media1</label>
                        <div className="divider"></div>
                        <div className='third'>
                            <UploadButton onChangeImageHandler={(e) => onImageChange(e, me, i)} />
                        </div>
                        <div className='third'>
                            <ColorButton onColorChangeHandler={(e) => onColorChange(e, me, i)} />
                        </div>
                        <div className='third'>
                            {image ? <img className='previewImg' src={image} alt="" /> :
                                <div className='previewColor' style={{ backgroundColor: color }}></div>}
                        </div>
                    </div>
                </div>
            )
    }
    </>
}