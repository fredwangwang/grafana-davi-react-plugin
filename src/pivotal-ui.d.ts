/* tslint:disable */
declare module 'pivotal-ui/react/dropdowns' {
  import { ReactNode } from 'react';

  interface IDropdownProps {
    blockingScrim?: boolean; // 	false	If true, blocks mouse events outside of the dropdown. Clicking outside of the dropdown will still close the dropdown.
    buttonAriaLabel?: string; // 	aria-label for the button
    buttonClassName?: string; // 	Classname to add to the button
    closeOnMenuClick?: boolean; // 	true	If false, do not close the menu when clicking in the dropdown menu
    disableScrim?: boolean; // 	false	If true, do not close the menu when clicking outside the dropdown
    flat?: boolean; // 	If true, dropdown toggle has no borders and is transparent
    floatMenu?: boolean; // false	If true, float the dropdown menu. This only applies to the basic dropdown
    icon?: string; // 	'chevron_down'	Name of the icon to use for the toggle icon
    itemClassName?: string; // 	Classname to add to each child li
    link?: boolean; // 	If true, color the dropdown toggle like a link
    menuAlign?: 'none' | 'left' | 'right'; // Sets the alignment of the menu with the button
    scroll?: boolean; // 	false	Enables scrolling in the dropdown menu when enabled
    showIcon?: boolean; // 	true	If false, do not render an icon in the dropdown toggle. Icon can not be hidden if split or leaving out title.
    size?: 'normal' | 'large' | 'small'; // 	Sets the size
    split?: boolean; // 	If true, separates the button text from the toggle
    title?: ReactNode; // 	The button contents
  }

  export class Dropdown extends React.Component<IDropdownProps> {}
}

declare module 'pivotal-ui/react/flyout' {
  interface IFlyoutProps extends React.HTMLAttributes<HTMLInputElement> {
    show: boolean;
    header: string;
    headerClassName: string;
    bodyClassName: string;
    onHide: VoidFunction;
  }

  export class Flyout extends React.Component<IFlyoutProps> {}
}
