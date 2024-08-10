import { memo, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export const Heading = memo(({ label }) => {
    return (
        <div>
            <h1 className="font-bold text-4xl pt-6">{label}</h1>
        </div>
    );
});

export const SubHeading = memo(({ label }) => {
    return (
        <div>
            <h2 className="text-slate-500 text-md pt-1 px-4 pb-4">{label}</h2>
        </div>
    );
});

export const InputBox = memo(({ label, type, onChange }) => {
    return (
        <div className="flex flex-col">
            <label
                className="font-bold text-sm text-left py-2"
                htmlFor={label}
            >
                {label}
            </label>
            <input
                className="w-full px-2 py-1 border rounded border-slate-200"
                type={type}
                placeholder={label}
                id={label}
                onChange={onChange}
                required
            />
        </div>
    );
});

export const Button = memo(({ label, onClick }) => {
    return (
        <button
            onClick={onClick}
            type="submit"
            className="w-full my-2 text-white bg-gray-800 py-2.5 px-5 rounded-lg me-2 mb-2 text-sm font-medium focus:ring-4 focus:ring-gray-300 focus:outline-none hover:bg-gray-900"
        >
            {label}
        </button>
    );
});

export const BottomWarning = memo(({ label, to, buttonText }) => {
    return (
        <div className="py-2 text-sm flex justify-center">
            <span>{label}</span>
            <Link className="underline pl-1 cursor-pointer" to={to}>
                {buttonText}
            </Link>
        </div>
    );
});

export const AppBar = memo(() => {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    return (
        <header className="shadow h-20 flex px-4 justify-between">
            <div className="flex flex-col justify-center h-full ml-4">
                <Link
                    to={"/dashboard"}
                    className="font-medium text-2xl cursor-pointer"
                >
                    PayTM App
                </Link>
            </div>
            <div className="flex items-center">
                <div className="flex flex-col justify-center h-full mr-4">
                    <h2 className="font-semibold">{username}</h2>
                </div>
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl cursor-pointer">
                        {username.split("")[0].toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
});

export const Balance = memo(() => {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        setIsLoading(true);
        axios
            .get("https://paytm-fgrn.onrender.com/api/v2/account/balance", {
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("jwt_token"),
                },
            })
            .then((response) => {
                const responseData = response.data;
                if (response.status === 200) {
                    setBalance(responseData.AccountBalance);
                } else {
                    setErrorMessage(responseData.error);
                }
            })
            .catch((error) => {
                setErrorMessage("An error occurred: " + error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="w-full h-14 flex items-center mx-4">
            <div className="font-bold text-lg">
                Your Balance:{" "}
                <span className="font-semibold">
                    {isLoading
                        ? "Loading...Your balance"
                        : `Rs ${balance}`}
                </span>
                {errorMessage && (
                    <span className="text-red-500">{errorMessage}</span>
                )}
            </div>
        </div>
    );
});

export const Users = () => {
    const [searchString, setSearchString] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        const delayDebounceFn = setTimeout(() => {
            axios
                .get(
                    `https://paytm-fgrn.onrender.com/api/v2/user/bulk?searchString=${searchString}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: localStorage.getItem("jwt_token"),
                        },
                    }
                )
                .then((response) => {
                    const responseData = response.data;
                    if (response.status === 200) {
                        setUsers(responseData.user);
                    } else {
                        setErrorMessage(responseData.error);
                    }
                })
                .catch((error) => {
                    setErrorMessage("An error occurred: " + error.message);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 500); // Add a debounce delay here

        return () => clearTimeout(delayDebounceFn);
    }, [searchString]);

    return (
        <>
            <div className="font-bold mt-6 text-lg">Users</div>
            <div className="my-2">
                <input
                    onChange={(e) => {
                        setSearchString(e.target.value);
                    }}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {users.map((user) => (
                    <User key={user._id} user={user} />
                ))}
            </div>
            {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
        </>
    );
};

function User({ user }) {
    const Navigate = useNavigate();
    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0]}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.firstName} {user.lastName} {user._id}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <Button
                    label={"Send Money"}
                    onClick={() => {
                        Navigate(
                            `/send?id=${user.id}&firstName=${user.firstName}&lastName=${user.lastName}`
                        );
                    }}
                />
            </div>
        </div>
    );
}

export const SendMoney = () => {
    const [searchParam] = useSearchParams();
    const id = searchParam.get("id");
    const firstName = searchParam.get("firstName");
    const lastName = searchParam.get("lastName");
    const [amount, setAmount] = useState("");
    const [isTransactionCompleted, setIsTransactionCompleted] = useState(false);
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");
    const [showBalance, setShowBalance] = useState(false);
    const handleTransfer = async () => {
        try {
            const finalResponse = await axios.post(
                "https://paytm-fgrn.onrender.com/api/v2/account/transfer",
                {
                    to: id,
                    amount: parseInt(amount),
                },
                {
                    headers: {
                        authorization: localStorage.getItem("jwt_token"),
                    },
                }
            );
            if (finalResponse.status === 200) {
                setIsTransactionCompleted(true);
                setResponse(finalResponse.data);
            }
            else {
                setError("An error occurred during the transaction. Please try again.")
            }
        } catch (err) {
            // alert(err.response);
            if (err.response.status === 403) {
                setError(err.response.data.msg);
            } else if (err.response.status === 400) {
                setError(err.response.data.message)
            }
            else {
                setError("An error occurred during the transaction. Please try again.")
            }
        }
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">

                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    {!isTransactionCompleted ? (
                        <>
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h2 className="text-3xl font-bold text-center">
                                    Send Money
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                        <span className="text-2xl text-white">
                                            {firstName.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-semibold">
                                        {lastName}
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            htmlFor="amount"
                                        >
                                            Amount (in Rs)
                                        </label>
                                        <input
                                            type="number"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            id="amount"
                                            placeholder="Enter amount"
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(e.target.value)
                                            }
                                        />
                                    </div>
                                    {error && (
                                        <p className="text-red-500 text-sm">
                                            {error}
                                        </p>
                                    )}
                                    <button
                                        onClick={handleTransfer}
                                        className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                                    >
                                        Initiate Transfer
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h2 className="text-3xl font-bold text-center">
                                    Sucuessfully sent
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-center items-center space-x-4">
                                    <div className="h-18 w-18 rounded-full bg-green-500 flex items-center justify-center">
                                        <p className="text-2xl font-semibold  p-6 text-white">
                                            {amount} RS
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <h2 className="font-semibold"><span className="font-bold text-red-500 ">From: </span>{response.sender}</h2>
                                        <h2 className="font-semibold"><span className="font-bold text-red-500">To: </span>{response.receviver}</h2>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!showBalance) {
                                                setShowBalance(!showBalance)
                                            } else {
                                                setShowBalance(!showBalance)
                                            }
                                        }}
                                        className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                                    >
                                        Click Here To Get Balance
                                    </button>
                                    {showBalance && <h3>Available Balance: {response.BalanceAtSender
                                    }</h3>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>


            </div>

        </div>
    );
};
