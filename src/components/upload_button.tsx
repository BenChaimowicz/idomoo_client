import axios from 'axios';
import { ChangeEvent } from 'react';

export const UploadButton = (): JSX.Element => {

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
        <form action="/upload" encType='multipart/form-data'>
            <input type="file" onChange={uploadFile} name='image' />
        </form>
    </>)
}