import "./Deposit.css";
import DepositWithdrawForm from "../../components/DepositWithdrawForm/DepositWithdrawForm";
import depositImage from "../../assets/images/Deposit.png";


function Deposit() {
    return (
        <main>
         <div className="deposit-page">

            <div className="deposit-header">
                <div>
                    <h1>Deposit Funds</h1>
                    <p>Add money to your account quickly and securely.</p>
                </div>

            </div>

            <div className="deposit-layout">
                <DepositWithdrawForm type="deposit" />
                <aside className="deposit-information">
                    <img src={depositImage} alt="ATM with cash" />
                    <h2>Deposit To Your Account</h2>
                    <p>
                        Easily add money to your accounts!
                    </p>
                </aside>
            </div>
          


        </div>   
        </main>
        
    )
}

export default Deposit;