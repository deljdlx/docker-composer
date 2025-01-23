import React, { ReactNode } from 'react';


type TabProps = {
    children: ReactNode;
    name: string;
    caption: string;
    checked?: boolean;
};

export const Tab: React.FC<TabProps> = ({
    children,
    name,
    caption,
    checked = false,
}) => {

    return (
        <>
            <input
                type="radio"
                name={name}
                role="tab"
                className="tab"
                aria-label={caption}
                defaultChecked={checked}
            />
            <div role="tabpanel" className="tab-content">
                {children}
            </div>
        </>
    )
};

