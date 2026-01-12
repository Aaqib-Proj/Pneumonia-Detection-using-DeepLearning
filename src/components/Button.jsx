import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "btn-primary inline-flex items-center justify-center gap-2";
    const variants = {
        primary: "btn-primary", // Defined in index.css
        outline: "bg-transparent border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white box-shadow-none",
        ghost: "bg-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 box-shadow-none",
    };

    const style = variant !== 'primary' ? `${baseStyle} ${variants[variant]}`.replace('btn-primary', '') : `${baseStyle}`;

    return (
        <button className={`${style} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
