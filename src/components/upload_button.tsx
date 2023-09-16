import axios from 'axios';
import { ChangeEvent } from 'react';

export const UploadButton = (): JSX.Element => {

    const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        console.log(e.target.files);

        const response = axios.post(`${import.meta.env.VITE_SERVER_URL}/upload`,
            e.target.files[0],
            {
                headers: {
                    "Content-Type": e.target.files[0].type,
                    'Content-Encoding': 'multipart/form-data'
                }
            }).then(r => console.log(`R:`, r.data)).catch(e => console.error(e));
    }

    return (<>
        <form action="/upload" encType='multipart/form-data'>
            <input type="file" onChange={uploadFile} name='image' />
        </form>
    </>)
}