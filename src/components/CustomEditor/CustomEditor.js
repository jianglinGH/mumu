import {Slate, Editable, withReact} from 'slate-react'; 
import { createEditor, Editor, Transforms, Text } from 'slate';
import { useState, useCallback } from 'react'; 

function CustomEditor(props) {

    const value = props.value;
    const onChange = props.onChange;
    const [bold, setBold] = useState(true);
    const [italic, setItalic] = useState(true);

    const [editor] = useState(() => withReact(createEditor()));

    const renderElement = useCallback(props => {
        switch(props.element.type) {
            case 'code':
                return <CodeElement {...props}/>
            default:
                return <DefaultElement {...props}/>
        }
    }, [])

    const CodeElement = props => {
        return (
            <pre {...props.attributes}>
                <code>{props.children}</code>
            </pre>
        )
    }

    const DefaultElement = props => {
        return <p {...props.attributes}>{props.children}</p>
    }

    const Leaf = props => {
        return (
            <span
            {...props.attributes}
            style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal', fontStyle: props.leaf.italic ? 'italic' : 'normal' }}
            >
            {props.children}
            </span>
        )
    }

    const renderLeaf = useCallback(props => {
        // console.log(props)
        return <Leaf {...props} />
    }, [])

    return (
        <Slate editor={editor} value={value} onChange={onChange}>
            <Editable 
                renderElement = {renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={event => {
                    if(!event.ctrlKey){return}

                    switch(event.key){
                        case '`': {
                            event.preventDefault();
                            const [match] = Editor.nodes(editor, {
                                match: n => n.type === 'code'
                            })
                            Transforms.setNodes(
                                editor,
                                {type: match? 'paragraph': 'code'},
                                {match: n => Editor.isBlock(editor, n)}
                            )
                            break
                        }

                        // ????????? "B" ??????????????????????????????
                        case 'b': {
                            event.preventDefault() 
                            Transforms.setNodes(
                                editor,
                                { bold: bold },
                                // ???????????????????????????
                                // ?????????????????????????????????????????????????????????????????????
                                { match: n => Text.isText(n), split: true }
                            )
                            setBold(!bold);
                            // bold = !bold;
                            break
                        }

                        // ????????? "B" ??????????????????????????????
                        case 'i': {
                            event.preventDefault() 
                            Transforms.setNodes(
                                editor,
                                { italic: italic },
                                // ???????????????????????????
                                // ?????????????????????????????????????????????????????????????????????
                                { match: n => Text.isText(n), split: true }
                            )
                            setItalic(!italic);
                            // italic = !italic;
                            break
                        }
                    }
                }}
            />
        </Slate>
    )
}

export {CustomEditor}