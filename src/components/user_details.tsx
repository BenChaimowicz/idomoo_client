import { ChangeEvent, useState } from 'react';
import './user_details.css';

export type UserDetailsParams = { onChangeUser: (e: OnChangeUserDetailsEvent) => void };
export type OnChangeUserDetailsEvent = { name?: string, email?: string };

export const UserDetails = (props: UserDetailsParams): JSX.Element => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const nameHandle = (e: ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case 'firstNameInput':
                setFirstName(e.target.value);
                props.onChangeUser({ name: `${firstName} ${lastName}` });
                break;
            case 'lastNameInput':
                setLastName(e.target.value);
                props.onChangeUser({ name: `${firstName} ${lastName}` });
                break;
            case 'emailInput':
                setEmail(e.target.value);
                props.onChangeUser({ email });
                break;
        }
    }

    return <>
        <div className='infoContainer'>
            <div className='nameContainer'>
                <div className="nameField" >
                    <input type="text" name='firstNameInput' placeholder='First name' onChange={nameHandle} />
                </div>
                <div className="nameField">
                    <input type="text" name='lastNameInput' placeholder='Last name' onChange={nameHandle} />
                </div>
            </div>
            <div className='emailContainer'>
                <input type="text" name="emailInput" className='emailInput' placeholder='Email Address' onChange={nameHandle} />
            </div>
        </div>
    </>
}