import React from "react";

const SubmitButton = ({ text = "Submit", onClick }) => {
    return (
        <button
            type="submit"
            onClick={onClick}
            className="w-full mt-[1rem] justify-center px-6 py-3 bg-blue-500 !text-white text-[#6D28D9] font-semibold text-lg rounded-lg shadow-sm
      flex items-center gap-2 hover:bg-[#C7D2FE] hover:shadow-md transition-all"
        >
            {text}
        </button>
    );
};

export default SubmitButton;
