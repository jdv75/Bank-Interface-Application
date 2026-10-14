import "./Withdraw.css";
import DepositWithdrawForm from "../../components/DepositWithdrawForm/DepositWithdrawForm";
import withdrawImage from "../../assets/images/Withdraw.png";


function Withdraw() {
    return (
        <main className="withdraw-page">
            <div className="withdraw-header">
                <div>
                    <h1>Withdraw Funds</h1>
                    <p>Withdraw money from your account quickly and securely.</p>
                </div>
            </div>

            <div className="withdraw-layout">
                <DepositWithdrawForm type="withdrawal" />

                <aside className="withdraw-information">
                    <img src={withdrawImage} alt="Wallet with cash" />
                    <h2>Withdraw From Your Account</h2>
                    <p>
                        Easily take money out of your accounts whenever you need it.
                    </p>
                </aside>
            </div>
        </main>
    );
}

export default Withdraw;