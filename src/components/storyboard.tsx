import './storyboard.css';
import { ChangeEvent, useEffect, useState } from "react"
import { GenerateVideoDataElement, StoryboardElement } from "./main_form";

export type StoryBoardProps = { elements?: StoryboardElement[], onChangeStoryboard: (storyboard: GenerateVideoDataElement[]) => void };

export const StoryBoardView = (props: StoryBoardProps): JSX.Element => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [storyboard, setStoryboard] = useState<GenerateVideoDataElement[]>([]);

    const changeStoryBoard = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        if (!e.target.value || !e.target.name) return;
        const tempSb = [...storyboard];
        tempSb[index] = { key: e.target.name, val: e.target.value };
        setStoryboard(tempSb);
    }

    useEffect(() => {

        if (!props.elements || props.elements.length === 0) return;
        setLoading(false);
        setStoryboard(props.elements || []);
    }, [props.elements]);

    useEffect(() => {
        props.onChangeStoryboard(storyboard.map(t => ({ key: t.key, val: t.val })));
    }, [storyboard]);

    return <>
        <div className="varContainer">
            {isLoading ?
                <div className="loading"></div>
                :
                <div className="elementContainer">
                    {storyboard.map((d, i) => <div className="inputContainer" key={i}>
                        <label htmlFor={d.key}>{d.key}</label>
                        <div className="divider"></div>
                        <input id={d.key} type="text" name={d.key} key={i} placeholder={d.key} defaultValue={d.val} className="varInput" onChange={e => changeStoryBoard(e, i)} />
                    </div>)}
                </div>}
        </div>
    </>
}