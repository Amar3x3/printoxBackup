import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <>
    <nav>
        <ul>
            <div className='logo'>
                <img src='https://res.cloudinary.com/dn07sxmaf/image/upload/v1710425020/PrintOx/Group_1_wefwfd.png'></img>
            </div>
            
            <div className='display-flex-space-around'>
            
            <img src='https://res.cloudinary.com/dn07sxmaf/image/upload/v1710425288/PrintOx/fluent_home-20-filled_ndhwpg.png'></img>
            
            <img src='https://res.cloudinary.com/dn07sxmaf/image/upload/v1710425286/PrintOx/fluent_settings-16-filled_hewaro.png'></img>
            
            <img src='https://res.cloudinary.com/dn07sxmaf/image/upload/v1710425286/PrintOx/Vector_ax5kos.png'></img>
            
            </div>
        </ul>
    </nav>
    </>
  )
}
