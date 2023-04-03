import React, { useState, useEffect, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Auth.css";
import Header from "../../components/header/Header";
import { Link, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword, getUserFromDB } from "../../firebase/firebase";
import { UserContext } from "../../UserContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  //const [user, loading, error] = useAuthState(auth);
  const [userAcc, setUser] = useContext(UserContext);
  let navigate = useNavigate();

  const register = async () => {
    if (!name) alert("Please enter name");
    const response = await registerWithEmailAndPassword(name, email, password);
    sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
    sessionStorage.setItem("uid", response.user.uid);
    const userinfo = await getUserFromDB(response.user.uid);
    setUser(userinfo);
    navigate("/fridges");
  };

  useEffect(() => {
    const authToken = sessionStorage.getItem('Auth Token');

    if (authToken) {
      // User is logged in, user needs to logout to register
      navigate("/fridges");
    }
  }, []);

  return (
    <div className="Auth">
      <Header/>
      <div className="page-holder align-items-center py-4 bg-gray-100 vh-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="show col-lg-6 px-lg-4">
              <div className="card">
                <div className="card-header px-lg-5">
                  <div className="card-heading text-primary">
                    IntelliFridge Sign Up
                  </div>
                </div>
                <div className="card-body p-lg-5">
                  <h3 className="mb-4">Get started with IntelliFridge</h3>
                  <p className="text-muted text-sm mb-5">
                    Create an account and register an IntelliFridge Add on
                  </p>
                  <form action="index.html">
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="name"
                        name="name"
                        type="text"
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="John SMith"
                        required
                      />
                      <label htmlFor="username">Name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="floatingInput"
                        name="email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                      />
                      <label htmlFor="floatingInput">Email Address</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="floatingPassword"
                        name="password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                      />
                      <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="form-group">
                      <button onClick={register} className="btn btn-primary" id="register" type="button" name="registerSubmit">
                        Register
                      </button>
                    </div>
                  </form>
                </div>
                <div className="card-footer px-lg-5 py-lg-4">
                  <div className="text-sm text-muted">
                    Already have an account?{" "}
                    <Link to="/login">Log In</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-5 ms-xl-auto px-lg-4 text-center text-primary"><img className="img-fluid mb-4" width="300" src="https://png.pngtree.com/png-vector/20190809/ourlarge/pngtree-fridge-refrigerator-cooling-freezer-blue-icon-on-abstract-clo-png-image_1652460.jpg" alt=""/>
              <h1 className="mb-4">Access your fridge <br className="d-none d-lg-inline" />anywhere</h1>
              <p className="lead text-muted">The IntelliFridge add-on makes your fridge accessible wherever and whenever</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Signup;
