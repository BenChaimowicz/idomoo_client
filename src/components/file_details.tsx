import './file_details.css';
import { UploadButton } from './upload_button';
import { ColorButton } from './color_button';
import { useState } from 'react';
import axios from 'axios';

export const FileDetails = (): JSX.Element => {

    const [image, setImage] = useState<string>('');
    const [color, setColor] = useState<string>('');

    const onImageChange = (e: string) => {
        if (color) setColor('');
        setImage(e);
    }

    const onColorChange = (e: string) => {
        if (image) setImage('');
        setColor(e);
    }

    let imageURL = `http://localhost:3001${image}`;
    const options = {
        method: 'GET',
        url: 'http://localhost:3001/uploads/1.jpg',
    };
    axios.request(options);

    return <>
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

    </>
}