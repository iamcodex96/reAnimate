/**
 *
 * @param element Target HTMLElement
 * @param property Target CSSProperty
 * @param value Target value or state
 */
export const styleBinder = (element: HTMLElement, property: string) => {
    return (value: number | string): void => {
        element.style[property as any] =
            typeof value === 'number' ? `${value}px` : value;
    };
};

