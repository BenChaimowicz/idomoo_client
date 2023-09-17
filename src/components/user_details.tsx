import { ChangeEvent, useState } from 'react';
import './user_details.css';

export const UserDetails = (): JSX.Element => {

    const [firstName, setFirstName] = useState('');
    const [lasName, setLastName] = useState('');

    const nameHandle = (e: ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case 'firstNameInput':
                setFirstName(e.target.value);
                break;
            case 'lastNameInput':
                setLastName(e.target.value);
                break;
        }
    }

    return <>
        <div className="nameField" >
            <input type="text" name='firstNameInput' placeholder='First name' onChange={nameHandle} />
        </div>
        <div className="nameField">
            <input type="text" name='lastNameInput' placeholder='Last name' onChange={nameHandle} />
        </div>
    </>
}