import axios from 'axios';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

export type UploadButtonProps = { onChangeImageHandler: (e: string) => void };

export const UploadButton = (props: UploadButtonProps): JSX.Element => {
    const [image, setImage] = useState<string>('');

    const hiddenInput = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        hiddenInput.current!.click();
    }

    const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const formData = new FormData(e.target.parentElement as HTMLFormElement);



        axios.post(`${import.meta.env.VITE_SERVER_URL}/upload`,
            formData,
            {
                headers: {
                    "Content-Type": 'multipart/form-data',
                }
            }).then(r => {
                console.log(`R:`, r.data);
                setImage(r.data);
            }).catch(e => {
                console.error(e)
                setImage('');
            });
    }

    useEffect(() => {
        props.onChangeImageHandler(image);
    }, [image]);


    return (<>
        <button onClick={handleClick}>Upload</button>
        <form encType='multipart/form-data'>
            <input type="file" onChange={uploadFile} name='image' style={{ display: 'none' }} ref={hiddenInput} />
        </form>
    </>)
}