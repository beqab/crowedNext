import React, { useState, useEffect } from "react";
import ModalContainer from "../common/modal/modalContainer";
import classnames from "classnames";
import { AuthService } from "../../services/user/user.http";
import { red } from "@material-ui/core/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentUser,
  setCurrentStore,
  updateUser,
} from "../../store/auth/authActions";

interface Props {
  openWithdrawalModal: Boolean;
  setOpenWithdrawalModals: any;
}

const Withdrawal: React.FC<Props> = ({
  openWithdrawalModal,
  setOpenWithdrawalModals,
}) => {
  const { user } = useSelector((store: any) => {
    return store.auth;
  });

  const dispatch = useDispatch();

  const [depositType, setDepositType] = useState("BITCOIN");
  const [addressList, setAddressList] = useState([]);
  const [addresError, setAddresError] = useState<any>("");
  const [amountError, setAmountError] = useState<any>("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loader, setLoader] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<any>(false);

  useEffect(() => {
    AuthService.getWithdraws().then((res) => {
      setAddressList(res.data.address);

      if (res.data.address.length) {
        setAddress(res.data.address[0].address);
        setDepositType(res.data.address[0].method);
      }
    });
  }, []);

  const withdraw = () => {
    setLoader(true);
    AuthService.withdraw({ address, method: depositType, amount })
      .then((res) => {
        setLoader(false);
        setDone(true);
        console.log(res);
        dispatch(
          updateUser({
            user: {
              ...user,
              balance: {
                ...user.balance,
                spendable: Number(user.balance.spendable) - Number(amount),
              },
            },
          })
        );
        // debugger;
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
        debugger;
        if (err?.response?.data?.errors) {
          setServerError(err.response.data.errors.WITHDRAW_REQUEST);
        }
      });
  };

  const withdrawDoneModal = () => {
    return (
      <div
        style={{ color: "#000", fontSize: "14px" }}
        className="modal-content  "
      >
        <div
          className="sweet-alert  showSweetAlert visible"
          data-custom-className=""
          data-has-cancel-button="false"
          data-has-confirm-button="true"
          data-allow-outside-click="false"
          data-has-done-function="false"
          data-animation="pop"
          data-timer="null"
          style={{ display: "inline-block" }}
        >
          {/* <div className="sa-icon sa-warning" style="display: none;">
<span className="sa-body"></span>
<span className="sa-dot"></span>
</div> */}
          {/* <div className="sa-icon sa-info" style="display: none;">
</div> */}
          <div className="sa-icon sa-success animate">
            <span className="sa-line sa-tip animateSuccessTip"></span>
            <span className="sa-line sa-long animateSuccessLong"></span>

            <div className="sa-fix"></div>
            <div className="sa-placeholder"></div>
            {/* </div><div className="sa-icon sa-custom" style="display: none;"></div> */}
          </div>
          <h2 style={{ color: "#000" }}>Success!</h2>
          <p className="lead text-muted ">
            {/* {showModal === "profile" ? "Profile" : "Photo"} Updated */}
            The transaction was completed successfully
          </p>

          <div className="sa-button-container">
            <div className="sa-confirm-button-container">
              <button
                onClick={() => closeModal()}
                className="confirm btn btn-lg btn-primary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const closeModal = () => {
    setOpenWithdrawalModals(false);
    setDone(false);
    setAmount("");
    setDepositType("BITCOIN");
    setAddress("");
    setAddresError("");
  };

  return (
    <ModalContainer
      maxWidth={600}
      showModal={openWithdrawalModal}
      closeModal={() => {
        setDone(false);
        setOpenWithdrawalModals(false);
      }}
    >
      <>
        {loader && (
          <div className="loaderWrapper ">
            <img
              className="loader"
              src="https://cdn.dribbble.com/users/1028334/screenshots/2874977/canalol.gif"
            />
          </div>
        )}

        {done ? (
          withdrawDoneModal()
        ) : (
          <div
            className="p-5"
            // action="https://crowd-growing.com/user/withdraw"
            // method="post"
            style={{
              background: "#C8C8C8",
            }}
          >
            <input
              type="hidden"
              name="_token"
              value="cngHFLIH95tNqyifuaTH8P3XEIRPIN8IAkbfiLvR"
            />{" "}
            <div className="row">
              <div className="col-lg-12">
                <div className="card-header header-elements-inline">
                  <h2 className="text-center colorBlack">
                    Balance ${user?.balance?.spendable.toFixed(2)}
                  </h2>
                </div>
              </div>
            </div>
            <div className="text-center w-100 mb-0">
              <div className="mb-3" style={{ color: "#000" }}>
                Method
              </div>
              {serverError && (
                <div
                  style={{
                    color: "red",
                    marginBottom: "10px",
                    textAlign: "center",
                  }}
                >
                  {serverError}
                </div>
              )}
              <div className="methodGroup">
                <span
                  onClick={() => {
                    setDepositType("BITCOIN");
                  }}
                  className="pointer"
                >
                  <span
                    className={classnames("methodRadio mr-2  ", {
                      active: depositType === "BITCOIN",
                    })}
                  ></span>
                  <img width="40" src="./assets/svges/btc.svg" />
                </span>
                {/* <span
                  onClick={() => {
                    setDepositType("ETH");
                  }}
                  className="mx-4 pointer"
                >
                  <span
                    className={classnames("methodRadio mr-1  ", {
                      active: depositType === "ETH",
                    })}
                  ></span>

                  <img width="40" src="./assets/svges/eth.svg" />
                </span> */}
                {/* <span
                  onClick={() => {
                    setDepositType("USDT");
                  }}
                  className="pointer"
                >
                  <span
                    className={classnames("methodRadio mr-2  ", {
                      active: depositType === "USDT",
                    })}
                  ></span>

                  <img width="40" src="./assets/svges/usdt.svg" />
                </span> */}
              </div>
            </div>
            <div className="form-group row">
              <div className="col-lg-12">
                <label className="col-form-label colorBlack pb-1 d-flex justify-content-between ">
                  <span>Amount </span>
                  <span>* a withdrawal fee of 3% will be deducted</span>
                </label>
                <div style={{ color: "red" }}>{amountError && amountError}</div>

                <div className="input-group input-group-merge">
                  <div className="input-group-prepend">
                    <span className="input-group-text">$</span>
                  </div>
                  <input
                    type="text"
                    step="any"
                    name="amount"
                    min="50"
                    onChange={(e: any) => {
                      // debugger;
                      setAmountError("");
                      setServerError("");
                      setAmount(e.target.value.replace(/\D/g, ""));
                    }}
                    value={amount}
                    maxLength={10}
                    className="form-control"
                    // required=""
                  />
                </div>
              </div>
            </div>
            {/* <div className="form-group row">
          <div className="col-lg-12">
            <label className="col-form-label  colorBlack">Method</label>

            <select
              className="form-control select"
              name="coin"
              data-dropdown-css-className="bg-primary"
              data-fouc=""
              //   required=""
            >
              <option value="1">Bitcoin</option>
            </select>
          </div>
        </div> */}
            <div className="form-group row">
              <div className="col-lg-12">
                <label className="col-form-label  colorBlack">Address</label>
                <div style={{ color: "red" }}>{addresError && addresError}</div>

                <select
                  name="details"
                  className="form-control select"
                  data-dropdown-css-className="bg-primary"
                  data-fouc=""
                  //   required=""
                  onChange={(e: any) => {
                    setServerError("");
                    setAddresError("");
                    const selected: any = addressList.find(
                      (el: any) => el.address === e.target.value
                    );
                    if (selected) {
                      // debugger;
                      // if (selected?.method === "BITCOIN") {
                      //   return setDepositType("BTC");
                      // }
                      setDepositType(selected?.method);
                      setAddress(selected.address);
                    }
                  }}
                >
                  {addressList.map((el: any, i) => {
                    return (
                      <option key={i} value={el.address}>
                        {el.address}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={(e) => {
                  // debugger;
                  if (!address) {
                    setAddresError("select address");
                    return;
                  }

                  if (Number(amount) < 50) {
                    setAmountError("Amount is below the minimum (50$)");

                    return;
                  }
                  e.preventDefault();
                  withdraw();
                  // @ts-ignore: Unreachable code error
                }}
                type="submit"
                style={{ backgroundColor: "#2EA031" }}
                className="btn btn-primary w-50 btcSubmit"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </>
    </ModalContainer>
  );
};

export default Withdrawal;
