import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "../components/common/forms/button";
import classnames from "classnames";
import { AuthService } from "../services/user/user.http";

const Dashboard = () => {
  const [openFaq, setOpenFaq] = useState(-1);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    AuthService.getFaq().then((res) => {
      // debugger;
      console.log(res);
      setFaqData(res.data.faq);
    });
  }, []);

  const Faq = [
    {
      title: " What does Crowd Growing do?",
      text: (
        <div className="card-body">
          <p></p>
          <p>
            With Crowd Growing&nbsp; you have the opportunity to invest into the
            cannabis market without having any facilities, licenses nor
            knowledge by yourself. You simply invest into growing equipment
            which will be hosted then in one of our partner’s facilities and
            share the profits with you.
          </p>
          <p></p>
        </div>
      ),
    },
    {
      title: "What are the differences between the different products?",
      text: (
        <div className="card-body">
          <p></p>
          <p>
            The starter, advanced &amp; professional plan don’t differ in any
            form from profitability, only the founder plan will pay users 1 - 3%
            more per month.
          </p>
          <p>
            Depending which plan you purchase you will have different commission
            earning opportunities.
          </p>
          <p>
            Starter: 5% direct commission / 1 - 2 level residual income bonus
          </p>
          <p>
            Advanced: 6% direct commission / 1 – 4 level residual income bonus
          </p>
          <p>
            Professional: 7% direct commission / 1 – 8 level residual income
            bonus
          </p>
          <p></p>
        </div>
      ),
    },
  ];
  return (
    <Layout title="Dashboard">
      <div className="main-content">
        <div className="content-wrapper">
          <div className="container-fluid mt--6">
            <div className="row">
              <div className="col-lg-12">
                <div className="card bg-white">
                  <div
                    style={{ minHeight: " calc(100vh - 86px)" }}
                    className="card-body supportWrapper"
                  >
                    <div
                      style={{
                        textAlign: "center",
                        maxWidth: "1200px",
                        margin: "auto",
                      }}
                    >
                      Our FAQ’s should provide an answer to most of the general
                      questions. Should you still have any further questions or
                      need help, don’t hesitate to contact our support on
                      Telegram <strong>@crowdgrowingsupport</strong>, which is
                      going to answer you within 24 hours after your request.
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: " space-between",
                        minHeight: "calc(95vh - 90px)",
                      }}
                      className="content"
                    >
                      <div className="col-md-12">
                        <hr />
                        <div className="container">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="section-title text-left"></div>
                              <div id="accordion" className="col-lg-12">
                                {faqData.map((el: any, i) => {
                                  return (
                                    <div
                                      key={i}
                                      onClick={() => {
                                        setOpenFaq(i);
                                      }}
                                      className="card"
                                    >
                                      <div
                                        className="card-header"
                                        id="heading10"
                                      >
                                        <h5>
                                          <button
                                            className={classnames(
                                              "btn btn-link collapsed faqitemBtn "
                                            )}
                                            data-toggle="collapse"
                                            data-target="#collapse10"
                                            aria-expanded="false"
                                            aria-controls="collapse10"
                                          >
                                            {el.question}
                                          </button>
                                        </h5>
                                      </div>
                                      <div
                                        id="collapse10"
                                        className={classnames(" collapse ", {
                                          show: openFaq == i,
                                        })}
                                        aria-labelledby="heading10"
                                        data-parent="#accordion"
                                      >
                                        {/* {el.answer} */}

                                        <div
                                          className="Container px-5"
                                          dangerouslySetInnerHTML={{
                                            __html: el.answer,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="footerCOntainer">
                        <a
                          style={{ float: "right" }}
                          href="https://cutt.ly/cgfb"
                          className="facebook"
                          target="_blank"
                        >
                          <i className="fa fa-facebook fa-2x greenColor"></i>
                        </a>
                        <a
                          style={{ float: "right" }}
                          href="https://cutt.ly/cgtg"
                          className="telegram"
                          target="_blank"
                        >
                          <i className="fa fa-telegram fa-2x greenColor"></i>
                        </a>
                        <a
                          style={{ float: "right" }}
                          href="https://cutt.ly/cgyt"
                          className="youtube"
                          target="_blank"
                        >
                          <i className="fa fa-youtube fa-2x greenColor"></i>
                        </a>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
