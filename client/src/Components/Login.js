import React from 'react';
import { NavLink } from 'react-router-dom';

function Login() {
    return (
        <div className="landing">
            <div className="left">
            <div className="signUp">
                <header>Sign Up</header><br></br>
                    <input className="email" type="email" class="form-control" id="exampleFormControlInput1" placeholder="Email address" />
                    <br></br>
                    <br></br>
                    <input className="user" type="text" class="form-control" id="exampleFormControlInput1" placeholder="Username" />
                    <br></br>
                    <br></br>
                    <input className="pwd" type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" placeholder="Password" />
                    <br></br>
                    <br></br>
                    <button>
                        <nav>
                            <NavLink to="/Profile">Register</NavLink>
                        </nav>
                    </button>
                </div>
            </div>
            <div className="right">
            <div className="login">
                <header>Login</header><br></br>
                    <input className="user" type="text" class="form-control" id="exampleFormControlInput1" placeholder="Username" />
                    <br></br>
                    <br></br>
                    <input className="pwd" type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" placeholder="Password" />
                    <br></br>
                    <br></br>
                    <button>
                        <nav>
                            <NavLink to="/Home">Login</NavLink>
                        </nav>
                    </button>
                    <div/>
                    <button>
                        <nav>
                            <NavLink to="/TestAPI">TestAPI</NavLink>
                        </nav>
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Login;