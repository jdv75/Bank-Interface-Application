import "./Withdraw.css";
import DepositWithdrawForm from "../../components/DepositWithdrawForm/DepositWithdrawForm";


function Withdraw() {
    return (
        <div className="withdraw-page">

            <div className="withdraw-header">
                <div>
                    <h1>Withdraw Funds</h1>
                    <p>Add money to your account quickly and securely.</p>
                </div>

            </div>

            <DepositWithdrawForm type="withdraw" />


        </div>
    )
}

export default Withdraw;