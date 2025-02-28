import React, { useState } from "react";

const NumberInput = ({ label, value, setValue }) => {
    const handleIncrement = () => setValue((prev) => Number(prev) + 1);
    const handleDecrement = () => setValue((prev) => Math.max(Number(prev) - 1, 0));

    const handleTextFieldChange = (e) => {
        
        if(value==0){
            console.log("if");
            if (e.target.value.length>=2) {
                setValue(e.target.value.slice(1));
            }else{
                setValue(0)
            }
        }else if(e.target.value===""){
            console.log("else if ");
            
            setValue(0);
        }else{
            console.log("else");
            
            setValue(e.target.value);
        }
    };

    return (
        <div className="space-y-2 flex flex-col gap-[0.2rem] items-start w-full">
            <label className=" text-gray-700 font-medium ">{label}</label>
            <div className="flex items-center space-x-2">

                <input
                    type="number"
                    placeholder="0"
                    value={value}
                    step={'any'}
                    onChange={handleTextFieldChange}
                    tabIndex={0}
                    className="w-full min-w-100 text-center p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
                <button
                    onClick={handleDecrement}
                    tabIndex={-1}
                    className="flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                    −
                </button>
                <button
                    onClick={handleIncrement}
                    tabIndex={-1}
                    className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default NumberInput;
