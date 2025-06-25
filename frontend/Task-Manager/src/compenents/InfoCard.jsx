import React from 'react';

const InfoCard = ({ value, label, color }) => {
  return (
    <div className='flex items-center gap-3'>
      <div className={`w-2 md:w-2 h-3 md:h-5 ${color} rounded-full`} />
      <p className="text-sm md:text-[14px] text-black whitespace-nowrap">
        <span className='text-base md:text-base font-semibold'>{value}</span>
        <span className='ml-1'>{label}</span>
      </p>
    </div>
  );
};

export default InfoCard;
