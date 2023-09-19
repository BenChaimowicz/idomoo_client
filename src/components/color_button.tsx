import { ChangeEvent, useRef, useState } from "react"

export type ColorButtonProps = { onColorChangeHandler: (e: string) => void };

export const ColorButton = (props: ColorButtonProps): JSX.Element => {

    const [color, setColor] = useState<string>('');

    const hiddenInput = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        hiddenInput.current?.click();
    }

    const onColorChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return;
        setColor(e.target.value);
        props.onColorChangeHandler(hexToRGB(color));
    }

    const hexToRGB = (hex: string): string => {
        hex = hex.replace(/^#/, '');
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgb(${r},${g},${b})`;
    }

    return <>
        <button onClick={handleClick}>Color</button>
        <input type="color" name="colorInput" style={{ visibility: 'hidden' }} ref={hiddenInput} onChange={onColorChange} />
    </>
}