import axios from 'axios';
import { ChangeEvent, MouseEvent, useRef } from 'react';

export const UploadButton = (): JSX.Element => {
    const hiddenInput = useRef<HTMLInputElement>(null);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        hiddenInput.current!.click();
    }

    const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const formData = new FormData(e.target.parentElement as HTMLFormElement);



        const response = axios.post(`${import.meta.env.VITE_SERVER_URL}/upload`,
            formData,
            {
                headers: {
                    "Content-Type": 'multipart/form-data',
                }
            }).then(r => console.log(`R:`, r.data)).catch(e => console.error(e));

        console.log(response);

    }



    return (<>
        <button onClick={handleClick}>Upload</button>
        <form encType='multipart/form-data'>
            <input type="file" onChange={uploadFile} name='image' style={{ display: 'none' }} ref={hiddenInput} />
        </form>
    </>)
}