import { useState } from 'react';
import './main_form.css';
import { FileDetails } from './file_details';
import { OnChangeUserDetailsEvent, UserDetails } from './user_details';

type GenerateVideoForm = { name: string, };

export const MainForm = (): JSX.Element => {

    const [videoForm, setVideoForm] = useState<GenerateVideoForm>({
        name: '',

    });

    const changeUserDetails = (e: OnChangeUserDetailsEvent) => {
        setVideoForm(prev => { return { ...prev, name: e } });
    };




    return <>
        <div className='mainContainer'>
            <div className='formRow' id="header">Enter the details below in order to generate your video</div>
            <div className='formRow' id="nameInfo">
                <UserDetails onChangeUser={changeUserDetails} />
            </div>
            <div className='formRow' id="vars">
                <FileDetails />
            </div>
            <div className='formRow' id="videoOpts"></div>
            <div className='formRow' id="footer"></div>

        </div>
    </>
}