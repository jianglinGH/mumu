import {Slate, Editable, withReact} from 'slate-react'; 
import { createEditor, Editor, Transforms, Text } from 'slate';
import { useEffect, useContext, useState, useRef, useCallback } from 'react'; 

function CustomEditorView(props) {
    const value = props.value;
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
            style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
            >
            {props.children}
            </span>
        )
    }

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

    return (
        <Slate editor={editor} value={value}>
            <Editable 
                renderElement = {renderElement}
                renderLeaf={renderLeaf}
                readOnly={true}
            />
        </Slate>
    )
}

export {CustomEditorView}