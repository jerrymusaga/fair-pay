import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ConnectModal from "../modals/connectModal";
import { useAuth } from "../../context/AuthContext";
import AccountDetails from "../AccountDetails";

const Header = () => {
  const { isConnected, address } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (address) setModalOpen(false);
  }, [address]);

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50  fixed inset-x-0 z-50 md:h-20  py-4 px-10">
      <header className=" flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-700 flex flex-row items-center">
          <div className="w-12 h-12">
          <img src="/lock.png" alt="" />
          </div>
         <div className="mt-6 text-gray-600">
         Fair<span className="text-gray-600">Pay</span>
         </div>
        </Link>

        <nav className="space-x-6 hidden md:flex">
          <Link to="/features" className="hover:text-blue-600 text-xl">
            Features
          </Link>
          <Link to="/howitworks" className="hover:text-blue-600 text-xl">
            How it Works
          </Link>
        </nav>

        <div className="flex items-center  ">
          {isConnected || address ? (
            <div className="">
              <AccountDetails />
            </div>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Get Started
            </button>
          )}
        </div>

        <ConnectModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </header>
    </div>
  );
};

export default Header;
