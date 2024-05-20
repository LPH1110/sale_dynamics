import React from 'react';

const UnderDevelopment = () => {
    return (
        <div className="flex items-center justify-center p-6 h-screen-content">
            <div className="space-y-4 text-center">
                <h1 className="text-2xl font-semibold">This site is under development</h1>
                <h4 className="text-gray-600">
                    We are sorry for this inconvenience. You can still try other CMS functions
                </h4>
            </div>
        </div>
    );
};

export default UnderDevelopment;
