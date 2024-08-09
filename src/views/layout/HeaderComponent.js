import React from 'react'
import { NavLink } from 'react-router-dom' 
import isAuthenticated from '../../utils/auth';
import logout from '../../utils/Logout';

const HeaderComponent = () => {

    const authenticated = isAuthenticated();
    
    if(authenticated){
        return (
            <div>
                <header>
                    <nav className='navbar navbar-expand-md navbar-dark bg-dark'> 
                           
                        <ul className='navbar-nav'>
                            <li className='nav-item'>
                                <p  className='navbar-brand'>
                                    Technical Test - Ardella Eka K
                                </p> 
                            </li> 

                            <li className='nav-item'>
                                <button className='nav-link btn btn-link' onClick={logout}>
                                    Log Out
                                </button> 
                            </li> 

                        </ul>
                    </nav>
                </header>

            </div>
        )
    }else{
        return (
            <div>
                <header>
                    <nav className='navbar navbar-expand-md navbar-dark bg-dark'> 
                            <ul className='navbar-nav'>
                            <li className='nav-item'>
                                <p  className='navbar-brand'>
                                    Technical Test - Ardella Eka K
                                </p> 
                            </li> 
                            <li className='nav-item'>
                                <NavLink to="/register" className="nav-link">Register</NavLink>
                            </li> 
                            <li className='nav-item'>
                                <NavLink to="/login" className="nav-link">Login</NavLink>
                            </li> 

                        </ul>


                    </nav>
                </header>

            </div>
        )
    }


}

export default HeaderComponent