import React from 'react';

interface Props {
  children: React.ReactNode;
}

const S25Frame: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative w-[380px] h-[800px] bg-gray-900 rounded-[24px] shadow-2xl border-4 border-gray-800 overflow-hidden ring-1 ring-gray-700">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 border border-gray-800" />
      
      <div className="w-full h-full bg-black text-white overflow-hidden relative font-sans">
         <div className="absolute top-0 left-0 right-0 h-12 flex justify-between items-center px-6 text-xs font-medium z-40 select-none">
            <span>12:45</span>
            <div className="flex gap-2 items-center">
                <span>5G</span>
                <div className="w-6 h-3 border border-white rounded-sm relative"><div className="absolute top-0 left-0 bg-white h-full w-[80%]"></div></div>
            </div>
         </div>
         {children}
         
      </div>
    </div>
  );
};

export default S25Frame;