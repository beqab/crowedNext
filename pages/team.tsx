import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Card, Nav } from "react-bootstrap";
import { Button } from "../components/common/forms/button";
import { AuthService } from "../services/user/user.http";
import classnames from "classnames";

const Dashboard = () => {
  const [team, setTeam] = useState<any>([]);
  const [directComissions, setDirectComissions] = useState<any>([]);
  const [openDirectComissions, setOpenDirectComissions] = useState<any>(false);
  const [activeTeam, setActiveTeam] = useState<any>(-1);
  const [statistic, setStatistic] = useState<any>();

  useEffect(() => {
    AuthService.getTeam().then((res) => {
      let teams: any = [];

      for (const key in res.data.referrers) {
        teams.push(res.data.referrers[key]);
      }

      // debugger;
      // debugger;
      // debugger;
      setTeam(teams);
      setDirectComissions(
        res.data.directComissions.filter((el) => el.investedAmount)
      );
      // debugger;
    });

    AuthService.teamStatistic().then((res) => {
      console.log(res);
      setStatistic(res.data.referrers);
    });
  }, []);

  const getSum = (arr, key) => {
    let acumulator = 0;

    arr.map((el) => {
      if (el[key]) {
        acumulator += el[key];
      }
    });

    return acumulator;
  };

  const renderEmptyLvs = () => {
    let lng = 10 - team.length;
    // debugger;
    let arr = new Array(lng).fill("2");

    return arr.map((el, i) => {
      console.log(el);
      return (
        <table className="table table-flush" id="basic">
          <thead
            onClick={() => {
              if (activeTeam === i + team.length + 1) {
                setActiveTeam(null);
              } else {
                setActiveTeam(i + team.length + 1);
              }
            }}
          >
            <tr>
              <th>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="plus-circle"
                  role="img"
                  width="11"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="svg-inline--fa fa-plus-circle fa-w-16 fa-2x"
                >
                  <path
                    fill="currentColor"
                    d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"
                    className=""
                  ></path>
                </svg>
              </th>
              <th className="bold12">{i + team.length + 1} LEVEL</th>
              <th className="bold12">{0} MEMBER</th>
              <th className="bold12">0 $ TURN OVER</th>
              <th className="bold12">0 $ EARNED</th>
            </tr>
          </thead>
        </table>
      );
    });
  };
  return (
    <Layout title="Dashboard">
      <div className="main-content">
        <div className="content-wrapper">
          <div className="container-fluid mt--6">
            <div className="row">
              <div className="col-lg-3">
                <span>Member</span>
                <div className="card bg-white border-0">
                  <div className="card-body">{statistic?.allMembers}</div>
                </div>
              </div>
              <div className="col-lg-3">
                <span>Active Member</span>
                <div className="card bg-white border-0">
                  <div className="card-body">{statistic?.activeMembers}</div>
                </div>
              </div>
              <div className="col-lg-3">
                <span>Turnover</span>
                <div className="card bg-white border-0">
                  <div className="card-body">{statistic?.turnOver} $</div>
                </div>
              </div>
              <div className="col-lg-3">
                <span>Est. Monthly Income</span>
                <div className="card bg-white border-0">
                  <div className="card-body">{statistic?.monthlyIncome} $</div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-3">
                <span>Direct Commission</span>
                <div className="card bg-white border-0">
                  <div className="card-body">
                    {Number(statistic?.directCommissions).toFixed(2)} $
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <span>Residual Commission</span>
                <div className="card bg-white border-0">
                  <div className="card-body">
                    {statistic?.residualCommissions} $
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <span>Total Earned</span>
                <div className="card bg-white border-0">
                  <div className="card-body">
                    {Number(statistic?.totalEarned).toFixed(2)} $
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <span>Rank</span>
                <div className="card bg-white border-0">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    {statistic?.rank}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{ overflowX: "auto", overflowY: "hidden" }}
              id="other"
            >
              <div className="card-header header-elements-inline">
                <h3 className="mb-0">Direct Commission</h3>
              </div>
              {/* {team.map((el, i) => {
                return ( */}
              <table className="table table-flush" id="basic">
                <thead
                  // onClick={() => {
                  //   if (activeTeam === i) {
                  //     setActiveTeam(null);
                  //   } else {
                  //     setActiveTeam(i);
                  //   }
                  // }}
                  onClick={() => {
                    setOpenDirectComissions(!openDirectComissions);
                    // debugger;
                  }}
                >
                  <tr>
                    <th>
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="plus-circle"
                        role="img"
                        width="11"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-plus-circle fa-w-16 fa-2x"
                      >
                        <path
                          fill="currentColor"
                          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"
                          className=""
                        ></path>
                      </svg>
                    </th>
                    <th className="bold12">{1} LEVEL</th>
                    <th className="bold12">{directComissions.length} MEMBER</th>
                    <th className="bold12">
                      {directComissions.length &&
                        // directComissions
                        //   .reduce((sum: any, item: any) => {
                        //     // debugger;
                        //     if (!item.investedAmount || !sum.investedAmount) {
                        //       return 0;
                        //     }
                        //     if (item.investedAmount) {
                        //       return sum.investedAmount + item.investedAmount;
                        //     }
                        //     return sum + item.investedAmount;
                        //   })
                        getSum(directComissions, "investedAmount").toFixed(2)}
                      $ TURN OVER
                    </th>
                    <th className="bold12">
                      {getSum(directComissions, "earned").toFixed(2)}$ EARNED
                    </th>
                  </tr>
                </thead>

                <tbody
                  className={classnames({
                    "d-none": !openDirectComissions,
                  })}
                >
                  <tr>
                    <td></td>

                    <th className="bold12">Username</th>
                    <th className="bold12">Email Address</th>
                    <th className="bold12">Invested Amount</th>
                    <th className="bold12">Earned</th>
                  </tr>
                  {directComissions.map((el) => {
                    return (
                      <tr key={"i"}>
                        <td></td>

                        <td>{el.realUsername} </td>
                        <td>{el.email}</td>
                        <td>{el.investedAmount} $</td>
                        <td>{el.earned}$</td>
                      </tr>
                    );
                  })}

                  {/* {el.map((user, i) => { */}
                  {/* return ( */}

                  {/* ); */}
                  {/* })} */}
                </tbody>
              </table>
              {/* );
              })} */}
            </div>

            {/* ////// */}

            <div
              className="card"
              style={{ overflowX: "auto", overflowY: "hidden" }}
              id="other"
            >
              <div className="card-header header-elements-inline">
                <h3 className="mb-0">Residual Bonus</h3>
              </div>
              {team.map((el, i) => {
                // debugger;
                return (
                  <table className="table table-flush" id="basic">
                    <thead
                      onClick={() => {
                        if (activeTeam === i) {
                          setActiveTeam(null);
                        } else {
                          setActiveTeam(i);
                        }
                      }}
                    >
                      <tr>
                        <th>
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="plus-circle"
                            role="img"
                            width="11"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="svg-inline--fa fa-plus-circle fa-w-16 fa-2x"
                          >
                            <path
                              fill="currentColor"
                              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"
                              className=""
                            ></path>
                          </svg>
                        </th>
                        <th className="bold12">{i + 1} LEVEL</th>
                        <th className="bold12">{el.length} MEMBER</th>
                        <th className="bold12">
                          {
                            // el
                            //   .reduce((sum: any, item: any) => {
                            //     // debugger;
                            //     if (item.investedAmount) {
                            //       return sum.investedAmount + item.investedAmount;
                            //     }
                            //     return sum;
                            //   })
                            el &&
                              el.length &&
                              getSum(el, "investedAmount").toFixed(2)
                          }
                          $ TURN OVER
                        </th>
                        <th className="bold12">
                          {/* {el
                            .reduce((sum: any, item) => {
                              // debugger;
                              if (item.earned) {
                                return sum.earned + item.earned;
                              }
                              return sum;
                            })
                            .toFixed(2)}{" "} */}
                          {el && el.length && getSum(el, "earned").toFixed(2)}$
                          EARNED
                        </th>
                      </tr>
                    </thead>

                    <tbody
                      className={classnames({ "d-none": activeTeam !== i })}
                    >
                      <tr>
                        <td></td>

                        <th className="bold12">Username</th>
                        <th className="bold12">Email Address</th>
                        <th className="bold12">Invested Amount</th>
                        <th className="bold12">Earned</th>
                      </tr>
                      {el.map((user, i) => {
                        return (
                          <tr key={i}>
                            <td></td>

                            <td>{user.realUsername} </td>
                            <td>{user.email}</td>
                            <td>
                              {user?.investedAmount
                                ? user?.investedAmount?.toFixed(2)
                                : user?.investedAmount}{" "}
                              $
                            </td>
                            <td>
                              {user?.earned
                                ? user?.earned?.toFixed(2)
                                : user?.earned}
                              $
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })}
              {renderEmptyLvs()}
            </div>

            {/* /////// */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
