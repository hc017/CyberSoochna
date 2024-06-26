import React, { useEffect, useState } from "react";
import "./UserLogin.css";
import { Link } from "react-router-dom";
import logo from "./arrow.svg";
import "@fortawesome/fontawesome-free/css/all.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import "react-phone-input-2/lib/style.css";

import { auth } from "../../FirebaseCongfig/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, get, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Rmobile, setRMobile] = useState("");
  const [Rotp, setROtp] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const db = getDatabase();

  const handleLogin = () => {

    if (!email || !password || !Rmobile || !Rotp) {
      alert("All fields are required!");
      return;
    }

    if (Rmobile.length !== 13 || isNaN(Rmobile)) {
      alert("Mobile number should be 10 digits!");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        if (email.endsWith("@csadmin.com")) {
          // If it's an admin email, redirect to the admin dashboard
          alert("Logged in as admin!");
          navigate("/adminDashboard");
        } else {
          // Otherwise, proceed with user-specific logic
          const userDetailsRef = ref(db, `users/${user.uid}/userdetails`);
          get(userDetailsRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                alert("Logged in successfully!");
                navigate("/reportincident", {
                  state: { uids: user.uid },
                });
              } else {
                alert("Logged in successfully!");
                navigate("/userdetails", {
                  state: { uids: user.uid },
                });
              }
            })
            .catch((error) => {
              console.error("Error checking userdetails data:", error);
              alert("Error checking userdetails data");
            });
        }
      })
      .catch((error) => {
        console.error("Error signing in:", error.message);
        alert("Error in signing in");
      });
  };

  const handleCancel = () => {
    // Clear the form fields by resetting the state variables
    setEmail("");
    setPassword("");
  };

  const sendotp = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const confirm = await signInWithPhoneNumber(auth, Rmobile, recaptcha);
      setUser(confirm);
      console.log("OTP sent");
    } catch (err) {
      console.error(err);
    }
  };
  
  const verifyOtp = async () => {
    try {
      const otpdata = await user.confirm(Rotp);
      console.log(otpdata)
      alert("Correct OTP entered");
    } catch (err) {
      alert("OTP not matched");
      console.error(err);
    }
  };

  return (
    <div className="register-page">
      <div className="inner-register">
        <div className="reg-where-to-location">
          <Link className="visit-home" to="/">
            Home
          </Link>
          <img src={logo} alt="arrow" className="arrow-img" />
          <p className="reg-text">Login to complaint</p>
        </div>
        <div className="register-rectangle">
          <div className="left-register">
            <p class="register-to-Complaint"> Login to Complaint </p>
            <div class="register-horizontal-line"> </div>

            <div className="register-form-align">
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent default form submission behavior
                  // Call handleRegister when the form is submitted
                }}
              >
                <div className="R_Vi_container">
                  <div className="ldiv">
                    <label className="R_VI_text">Login ID:</label>
                  </div>
                  <div className="VIdiv">
                    <input
                      type="email"
                      placeholder="Enter your email ID"
                      className="R_vi_input"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="R_Vi_container">
                  <div className="ldiv">
                    <label className="R_VI_text">Password:</label>
                  </div>
                  <div className="VIdiv">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="R_vi_input"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
          
                <div className="R_Vi_container">
                  <div className="ldiv">
                    <label className="R_VI_text">Mobile No:</label>
                  </div>
                  <div className="VIdiv1">
                    <PhoneInput
                      country={'in'}
                      className="urmobile"
                      value={Rmobile}
                      onChange={(Rmobile) => setRMobile("+" + Rmobile)}
                    />
                  </div>
                </div>

                <div className="otp_container">
                  <div className="ldiv">
                    <label className="R_VI_text" id="VIT_otp">
                      OTP:
                    </label>
                  </div>

                  <div className="VIdiv">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      className="otp_vi_input"
                      id="VIT_input"
                      value={Rotp}
                      onChange={(e) => setROtp(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="otp_btn">
                  <button type="button" className="R_BTN" onClick={sendotp}>
                    Get OTP
                  </button>
                  <button type="button" className="R_BTN" onClick={verifyOtp}>
                    Verify OTP
                  </button>
                </div>
                <div id="recaptcha"></div>

                <div className="login-existinguser">
                  <Link
                    to="/register"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    New User? Click here to Register
                  </Link>
                </div>
                <div>
                  <Link
                    type="button"
                    className="confirm-register-button"
                    onClick={handleLogin}
                  >
                    LOGIN
                  </Link>
                  <button
                    type="button"
                    className="reg-cancel-button"
                    onClick={handleCancel}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="reg-middle-line">
            <div className="register-verticle-line"> </div>
          </div>

          <div className="right-instructions">
            <p className="register-CHECK-LIST-FOR-COMPLAINANT">
              {" "}
              CHECK LIST FOR COMPLAINT{" "}
            </p>
            <p className="register-infotext">
              {" "}
              Please keep this information ready before filing your complaint:{" "}
            </p>
            <div className="register-mandatory-info">
              <p className="reg-text-style-1">Mandatory Information</p>
              <ol className="info-ol">
                <li>Incident Date and Time.</li>
                <li>
                  Incident details (minimum 200 characters) without any special
                  characters (#$@^*`"~|!).
                </li>
                <li>
                  Soft copy of any national Id (Voter Id, Driving license,
                  Passport, PAN Card, Aadhar Card) of complaint in .jpeg, .jpg,
                  .png format (file size should not more than 5 MB).
                </li>
                <li>
                  In case of financial fraud, please keep following information
                  ready:
                  <ol type="i">
                    <li>Name of the Bank/ Wallet/Merchant</li>
                    <li>12-digit Transaction id/UTR No.</li>
                    <li>Date of transaction</li>
                    <li>Fraud amount</li>
                  </ol>
                </li>
                <li>
                  Soft copy of all the relevant evidences related to the cyber
                  crime (not more than 10 MB each).
                </li>
              </ol>
              <p className="reg-Optional-Desirable-Information">
                Optional/Desirable Information:
              </p>
              <ol className="reg-info-ol">
                <li>
                  Suspected website URLs/ Social Media handles (wherever
                  applicable).
                </li>
                <li>
                  Suspect Details (if available):
                  <ol type="i">
                    <li>Mobile No.</li>
                    <li>Email id</li>
                    <li>Bank Account No</li>
                    <li>Address</li>
                    <li>
                      Soft copy of photograph of suspect in .jpeg, .jpg, .png
                      format (not more than 5 MB).
                    </li>
                    <li>
                      Any other document through which suspect can be
                      identified.
                    </li>
                  </ol>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default UserLogin;
