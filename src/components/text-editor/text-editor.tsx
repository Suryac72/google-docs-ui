/* eslint-disable @typescript-eslint/no-explicit-any */
import Quill from "quill";
import { useCallback, useEffect, useState } from "react";
import 'quill/dist/quill.snow.css';
import './text-editor.css';
import { Socket, io } from "socket.io-client";
import { useParams } from "react-router-dom";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];

const TextEditor: React.FC = () => {
    const [socket, setSocket] = useState<Socket>();
    const [quill, setQuill] = useState<Quill>();
    const {id: documentId} = useParams();
    useEffect(() => {
        const s = io('http://localhost:3001', {
            transports: ['websocket'] 
        });

        s.on('connect_error', (err) => {
            console.error('Connection Error:', err);
        });

        setSocket(s);
        return () => {
            s.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket || !quill) return;

        const handleTextChange = (delta: any,oldDelta: any,source: any) => {
            if (source !== 'user') return;
            console.log(oldDelta);
            socket.emit("send-changes", delta);
        };

        quill.on('text-change', handleTextChange);

        const handleReceiveChanges = (delta: any) => {
            quill.updateContents(delta);
        };

        socket.on('receive-changes', handleReceiveChanges);

        return () => {
            quill.off('text-change', handleTextChange);
            socket.off('receive-changes', handleReceiveChanges);
        };
    }, [socket, quill]);

    useEffect(() => {
        
        if(!socket || !quill) return;
        socket.once('load-document',document =>{
            quill.setContents(document);
            quill.enable();
        })
        socket.emit('get-document',documentId);

    },[socket,quill,documentId])

    useEffect(() => {
        if(!socket || !quill) return;

        const interval = setInterval(() => {
            socket.emit('save-document',quill.getContents());
        },SAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval);
        }
    },[socket,quill])

    const wrapperRef = useCallback((wrapper: any) => {
        if (wrapper === null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
        q.disable();
        q.setText('Loading...');
        setQuill(q);
    }, []);

    return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
