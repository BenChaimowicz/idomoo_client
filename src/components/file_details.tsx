import './file_details.css';
import { UploadButton } from './upload_button';
import { ColorButton } from './color_button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { StoryboardElement } from './main_form';

export type FileDetailsProps = { onChangeMedia: (e: StoryboardElement[]) => void, elements: StoryboardElement[] };

export const FileDetails = (props: FileDetailsProps): JSX.Element => {

    const [image, setImage] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [mediaElements, setMediaElements] = useState<StoryboardElement[]>([]);

    const onImageChange = (e: string) => {
        if (color) setColor('');
        setImage(e);
        setMediaElements([{ ...mediaElements[0], val: image }]);

    }

    const onColorChange = (e: string) => {
        if (image) setImage('');
        setColor(e);
        setMediaElements([{ ...mediaElements[0], val: color }]);
    }

    let imageURL = `${import.meta.env.VITE_SERVERBASE}${image}`;

    const getImage = async () => {
        if (!image) return;
        const options = {
            method: 'GET',
            url: imageURL,
        };
        axios.request(options);
    }

    useEffect(() => {
        if (!image) return;
        getImage();
    }, [image]);
    useEffect(() => {
        props.onChangeMedia(mediaElements);
    }, [mediaElements]);

    return <>
        <div className='mediaElementContainer'>
            <label>Media1</label>
            <div className="divider"></div>
            <div className='third'>
                <UploadButton onChangeImageHandler={onImageChange} />
            </div>
            <div className='third'>
                <ColorButton onColorChangeHandler={onColorChange} />
            </div>
            <div className='third'>
                {image ? <img className='previewImg' src={imageURL} alt="" /> :
                    <div className='previewColor' style={{ backgroundColor: color }}></div>}
            </div>
        </div>

    </>
}