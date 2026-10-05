import "./Deposit.css";
import DepositWithdrawForm from "../../components/DepositWithdrawForm/DepositWithdrawForm";


function Deposit() {
    return (
        <div className="deposit-page">

            <div className="deposit-header">
                <div>
                    <h1>Deposit Funds</h1>
                    <p>Add money to your account quickly and securely.</p>
                </div>

            </div>

            <DepositWithdrawForm type="deposit" />


        </div>
    )
}

export default Deposit;