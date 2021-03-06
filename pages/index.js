import React, { useEffect, useState } from "react";
import {
  Link,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";

import { useForm } from "react-hook-form";

// import {useH} from 'next/router'
import { useRouter } from "next/router";
import classnames from "classnames";
// import TTT from "../svg/esss.svg";

import ScrollAnimation from "react-animate-on-scroll";

import { Carousel } from "react-responsive-carousel";

// import Logo from "/assets/imgs/pic-19.png";
import ResetPassword from "../components/resetPassword";
import Registration from "../components/register";
import { AuthService } from "../services/auth/auth.http";
import { setCurrentUser, setCurrentStore } from "../store/auth/authActions";
import { useDispatch } from "react-redux";
import Footer from "../components/footer";
import axios from "axios";

const home = () => {
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearError,
    getValues,
  } = useForm();
  const dispatch = useDispatch();

  const [registerSuccessModal, setRegisterSuccessModal] = React.useState(false);

  const [burgerMenu, setBurgerMenu] = useState(false);
  const [headerScroll, setHeaderScroll] = useState(0);
  const [roadPosition, setRoadPosition] = useState(1);
  const [isMobil, setIsMobil] = useState(false);
  const [regAuthModal, setRegAuthModal] = React.useState(null);
  const [serverError, setServerError] = React.useState(null);
  const [referralValue, setReferralValue] = React.useState(null);
  const [validation, setValidation] = React.useState(null);
  const [codeError, setCodeError] = React.useState(null);
  const [code, setCode] = React.useState(null);

  // const [regAuthModal, setRegAuthModal] = React.useState(null);

  const history = useRouter();

  useEffect(() => {
    if (history.asPath.split("=")[0] === "/?referral") {
      setRegAuthModal("register");
      setReferralValue(history.asPath.split("=")[1]);
    }
    if (history.asPath.split("=")[0] === "/?resetPassword") {
      setRegAuthModal("resetPassword");
    }

    // debugger;
    if (history.asPath.split("=")[0] === "/?validation") {
      setValidation(true);
    } else {
      setValidation(false);
    }
    // debugger;
    // console.log(history);

    if (localStorage.getItem("token")) {
      AuthService.getUser()
        .then((res) => {
          window.hasCheckedAuth = true;
          dispatch(
            setCurrentUser({
              user: res.data.user,
              token: localStorage.getItem("token"),
            })
          );
          history.push("/user");
        })
        .catch((err) => {});
    }
    window.addEventListener("scroll", (e) => {
      // console.log(window.scrollY);
      if (window.scrollY > 0) {
        setHeaderScroll(true);
      } else {
        setHeaderScroll(false);
      }
    });
    // console.log(window.innerWidth, "innerwidht111");

    window.addEventListener("resize", (e) => {
      if (window.innerWidth < 992) {
        setIsMobil(true);
      } else {
        setIsMobil(false);
      }
    });
    if (window.innerWidth < 992) {
      setIsMobil(true);
    }
  }, [history.asPath]);

  const getRoadYear = () => {
    if (!isMobil) {
      if (roadPosition === 1) return 2020;
      if (roadPosition === 0) return 2017;
      return 2024;
    } else {
      if (roadPosition === 1) return 2020;
      if (roadPosition === 0) return 2019;
      if (roadPosition === -1) return 2018;
      if (roadPosition === -2) return 2017;
      if (roadPosition === 2) return 2021;
      if (roadPosition === 3) return 2022;
      if (roadPosition === 4) return 2023;
      if (roadPosition === 5) return 2024;
      return 2024;
    }
  };

  const onSubmitLogin = (data) => {
    AuthService.login(data)
      .then((res) => {
        if (res.data.token) {
          // localStorage.setItem("token", res.data.token);
          // console.log(res.data, "rrress")
          // setToken(res.data.token);
          if (res.data.fa_status == 1) {
            // window.location.href = "http://crowd-growing.com/2fa";
          } else {
            axios
              .post(
                "https://api.crowd-growing.com/api/v1/private/user/me",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${res.data.token}`,
                  },
                }
              )
              .then((res2) => {
                if (true) {
                  // if (res2.data.user.security.emailVerified) {
                  // if (true) {
                  dispatch(
                    setCurrentUser({
                      user: res.data.user,
                      token: res.data.token,
                    })
                  );
                  // history.push("/user");

                  // window.location.href = "http://crowdapp13.herokuapp.com/user";
                  history.push("/user");
                } else {
                  history.push("/?validation=true");
                  localStorage.setItem("preToken", res.data.token);
                }
                setRegAuthModal(null);
              });

            // dispatch(
            //   setCurrentUser({
            //     user: res.data.user,
            //     token: res.data.token,
            //   })
            // );

            // window.location.href = "http://crowd-growing.com/user/dashboard";
            // window.location.href = 'http://crowd-growing.conm/user/dashboard';
          }

          // setRegAuthModal(null);
        } else {
          setServerError("incorrect user or password");
        }
      })
      .catch((err) => {
        // debugger;
        // setServerError("incorrect user or password");
        if (err.response?.data?.errors?.MFA_SERVICE) {
          history.push({
            pathname: "/2fa",
            query: { password: data.password, username: data.username },
          });
        }
        if (err.response && err.response.data) {
          setServerError("incorrect user or password");

          // setServerError(err.response.data && err.response.data.message);
        } else {
          setServerError("Server Error Try Again Later");
        }
      });
    // setLoadaing(true);
    // login({ email: data.userName, password: data.password })
    //   .then((res) => {
    //     setLoadaing(false);
    //     dispatch(setCurrentUser(res.data.success));
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setServerError("wrong user or password");
    //     setLoadaing(false);
    //   });
  };

  const onInputChange = () => {
    setServerError(null);
  };
  return (
    <>
      <div className={classnames("header", { headerScroll })}>
        <div className="container">
          <div className="headerWrapper">
            <div className="logo">
              <img
                height="40"
                src="/assets/svges/crowd_growing_logowhite.svg"
              />
            </div>
            <div
              onClick={() => setBurgerMenu(!burgerMenu)}
              className="d-block d-lg-none burger pr-3 "
            >
              <svg
                width="25"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="bars"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="svg-inline--fa fa-bars fa-w-14 fa-2x"
              >
                <path
                  fill="currentColor"
                  d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
                  class=""
                ></path>
              </svg>
            </div>
            <div
              className={
                !burgerMenu
                  ? "menu  d-lg-block"
                  : "menu openBurgerMenu d-lg-block"
              }
            >
              <ul className="list-unstyled list-inline">
                {history.pathname === "/" ||
                history.pathname.includes("/api/password/find/") ||
                history.pathname === "/mlm-landing" ? (
                  <React.Fragment>
                    <li>
                      <Link
                        activeClass="active"
                        to="aboutUs"
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={() => setBurgerMenu(false)}
                        // onSetActive={this.handleSetActive}
                      >
                        About Us
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        activeClass="active"
                        to="OurGoals"
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={() => setBurgerMenu(false)}
                        // onSetActive={this.handleSetActive}
                      >
                        Market
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        activeClass="active"
                        to="BUSINESS_MODEL"
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={() => setBurgerMenu(false)}
                        // onSetActive={this.handleSetActive}
                      >
                        Business Model
                      </Link>
                    </li>

                    <li>
                      <Link
                        activeClass="active"
                        to="lifCircle"
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={() => setBurgerMenu(false)}
                        // onSetActive={this.handleSetActive}
                      >
                        Strategy
                      </Link>
                    </li>

                    {/* <li>
                     
                      <Link
                        activeClass="active"
                        to="Products"
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={() => setBurgerMenu(false)}
                        // onSetActive={this.handleSetActive}
                      >
                        Products
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        activeClass="active"
                        to="OurCEO"
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={() => setBurgerMenu(false)}
                      >
                        Team
                      </Link>
                    </li>
                    <li>
                      <Link
                        activeClass="active"
                        to="profits"
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={() => setBurgerMenu(false)}
                        // onSetActive={this.handleSetActive}
                      >
                        {/* How to make Profits */}
                        Locations
                      </Link>
                    </li>

                    {/* <li>
                      <Link
                        activeClass="active"
                        to="RoadMap"
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={() => setBurgerMenu(false)}
                        // onSetActive={this.handleSetActive}
                      >
                        Roadmap
                      </Link>
                    </li> */}
                  </React.Fragment>
                ) : (
                  <ul class="list-unstyled list-inline">
                    <li>
                      <a href="/">About Us </a>
                    </li>
                    {/* <li>
                      <a href="/">Goals and Vision</a>
                    </li> */}
                    <li>
                      <a href="/">Business Model</a>
                    </li>
                    <li>
                      <a href="/">Life Cycle </a>
                    </li>
                    <li>
                      <a href="/">
                        Locations
                        {/* How to make Profits */}
                      </a>
                    </li>
                    {/* <li>
                      <a href="/">Products</a>
                    </li> */}
                    <li>
                      <a href="/"> Our Team</a>
                    </li>
                    <li>
                      <a href="/">Roadmap</a>
                    </li>
                  </ul>
                )}
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      setRegAuthModal("register");
                    }}
                    className="navBtn hoverScale"
                    href=""
                  >
                    Get Started
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="home">
        <div className="socialFixed">
          <div className="col-md-4 mt-4 mt-md-0   col-6 text-center d-flex align-items-center justify-content-center">
            <a
              className="px-2 d-inline-bock"
              href="https://www.facebook.com/groups/340100750743245"
              target="_blank"
            >
              <svg
                width="23"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="facebook"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa fa-facebook fa-w-16 fa-2x"
              >
                <path
                  fill="#6b6b6b"
                  d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
                  class=""
                ></path>
              </svg>
            </a>

            {/* <a
                className="px-2 d-inline-bock "
                href="https://t.me/crowdgrowing"
                target="_blank"
              >
                <img width="23" src="/assets/svges/inst.svg" />
              </a> */}
            <a
              className="px-2 d-inline-bock socialHover telgHover"
              href="https://t.me/crowdgrowing"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="telegram"
                width="24"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
                class="svg-inline--fa fa-telegram fa-w-16 fa-2x"
              >
                <path
                  fill="currentColor"
                  d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"
                  class=""
                ></path>
              </svg>
              {/* <img width="23" src="/assets/svges/twt.svg" />
              <img className="hover" width="23" src="/assets/svges/twtC.svg" /> */}
            </a>
            <a
              className="px-2 d-inline-bock socialHover"
              href="https://www.youtube.com/channel/UCFXf8dvgTlnrfE23eTblBkQ?"
              target="_blank"
            >
              <img width="23" src="/assets/svges/yout.svg" />
              <img className="hover" width="23" src="/assets/svges/youtC.svg" />
            </a>
          </div>
        </div>
        {validation && (
          <div className="rt-container">
            <div className="col-rt-12">
              <div className="Scriptcontent">
                <div id="card" className="animated fadeIn">
                  <div id="upper-side">
                    <h3 id="status">Email verification</h3>
                  </div>
                  <div id="lower-side">
                    {/* {registerSuccessModal === "resetPass" ? (
                      <p id="message">
                        password reset link send on you email address
                      </p>
                    ) : registerSuccessModal === "changePassword" ? (
                      <p>Password changed successfully </p>
                    ) : (
                      ""
                    )} */}

                    <div className="form-group is-invalid">
                      <label style={{ color: " #000" }}>
                        Enter the verification code sent to your email
                      </label>
                      <input
                        type="text"
                        name="verification-code"
                        id="username"
                        tabindex="1"
                        placeholder="verification code "
                        className={classnames("form-control", {
                          "is-invalid": codeError,
                        })}
                        onChange={(e) => {
                          setCode(e.target.value);
                          setCodeError(null);
                        }}
                      />
                      <div className="invalid-feedback">{codeError}</div>
                    </div>
                    <a
                      href="#"
                      onClick={() => {
                        // setRegisterSuccessModFal(false);
                        // setRegAuthModal("login");
                        if (!code) {
                          setCodeError("Enter verification code");
                        } else {
                          // if (code == "666666") {
                          // dispatch(
                          //   setCurrentUser({
                          //     user: {},
                          //     token: localStorage.getItem("preToken"),
                          //   })
                          // );
                          // history.push("/user");
                          // return;
                          // }
                          AuthService.verifyEmail({
                            code: code,
                          })
                            .then((res) => {
                              if (res.data.verified) {
                                dispatch(
                                  setCurrentUser({
                                    user: {},
                                    token: localStorage.getItem("preToken"),
                                  })
                                );
                                localStorage.removeItem("preToken");

                                history.push("/user?isFirst=true");
                              } else {
                                setCodeError("wrong verification code");
                              }
                            })
                            .catch((err) => {
                              setCodeError("wrong verification code");
                            });
                          // "code": "string"
                        }
                      }}
                      className="mr-3"
                      id="contBtn"
                    >
                      send
                    </a>
                    <a
                      href="#"
                      onClick={() => {
                        // setRegisterSuccessModal(false);
                        // setRegAuthModal("login");
                        history.push("/");
                      }}
                      id="contBtn"
                    >
                      close
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {regAuthModal && (
          <div
            onClick={() => {
              setRegAuthModal(false);
              history.push("/");
            }}
            className="container registerContainer"
          >
            <div onClick={(e) => e.stopPropagation()} className="row">
              <div className="col-md-12 col-md-offset-3">
                <div className="panel panel-login">
                  <div className="panel-heading">
                    <div className="row">
                      <div className="col-6">
                        <a
                          onClick={() => {
                            setRegAuthModal("login");
                          }}
                          href="#"
                          className={regAuthModal === "login" ? "active" : ""}
                          id="login-form-link"
                        >
                          Login
                        </a>
                      </div>
                      <div className="col-6">
                        <a
                          onClick={() => {
                            setRegAuthModal("register");
                          }}
                          href="#"
                          className={
                            regAuthModal === "register" ? "active" : ""
                          }
                          id="register-form-link"
                        >
                          Register
                        </a>
                      </div>
                    </div>
                    <hr />
                  </div>
                  <div className="panel-body">
                    {/* <div className="LoginHeader">
                    <img src={Logo} />
                    <h5>Crowd Growing </h5>
                  </div> */}

                    <div className="row">
                      <div className="col-lg-12">
                        {regAuthModal === "login" ? (
                          <form
                            onSubmit={handleSubmit(onSubmitLogin)}
                            id="login-form"
                            action="https://phpoll.com/login/process"
                            method="post"
                            role="form"
                          >
                            {serverError && (
                              <div
                                className="text-center"
                                style={{ color: "red" }}
                              >
                                {serverError}
                              </div>
                            )}

                            <div className="form-group is-invalid">
                              <label>Email</label>
                              <input
                                type="text"
                                name="username"
                                id="username"
                                tabindex="1"
                                placeholder="username"
                                className={classnames("form-control", {
                                  "is-invalid": errors.username,
                                })}
                                ref={register({
                                  required: true,
                                })}
                                onChange={onInputChange}
                              />
                              <div className="invalid-feedback">
                                username is or email is required
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Password</label>

                              <input
                                type="password"
                                name="password"
                                id="password"
                                tabindex="2"
                                className={classnames("form-control", {
                                  "is-invalid": errors.password,
                                })}
                                placeholder="Password"
                                ref={register({
                                  required: true,
                                })}
                                onChange={onInputChange}
                              />
                              <div className="invalid-feedback">
                                password is required
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="text-center text-right">
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        history.push("/?resetPassword");

                                        setRegAuthModal("resetPassword");
                                      }}
                                      tabindex="5"
                                      className="forgot-password d-block text-right mr-1"
                                    >
                                      Forgot Password?
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="row">
                                <div className="col-sm-12 col-sm-offset-3">
                                  <button className="w-100 mt-4 form-control btn btn-login">
                                    {" "}
                                    Log In
                                  </button>
                                  {/* <input
                                type="submit"
                                name="login-submit"
                                id="login-submit"
                                tabindex="4"
                                className="form-control btn btn-login"
                                value="Log InLog In"
                              /> */}
                                </div>
                              </div>
                            </div>
                          </form>
                        ) : regAuthModal === "resetPassword" ? (
                          <ResetPassword
                            setRegisterSuccessModal={(d) =>
                              setRegisterSuccessModal(d)
                            }
                            setRegAuthModal={(d) => setRegAuthModal(d)}
                            setRegisterSuccessModal={(d) =>
                              setRegisterSuccessModal(d)
                            }
                          />
                        ) : regAuthModal === "changePassword" ? (
                          <ChangePassword token={resetToken} />
                        ) : (
                          <Registration
                            defaultValue={referralValue}
                            regAuthModal={regAuthModal}
                            setRegAuthModal={(d) => setRegAuthModal(d)}
                            setRegisterSuccessModal={(d) =>
                              setRegisterSuccessModal(d)
                            }
                          />
                        )}
                      </div>
                      <a
                        href="https://t.me/crowdgrowing"
                        target="_blank"
                        className="btn-floating mx-auto  mt-4 btn  telegramLink btn-tw mx-1 waves-effect waves-light"
                      >
                        <i class="fab fa-telegram" /> Join channel
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}{" "}
        <div className="section1">
          {/* <video loop muted autoPlay className=" d-lg-block" id="myVideo">
             <source src={VideoSrc} type="video/mp4" /> 
            Your browser does not support HTML5 video.
          </video> */}
          <div className="container">
            <ScrollAnimation
              animateOnce={true}
              duration={1}
              animateIn="animate__fadeIn"
            >
              <div className="content text-center">
                <div className="img">
                  {/* <ScrollAnimation animateOnce={true} duration={3}  animateIn="animate__rubberBand"> */}
                  <img src="/assets/svges/crowd_growing_logowhite.svg" />
                  {/* </ScrollAnimation> */}
                </div>

                {/* <ScrollAnimation animateOnce={true} animateIn="animate__backInLeft"> */}
                {/* <h1 className="text-center mb-4">CROWD GROWING</h1> */}
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setRegAuthModal("register");
                  }}
                  className="navBtnInMain d-inline-block hoverScale"
                  href=""
                >
                  Get Started
                </a>
                {/* </ScrollAnimation> */}

                {/* <ScrollAnimation
                animateOnce={true}
                animateIn="animate__backInRight"
              > */}
                <div />
                {/* </ScrollAnimation> */}
              </div>
            </ScrollAnimation>
          </div>
        </div>
        <Element name="aboutUs" className="aboutUs">
          <div className="container">
            <ScrollAnimation animateOnce={true} animateIn="animate__fadeInUp">
              <div className="left">
                <h2>About us & Vision</h2>
                <p>
                  Crowd Growing is a cannabis ecosystem based on years of
                  research, development and experience. Together with experts in
                  this field and the support of our cooperation partners, we
                  have created a unique cultivation concept - our so-called
                  Growing Street. This concept has been tested and perfected
                  over the past 2 years and is now ready to be offered in its
                  current form to the global market. To sum up our goals and
                  vision: (ICONS)
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animateOnce={true} animateIn="animate__zoomIn">
              <div className="row mt-5 pt-5">
                <div className="col-12 col-md-4">
                  <img
                    style={{
                      height: "133px",
                      margin: "auto",
                      display: "inherit",
                    }}
                    src="/assets/svges/icons3-01.svg"
                  />

                  <div className="number">01</div>
                  <div className="about-img">
                    <p className="mt-3">
                      Positively impact thousands of people’s health by
                      developing the highest quality of cannabis products and
                      boost the global distribution.
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  {" "}
                  <img
                    style={{
                      height: "133px",
                      margin: "auto",
                      display: "inherit",
                    }}
                    src="/assets/svges/icons3-02.svg"
                  />
                  <div className="number">02</div>
                  <div className="about-img">
                    <p className="mt-3">
                      Give people an opportunity to easily participate in the
                      emerging market of cannabis through our business model.
                    </p>
                  </div>
                </div>{" "}
                <div className="col-12 col-md-4">
                  {" "}
                  <img
                    style={{
                      height: "133px",
                      margin: "auto",
                      display: "inherit",
                    }}
                    src="/assets/svges/icons3.svg"
                  />
                  <div className="number">03</div>
                  <div className="about-img">
                    <p className="mt-3">
                      With a sustainable as well as profitable business we aim
                      to become a global market leader in the cannabis industry.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </Element>
        <Element name="OurGoals" className="Market">
          <div className="container">
            <div className="content">
              <ScrollAnimation animateOnce={true} animateIn="animate__fadeInUp">
                <div className="text-box">
                  <h2>Market</h2>
                  <p>
                    The cannabis market is evolving rapidly, and after years of
                    prohibition, it is regaining increasing social acceptance.
                    <br />
                    <br />
                    As so often in the past, the US continent has been setting
                    the trend, whereby Uruguay was the first country to fully
                    legalize cannabis.
                    <br />
                    <br />
                    Following the legalization in California and Canada, the
                    wave also started to spread to Europe. Here Luxembourg was
                    the first European country to announce its plans to legalize
                    cannabis for recreational use. Investors and experts believe
                    a domino effect could follow as previously seen in North
                    America and Asia.
                  </p>
                  <p>
                    Therefore we would summarize our core values on which we
                    develop the business as the following:
                  </p>
                </div>
              </ScrollAnimation>
              <div className="d-flex flex-column">
                <div style={{ maxWidth: "600px" }} className="m-auto">
                  <ScrollAnimation
                    animateOnce={true}
                    animateIn="animate__zoomInDown"
                  >
                    <img
                      style={{ marginLeft: "-40px" }}
                      className="w-100"
                      src="/assets/imgs/market1.png"
                    />
                  </ScrollAnimation>
                </div>

                <div style={{ maxWidth: "600px" }} className="m-auto  textCol">
                  <ScrollAnimation
                    animateOnce={true}
                    delay={500}
                    animateIn="animate__zoomInDown"
                  >
                    <spam style={{ color: "#2ea031", fontSize: "30px" }}>
                      *
                    </spam>
                    <p>
                      According to different market analyses and expert
                      statistics, the cannabis industry could reach 100 million
                      $ by 2025.
                    </p>
                  </ScrollAnimation>
                </div>
              </div>
            </div>
          </div>
        </Element>
        <Element name="BUSINESS_MODEL" className="BUSINESS_MODEL">
          <div className="container">
            <h2>Business Model</h2>
            <div className="row d-none d-md-flex">
              <div className="col-3 d-flex align-items-center justify-content-center">
                <div className="businessImg">
                  <img className="esssImg" src="/assets/imgs/fk1.png" />
                  {/* <span>jfadsk jdfnjkasf kjdjfas fjndjkfa</span> */}
                </div>
              </div>
              <div className="col-md-6">
                {/* <img src="https://svgshare.com/i/VJa.svg" title="" /> */}
                {/* <img className="w-100" src="../svg/esss.svg" /> */}
                <img
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    history.push("/hostingPlans");
                  }}
                  className="w-100 esssImg"
                  src="/assets/svges/esss.png"
                />
                {/* <img className="w-100" src="/assets/svges/ttt1.svg" /> */}
              </div>
              <div className="col-3 d-flex align-items-center justify-content-center">
                <div className="businessImg">
                  <img className="esssImg" src="/assets/imgs/fk2.png" />
                  {/* <span>jfadsk jdfnjkasf kjdjfas fjndjkfa</span> */}
                </div>
              </div>
            </div>
            <div className="row mt-5 d-flex d-md-none">
              <div className="col-12">
                <div className="businessImg m-auto pb-4">
                  <img src="/assets/imgs/fk1.png" />
                  {/* <span>jfadsk jdfnjkasf kjdjfas fjndjkfa</span> */}
                </div>
              </div>
              <div className="col-md-5">
                <div className="row justify-content-center h-100">
                  <div className="col-6 ">
                    <div className="greenBox p-3 h-100">
                      Cooperation.Investment <br />
                      in facilities/Hosting of
                      <br />
                      growing equipment
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row  h-100">
                      <div className="col-12    h-100 ">
                        <div
                          // style={{ height: "calc(100% - 10px)" }}
                          className="greenBox investment p-3  h-100   text-center"
                        >
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="arrow-left"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            class="svg-inline--fa fa-arrow-left fa-w-14 fa-2x"
                            style={{ top: "10px" }}
                          >
                            <path
                              fill="currentColor"
                              d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"
                              class=""
                            ></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="arrow-right"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            class="svg-inline--fa fa-arrow-right fa-w-14 fa-2x"
                            style={{ top: "35px" }}
                          >
                            <path
                              fill="currentColor"
                              d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"
                              class=""
                            ></path>
                          </svg>
                          Purchase of growing equipment
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2 py-4">
                <div className="greenBox businessLogo m-auto ">
                  <img src="/assets/svges/crowd_growing_logowhite.svg" />
                </div>
              </div>
              <div className="col-md-5">
                <div className="row justify-content-center ">
                  <div className="col-6 ">
                    <div style={{ height: "72px" }} className="greenBox p-3">
                      Profit From Harvest
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row  h-100">
                      <div className="col-12     ">
                        <div
                          style={{ height: "72px" }}
                          className="greenBox investment p-3    text-center"
                        >
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="arrow-left"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            class="svg-inline--fa fa-arrow-left fa-w-14 fa-2x"
                            style={{ top: "10px" }}
                          >
                            <path
                              fill="currentColor"
                              d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"
                              class=""
                            ></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="arrow-right"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            class="svg-inline--fa fa-arrow-right fa-w-14 fa-2x"
                            style={{ top: "35px" }}
                          >
                            <path
                              fill="currentColor"
                              d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"
                              class=""
                            ></path>
                          </svg>
                          Profit Share
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="businessImg m-auto pt-4">
                  <img src="/assets/imgs/fk2.png" />
                  {/* <span>jfadsk jdfnjkasf kjdjfas fjndjkfa</span> */}
                </div>
              </div>
            </div>

            <div
              style={{ color: "#fff" }}
              className="row problemSolving mt-5 pt-5"
            >
              <div className="col-12  mb-4 mt-4">
                <h1>The main problems</h1>
              </div>
              <div className="col-12 col-md-4 hoverScale mb-3 mb-md-0 modelText">
                <span className="pink">01</span>
                <div>
                  A large investment is needed to get started, as facilities,
                  products, equipment, etc. need to be financed to launch the
                  business.
                </div>
              </div>
              <div className="col-12 col-md-4 hoverScale mb-3 mb-md-0 modelText">
                <span className="pink">02</span>
                <div>
                  Furthermore, many people lack the specific expertise in the
                  cannabis market to be able to implement something profitable
                  and functional.
                </div>
              </div>
              <div className="col-12 hoverScale col-md-4 mb-3 mb-md-0 modelText">
                <span className="pink">03</span>
                <div>
                  Also difficult and varying regulations in different countries
                  make it even more challenging to enter the cannabis business.
                </div>
              </div>

              <div className="col-12  mb-4 mt-5 pt-5 ">
                <h1>Our solution</h1>
              </div>
              <div className="col-12 hoverScale col-md-4 mb-3 mb-md-0 modelText">
                <span className="">01</span>
                <div>
                  The big advantage for customers of Crowd Growing is that they
                  can easily profit from the cannabis market. Crowd Growing
                  enables them to profit with the same leverage that normally
                  only big investors in this market have, as they provide the
                  necessary infrastructure.
                </div>
              </div>
              <div className="col-12 hoverScale col-md-4 mb-3 mb-md-0 modelText">
                <span className="">02</span>
                <div>
                  Crowd Growing provides the complete chain of logistics and
                  hosts the customers‘ equipment. This provides each customer
                  the opportunity to become a part of a big player in this
                  market without the need of their own products, facilities or
                  expertise.
                </div>
              </div>

              <div className="col-12 hoverScale col-md-4 mb-3 mb-md-0 modelText">
                <span>03</span>

                <div>
                  Since our growing strategy is based on a certain cycle, where
                  each week new plants are planted as well as old plants are
                  harvested, it is possible to sell new harvests on a weekly
                  basis and therefore also share profits of these sales with our
                  clients.
                </div>
              </div>
            </div>
          </div>
        </Element>
        <Element name="lifCircle" className="lifCircle">
          <div className="container">
            <ScrollAnimation animateOnce={true} animateIn="animate__fadeInUp">
              <div>
                <h2>
                  Growing Street
                  <br />
                  <span style={{ fontWeight: "500" }}> Strategy </span>
                </h2>
              </div>
            </ScrollAnimation>
            <div className="row  d-none d-lg-flex strategyCrdWrapper mt-5 pt-3  ">
              <div className="strategyCrd">
                <div className="cardTitle">Step 1</div>
                <div className="cardTitle2">Cuttings</div>
                <img
                  className="hoverScale d-inline-block"
                  src="/assets/imgs/strategy1.png"
                />

                <p className="cardP mt-3">
                  Preparation of own feminized genetics focus on good look,
                  smell and taste
                </p>
                <p className="cardP">
                  Selection of good and stable genetic Processing of seedlings
                  or clones of the mother plants
                </p>
              </div>
              <div className="strategyCrd">
                <div className="cardTitle">Step 2</div>
                <div className="cardTitle2">Vegetation</div>
                <img
                  className="hoverScale d-inline-block"
                  src="/assets/imgs/strategy2.png"
                />

                <p className="cardP mt-3">
                  Growth of the plant until the flowering start (18h light /6h
                  dark)
                  <br />
                  Process time: 4-5 weeks
                </p>
              </div>
              <div className="strategyCrd">
                <div className="cardTitle">Step 3</div>
                <div className="cardTitle2">Flowering</div>
                <img
                  className="hoverScale d-inline-block"
                  src="/assets/imgs/strategy3.png"
                />

                <p className="cardP mt-3">
                  After 4-5 weeks lightning gets switched to 12h light/ 12h dark
                  in order to transform the plant into the flowering. This
                  process takes 3-4 weeks
                </p>
              </div>
              <div className="strategyCrd">
                <div className="cardTitle">Step 4</div>
                <div className="cardTitle2">Harvesting drying, trimming</div>
                <img
                  className="hoverScale d-inline-block"
                  src="/assets/imgs/strategy4.png"
                />

                <p className="cardP mt-3">
                  After this previous 8 week process, the harvesting time
                  begins. The whole harvest is processed and completed within
                  one day.
                </p>
                <p className="cardP ">
                  Drying and fermenting of the flowers in vacuum closed drying
                  chamber.
                </p>
              </div>
              <div className="strategyCrd">
                <div className="cardTitle">Step 5</div>
                <div className="cardTitle2">Packaging and sale</div>
                <img
                  className="hoverScale d-inline-block"
                  src="/assets/imgs/strategy5.png"
                />

                <p className="cardP mt-3">
                  Before the product can be distributed a laboratory test is
                  required.
                </p>
              </div>
            </div>
            {isMobil && (
              <div className="strategyCarousel">
                <Carousel infiniteLoop showArrows autoPlay>
                  <div className="strategyCrd slide">
                    <div className="cardTitle">Step 1</div>
                    <div className="cardTitle2">Cuttings</div>
                    <img
                      className="hoverScale d-inline-block"
                      src="/assets/imgs/strategy1.png"
                    />

                    <p className="cardP mt-3">
                      Preparation of own feminized genetics focus on good look,
                      smell and taste
                    </p>
                    <p className="cardP">
                      Selection of good and stable genetic Processing of
                      seedlings or clones of the mother plants
                    </p>
                  </div>
                  <div className="strategyCrd slide">
                    <div className="cardTitle">Step 2</div>
                    <div className="cardTitle2">Vegetation</div>
                    <img
                      className="hoverScale d-inline-block"
                      src="/assets/imgs/strategy2.png"
                    />

                    <p className="cardP mt-3">
                      Growth of the plant until the flowering start (18h light
                      /6h dark)
                      <br />
                      Process time: 4-5 weeks
                    </p>
                  </div>
                  <div className="strategyCrd slide">
                    <div className="cardTitle">Step 3</div>
                    <div className="cardTitle2">Flowering</div>
                    <img
                      className="hoverScale d-inline-block"
                      src="/assets/imgs/strategy3.png"
                    />

                    <p className="cardP mt-3">
                      After 4-5 weeks lightning gets switched to 12h light/ 12h
                      dark in order to transform the plant into the flowering.
                      This process takes 3-4 weeks
                    </p>
                  </div>
                  <div className="strategyCrd slide">
                    <div className="cardTitle">Step 4</div>
                    <div className="cardTitle2">
                      Harvesting drying, trimming
                    </div>
                    <img
                      className="hoverScale d-inline-block"
                      src="/assets/imgs/strategy4.png"
                    />

                    <p className="cardP mt-3">
                      After this previous 8 week process, the harvesting time
                      begins. The whole harvest is processed and completed
                      within one day.
                    </p>
                    <p className="cardP ">
                      Drying and fermenting of the flowers in vacuum closed
                      drying chamber.
                    </p>
                  </div>
                  <div className="strategyCrd slide ">
                    <div className="cardTitle">Step 5</div>
                    <div className="cardTitle2">Packaging and sale</div>
                    <img
                      className="hoverScale d-inline-block"
                      src="/assets/imgs/strategy5.png"
                    />

                    <p className="cardP mt-3">
                      Before the product can be distributed a laboratory test is
                      required.
                    </p>
                  </div>
                </Carousel>
              </div>
            )}
          </div>
        </Element>
        <Element name="profits" className="profits">
          <div className="container">
            <ScrollAnimation animateOnce={true} animateIn="animate__fadeInUp">
              {/* <div className="left">
                <h2>How to make Profit with Us </h2>
                <p>
                  The big advantage for customers of Crowd Growing is that they
                  can easily profit from the cannabis market. Crowd Growing
                  enables them to profit with the same leverage that normally only
                  big investors in this market have, as they provide the necessary
                  infrastructure. Crowd Growing provides the complete chain of
                  logistics and hosts the customers‘ equipment. This provides each
                  customer the opportunity to become a part of a big player in
                  this market without the need of their own products, facilities
                  or expertise.
                </p>
              </div> */}
              <div className="pageContainer Affiliate Locations">
                <div className="section11">
                  <div className="container ">
                    <h2 className="mb-2 text-left">Locations</h2>
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <p>
                          In order to diversify and thereby lower the risk of
                          being effected by future cannabis regulations we are
                          working in different countries and jurisdictions of
                          Europe. As we aim to grow fast in the future we will
                          strive to cooperate with additional facilities in
                          different locations. Before entering in to a bigger
                          cooperation and therefore make a facility one of our
                          main strategic partners, we run intense test
                          investments as well as several test grows to ensure
                          highest quality as well as professional business
                          execution in the future.
                        </p>
                        <p>Right now our main partners are located in:</p>
                      </div>
                      <div className="col-12 col-md-6">
                        <spam
                          style={{
                            color: "#2ea031",
                            fontSize: "20px",
                            lineHeight: "10px",
                          }}
                        >
                          *
                        </spam>
                        <p>
                          Other cooperation partners are located in Greece and
                          North Macedonia. We are invested with these partners
                          and are currently in the test growing stages. The
                          environment, the setup, as well as the conditions are
                          so far favorable to us, we will reveal more
                          information as soon as we have completed the testing
                          stages.{" "}
                        </p>
                      </div>
                    </div>
                    <div className=" locationsSlider mt-5 pt-3">
                      <Carousel infiniteLoop showArrows>
                        <div className=" slide row">
                          <div className="col-12 d-none d-md-block col-md-6">
                            <img
                              className="w-100"
                              src="/assets/imgs/location3.png"
                            />
                          </div>

                          <div className="col-12 col-md-6">
                            <img
                              className="w-100  d-block d-md-none "
                              src="/assets/imgs/location3.png"
                            />
                            <h2 className="text-left" style={{ color: "#fff" }}>
                              SPAIN
                            </h2>
                            <p>
                              Other cooperation partners are located in Greece
                              and North Macedonia. We are invested with these
                              partners and are currently in the test growing
                              stages.
                            </p>
                            <p>
                              Other cooperation partners are located in Greece
                              and North Macedonia. We are invested with these
                              partners and are currently in the test growing
                              stages.
                            </p>
                            <p>
                              Other cooperation partners are located in Greece
                              and North Macedonia. We are invested with these
                              partners and are currently in the test growing
                              stages.
                            </p>

                            <p style={{ color: "#2ea031" }}>Hard facts:</p>
                            <p>
                              Location: Near Valencia / Growing space: 10.000 sq
                              m. Focus: High quality CBD and CBG Flowers
                            </p>
                          </div>
                        </div>
                        <div className="slide row">
                          <div className="col-12 col-md-6 d-none d-md-block ">
                            <img
                              className="w-100 "
                              src="/assets/imgs/location4.png"
                            />
                          </div>

                          <div className="col-12 col-md-6">
                            <img
                              className="w-100 d-block d-md-none"
                              src="/assets/imgs/location4.png"
                            />
                            <h2 className="text-left" style={{ color: "#fff" }}>
                              BULGARIA
                            </h2>
                            <p>
                              Our partner facility is located around 100 km away
                              from the Bulgarian capital city Sofia. Bulgaria is
                              as well as Spain a very cannabis friendly
                              jurisdiction with a very “pro-business” tax
                              regulation. With our Bulgarian partners we work
                              together since 2018.
                            </p>
                            <p>
                              Beside a very cannabis friendly jurisdiction
                              Bulgaria is offering cheap labor costs and is
                              therefore highly profitable for us.
                            </p>
                            <p>
                              At the beginning of our joint venture with this
                              facility the total plantation area was around 7500
                              sqm. Since 2020 the total plantation space we
                              share with other business partners is around 15000
                              sq. m. In Bulgaria we focus on raw CBD Flowers as
                              well as CBD Oil.
                            </p>
                            <p style={{ color: "#2ea031" }}>Hard facts:</p>
                            <p>
                              Location: Near Sofia / Growing space: 15.000 sq m.
                              Focus: CBD Flowers and CBD Oil
                            </p>
                          </div>
                        </div>
                      </Carousel>
                    </div>
                    <div className="row locationImgs d-none d-md-flex">
                      <div className="col-12 col-md-6 ">
                        {/* <img className="w-100" src={Location1} /> */}
                      </div>
                      <div className="col-12 col-md-6 ">
                        {/* <img className="w-100 " src={Location2} /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            {/* <div className="right">
              <ScrollAnimation animateOnce={true} animateIn="animate__zoomIn">
                <div className="img">
                  <img src={Profits} />
                </div>
              </ScrollAnimation>
            </div> */}
          </div>
        </Element>
        <Element
          style={{ position: "relative" }}
          name="RoadMap"
          className="RoadMap"
        >
          <div className="container pt-5">
            <h2 className="pt-5 text-center">Roadmap</h2>
          </div>
          <div className="text-center controllers">
            <span
              onClick={() => {
                if (isMobil) {
                  if (roadPosition > -2) {
                    setRoadPosition(roadPosition - 1);
                  }
                } else {
                  if (roadPosition > 0) {
                    setRoadPosition(roadPosition - 1);
                  }
                }
              }}
            >
              <svg
                width="20"
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="arrow-alt-circle-left"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa m-2 fa-arrow-alt-circle-left fa-w-16 fa-2x"
              >
                <path
                  fill={
                    roadPosition === 0 && !isMobil
                      ? "grey"
                      : isMobil && roadPosition === -2
                      ? "grey"
                      : "#2ea031"
                  }
                  d="M8 256c0 137 111 248 248 248s248-111 248-248S393 8 256 8 8 119 8 256zm448 0c0 110.5-89.5 200-200 200S56 366.5 56 256 145.5 56 256 56s200 89.5 200 200zm-72-20v40c0 6.6-5.4 12-12 12H256v67c0 10.7-12.9 16-20.5 8.5l-99-99c-4.7-4.7-4.7-12.3 0-17l99-99c7.6-7.6 20.5-2.2 20.5 8.5v67h116c6.6 0 12 5.4 12 12z"
                  class=""
                ></path>
              </svg>
            </span>
            <span
              onClick={() => {
                if (isMobil) {
                  if (roadPosition < 5) {
                    setRoadPosition(roadPosition + 1);
                  }
                } else {
                  if (roadPosition < 2) {
                    setRoadPosition(roadPosition + 1);
                  }
                }
              }}
            >
              <svg
                width="20"
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="arrow-alt-circle-right"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa pointer m-2 fa-arrow-alt-circle-right fa-w-16 fa-2x"
              >
                <path
                  fill={
                    roadPosition === 2 && !isMobil
                      ? "grey"
                      : roadPosition === 5 && isMobil
                      ? "grey"
                      : "#2ea031"
                  }
                  d="M504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256zm72 20v-40c0-6.6 5.4-12 12-12h116v-67c0-10.7 12.9-16 20.5-8.5l99 99c4.7 4.7 4.7 12.3 0 17l-99 99c-7.6 7.6-20.5 2.2-20.5-8.5v-67H140c-6.6 0-12-5.4-12-12z"
                  class=""
                ></path>
              </svg>
            </span>
          </div>
          <div
            style={{ color: "#fff" }}
            className="newRoadMap pb-0 mt-0 mt-md-5"
          >
            <div className="roadYarBg">{getRoadYear()}</div>
            <img
              className={"road" + " " + "position" + roadPosition}
              src="/assets/svges/roadMap.svg"
            />
          </div>
          <ScrollAnimation
            animateOnce={true}
            animateIn="animate__fadeInUp"
          ></ScrollAnimation>
        </Element>
      </div>
      <Footer />
    </>
  );
};

export default home;
