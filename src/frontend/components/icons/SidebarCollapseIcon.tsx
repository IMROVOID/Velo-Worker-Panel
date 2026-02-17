import React from 'react';

export const SidebarCollapseIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={className}
        {...props}
    >
        <path d="M11 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H11zm1 0v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 18.5 4zM3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5zM5.5 7a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1zm0 2a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0 2a.5.5 0 1 1 0-1h4a.5.5 0 1 1 0 1zm0 2a.5.5 0 1 1 0-1h3a.5.5 0 1 1 0 1z" />
    </svg>
);
