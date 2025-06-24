import React from 'react';
import CANCELIMAGE from '../assest/cancel.gif';
import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div className='bg-white shadow-lg rounded-lg w-full max-w-md mx-auto p-6 text-center'>
      <img
        src={CANCELIMAGE}
        alt='Payment Cancelled'
        className='w-40 h-40 mx-auto object-cover mb-4 opacity-90'
      />
      <p className='text-purple-700 font-bold text-2xl mb-2'>Payment Cancelled</p>
      <p className='text-gray-500 text-lg mb-6'>
        Your payment has been cancelled. Please try again or go back to your cart.
      </p>
      <Link
        to="/cart"
        className='inline-block  border-2 border-purple-600 text-purple-600 text-lg font-semibold px-6 py-3 rounded-full  hover:text-white hover:bg-purple-700 transition-colors duration-300'
      >
        Go to Cart
      </Link>
    </div>
  );
}

export default Cancel;
