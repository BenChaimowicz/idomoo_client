import './main_form.css';
import { UploadButton } from './upload_button';
import { UserDetails } from './user_details';
export const MainForm = (): JSX.Element => {


    return <>
        <div className='mainContainer'>
            <div className='formRow' id="header">Enter the details below in order to generate your video</div>
            <div className='formRow' id="nameInfo">
                <UserDetails />
            </div>
            <div className='formRow' id="email"></div>
            <div className='formRow' id="vars">
                <UploadButton />
            </div>
            <div className='formRow' id="videoOpts"></div>
            <div className='formRow' id="footer"></div>

        </div>
    </>
}