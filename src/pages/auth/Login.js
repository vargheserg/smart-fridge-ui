
import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Auth.css";
import Header from "../../components/header/Header";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth as firebaseAuth, getUserFromDB, logInWithEmailAndPassword } from "../../firebase/firebase";
import { UserContext } from "../../UserContext";

const Login = () => {
  //set the state default value
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(firebaseAuth);
  const [userAcc, setUser] = useContext(UserContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
  }, [user, loading]);

  const onLogin = async () => {
    const response = await logInWithEmailAndPassword(email, password);
    sessionStorage.setItem("Auth Token", response._tokenResponse.refreshToken);
    sessionStorage.setItem("uid", response.user.uid);

    // Fetch user from firestore
    const userinfo = await getUserFromDB(response.user.uid);
    setUser(userinfo);
    navigate("/fridges");
  }

  const onKeyPress = async (e) => {
    if(e.key === 'Enter') {
      await onLogin();
    }
  }

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
                    IntelliFridge Login
                  </div>
                </div>
                <div className="card-body p-lg-5">
                  <h3 className="mb-4">Welcome back</h3>
                  <p className="text-muted text-sm mb-5">
                    Log in to access your fridge information
                  </p>
                  <form id="loginForm" action="index.html">
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="floatingInput"
                        name="username"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={onKeyPress}
                        placeholder="name@example.com"
                        required
                      />
                      <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="floatingPassword"
                        name="password"
                        type="password"
                        onKeyDown={onKeyPress}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                      />
                      <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <button  onClick={onLogin} className="btn btn-primary" type="button">
                      Log In
                    </button>
                  </form>
                </div>
                <div className="card-footer px-lg-5 py-lg-4">
                  <div className="text-sm text-muted">
                    Don't have an account?{" "}
                    <Link to="/signup">Register</Link>
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
export default Login;
